import { getState, isHost, myPlayer, onPlayerJoin, PlayerState, RPC, useMultiplayerState, usePlayersList } from 'playroomkit';
import { createContext, useContext, useEffect, useRef } from 'react';

/**
 * Rules
 *
 * Villagers against the Werewolf.
 *
 * Wereworlf count = 1/3 of players
 *
 */

// Enum & Types

export enum Roles
{
  Werewolf,
  Seer,
  Witch,
  Villager,
  Count
};

export enum Phases
{
  Start,
  Night,
  VoteMayor,
  Debate,
  VoteVillager,
  GoToSleep,
  GameOver,
  Count
};

export type Message =
{
  author: string;
  time: string;
  message: string;
  photo: string;
  color: string;
}

// Constants

const TimePhase = 90;
const TimePhaseStarting = 15;

export const NightPhaseCardsOrder = [
  Roles.Seer,
  Roles.Werewolf,
  Roles.Witch,
];

export const PhasesTexts = [
  "The party is beginning",
  "The village is sleeping",
  "The village vote for the Mayor",
  "The village debate about a suspect",
  "The village vote the suspect",
  "The village go to bed",
  "won the game",
];

export const NightPhasesTexts = [
  "The Seer wakes up",
  "The werewolves wake up",
  "The witch wakes up",
  "The village wake up"
]

// Setup

type GameEngineContextType = {
  chat: any[];
  timer: number;
  pause: boolean;
  round: number;
  phase: number;
  roles: any[];
  nightPhaseRole: number;
  globalChat: any[];
  werewolvesTarget: string;
  SeerTarget: string;
  witchTarget: string;
  witchKilled: string;
  witchSaved: string;
  setPlayOrPause: (state: boolean) => void;
  sendPlayerMessage: (message: string) => void;
  getPlayer: (authorId: string) => PlayerState | undefined;
  getPlayersAlive: () => PlayerState [];
  getPlayersVoted: (filteredPlayers: PlayerState []) => any;
  // Debug
  phaseEnd: () => void;
};

const GameEngineContext = createContext<GameEngineContextType | undefined>(undefined);

export const GameEngineProvider = ( {children}: any ) => {

  // Game states
  const [launch, setLaunch] = useMultiplayerState("launch", false);
  const [chat, setChat] = useMultiplayerState("chat", []);
  const [timer, setTimer] = useMultiplayerState("timer", 0);
  const [pause, setPause] = useMultiplayerState("pause", false);
  const [round, setRound] = useMultiplayerState("round", 1);
  const [phase, setPhase] = useMultiplayerState("phase", 0);
  const [roles, setRoles] = useMultiplayerState("roles", []);
  const [nightPhaseRole, setNightPhaseRole] = useMultiplayerState("nightPhaseRole", 0);
  const [globalChat, setGlobalChat] = useMultiplayerState("globalChat", []);

  // Roles states
  const [werewolvesTarget, setWerewolfTarget] = useMultiplayerState("wereworlfTarget", "");
  const [SeerTarget, setSeerTarget] = useMultiplayerState("SeerTarget", "");
  const [witchTarget, setWitchTarget] = useMultiplayerState("witchTarget", "");
  const [witchKilled, setWitchKilled] = useMultiplayerState("witchKilled", "");
  const [witchSaved, setWitchSaved] = useMultiplayerState("witchSaved", "");

  // Players states
  const me = myPlayer();
  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const states = {
    chat,
    timer,
    pause,
    round,
    phase,
    roles,
    nightPhaseRole,
    globalChat,
    werewolvesTarget,
    SeerTarget,
    witchTarget,
    witchKilled,
    witchSaved
  };

  // Functions

  const makeRoles = () => {
    const playersCount = players.length;
    const werewolfRoleCount = Math.ceil(playersCount / 3);

    // Format roles
    let roles_: Roles[] = [];
    Array.from({ length: werewolfRoleCount }).map((_, index) =>
      roles_.push(Roles.Werewolf)
    );

    Array.from({ length: playersCount - werewolfRoleCount }).map((_, index) =>
      roles_.push(Math.min(index + 1, Roles.Count - 1) as Roles)
    );
    setRoles(roles_);

    // Shuffle list
    const shuffledRoles = roles_;
    for (let i = shuffledRoles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j], shuffledRoles[i]];
    }

    // Assign roles
    players.forEach((player, index) => {
      player.setState("role", shuffledRoles[index]);
    });
  };

  const phaseEnd = () => {
    let newTime = 0;
    newTime = TimePhase;

    switch (getState("phase"))
    {
      case Phases.Start:
        setPhase(Phases.Night);
        break;
      case Phases.Night:
        phaseNight();
        break;
      case Phases.VoteMayor:
        setPhase(Phases.Debate);
        break;
      case Phases.Debate:
        setPhase(Phases.VoteVillager);
        break;
      case Phases.VoteVillager:
        roundEnd();
        break;
      case Phases.GoToSleep:
        setPhase(Phases.Night)
        break;
      case Phases.GameOver:
        startGame();
        break;
    }

    setTimer(newTime);
    sendNarratorMessage(PhasesTexts[getState("phase")], players);
  }

  const phaseNight = () => {
    const playersAlive = getPlayersAlive();

    switch (NightPhaseCardsOrder[getState("nightPhaseRole")])
    {
      /**
       * Werewolves
       *
       * Each nights, the werewolves vote a player to kill him
       * If there is an equal. A random player is choosen
       */
      case Roles.Werewolf:
        const werewolves = playersAlive.filter(player => player.getState("role") === Roles.Werewolf);
        const voteCounts = getPlayersVoted(werewolves);
        const voteCountsArray = Object.values(voteCounts).map(value => Number(value));
        const maxVotes = Math.max(...voteCountsArray);
        const topTargets = Object.keys(voteCounts).filter(target => voteCounts[target] === maxVotes);
        const selectedTarget = topTargets[Math.floor(Math.random() * topTargets.length)];
        setWerewolfTarget(selectedTarget);
        break;
      /**
       * Seer
       *
       * Each night, the Seer target a player to show his card
       */
      case Roles.Seer:
        const Seer = playersAlive.find(player => player.getState("role") === Roles.Seer);
        if (Seer == undefined)
          break;
        const target: PlayerState = Seer.getState("target");
        if (target == undefined)
          break;
        setSeerTarget(target);
        // Send narrator message
        sendNarratorMessage(target.getProfile().name + " is a " + Roles[target.getState("role")], [ Seer ]);
      /**
       * Witch
       *
       * She Has 2 different potions : Poison and Healing
       * She can use 1 time both of them
       */
      case Roles.Seer:
        const witch = playersAlive.find(player => player.getState("role") === Roles.Witch);
        if (witch == undefined)
          break;
        //@Todo
    }

    // Increment the night phase role
    setNightPhaseRole(getState("nightPhaseRole") + 1);

    // Reset players states
    players.forEach(player => {
      player.setState("target", undefined);
    });

    // End Phase
    if (getState("nightPhaseRole") >= NightPhaseCardsOrder.length) {
      if (getState("round") == 1)
        setPhase(Phases.VoteMayor);
      else
        setPhase(Phases.Debate);
    }
  }

  const roundEnd = () => {
    // Reset night phase role
    setNightPhaseRole(0);

    // Check if it's a game over
    if (isGameOver()) {
      setPhase(Phases.GameOver);
      sendNarratorMessage("Game Over", players);
      // Or continue the next round
    } else {
      setRound(getState("round") + 1)
      setPhase(Phases.GoToSleep);
    }
  }

  const isGameOver = (): boolean => {
    return false;
  }

  const startGame = () => {
    if (isHost()) {
      // Default init
      setTimer(TimePhaseStarting, true);
      setRound(1, true);
      setPhase(Phases.Start, true);
      setNightPhaseRole(0, true);
      // Setup game
      makeRoles();
      // Send narrator message
      sendNarratorMessage("The game started", players);
    }
  }

  const sendNarratorMessage = async (message: string, targetsPlayers: PlayerState []) => {
    // Format time
    const formattedTime = new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

    // Fetch narrator message from OpenAI API
    // const narratorMessage = await fetchNarratorMessage(message);

    // Send message
    setGlobalChat(
    [
      ...chat,
      { targets: targetsPlayers, message: { message: message, time: formattedTime, author: "Narrator" } }
    ]);
  };

  // Exposed functions

  const setPlayOrPause = (state: boolean): void => {
    setPause(state);
  };

  const getPlayer = (authorId: string): PlayerState | undefined => {
    const player = players.find((player) => player.id == authorId);

    if (player == undefined)
      return undefined;
    return player;
  };

  const getPlayersAlive = (): PlayerState[] => {
    return players.filter(player => player.getState("dead") == undefined);
  };

  const getPlayersVoted = (filteredPlayers: PlayerState []): any => {
    const targets = filteredPlayers.map(player => player.getState("target"));
    return targets.reduce((acc, target) => {
        acc[target] = (acc[target] || 0) + 1;
      return acc;
    }, {});
  }

  const sendPlayerMessage = (message: string) => {
    // Check if role is defined
    const role = me.getState("role");
    if (role == undefined)
      return;

    // Select players targets
    let targetsPlayers = players;
    // Dead players send message to dead players
    if (me.getState("dead"))
      targetsPlayers = players.filter((target) => target.getState("dead"));
    // Players send message to role mates in night phase
    else if (getState("phase") == Phases.Night)
      targetsPlayers = players.filter((target) => target.getState("role") == me.getState("role"));

    // Format time
    const formattedTime = new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

    // Send message
    const profile = me.getProfile();
    setGlobalChat(
    [
      ...globalChat,
      { targets: targetsPlayers, message: { message: message, time: formattedTime, author: profile.name, photo: profile.photo, color: profile.color.hexString } }
    ]);
  };

  // GPT

  const fetchNarratorMessage = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error fetching narrator message:', error);
      return 'An error occurred while fetching the narrator message.';
    }
  };

  // Hooks

  useEffect(() => {
    if (!launch) {
      startGame();
      setLaunch(true);
    }
  }, []);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHost()) {
      timerInterval.current = setInterval(() => {
          if (getState("pause"))
            return;
          let newTime = getState("timer") - 1;
          if (newTime <= 0)
            phaseEnd();
          else
            setTimer(newTime, true);
      }, 1000);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [phase]);

  return (
    <GameEngineContext.Provider value={{
      ...states,
      setPlayOrPause,
      sendPlayerMessage,
      getPlayer,
      getPlayersAlive,
      getPlayersVoted,
      // Debug
      phaseEnd,
    }}>
      {children}
    </GameEngineContext.Provider>
  )
}

export const useGameEngine = (): GameEngineContextType => {
  const context = useContext(GameEngineContext);
  if (context === undefined) {
    throw new Error('useGameEngine must be used within a GameEngine');
  }
  return context;
}