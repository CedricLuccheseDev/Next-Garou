import { getState, isHost, onPlayerJoin, PlayerState, useMultiplayerState, usePlayersList } from 'playroomkit';
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
  Soothsayer,
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

type WitchData = {
  playerProtected: string | undefined;
  playerKilled: string | undefined;
};

// Constants

const TimePhase = 90;
const TimePhaseStarting = 15;

const NightPhaseCardsOrder = [
  Roles.Soothsayer,
  Roles.Werewolf,
  Roles.Witch,
  Roles.Villager,
];

export const PhasesTexts = [
  "The village is sleeping",
  "The village vote for the Mayor",
  "The village debate about a suspect",
  "The village vote the suspect"
];

// Setup

type GameEngineContextType = {
  chat: any[];
  timer: number;
  round: number;
  phase: number;
  roles: any[];
  nightPhaseRole: number;
  werewolvesTarget: string;
  soothsayerTarget: string;
  witchTarget: string;
  witchKilled: string;
  witchSaved: string;
  sendMessage: (author: string, msg: string) => void;
  getPlayer: (authorId: string) => PlayerState | undefined;
};

const GameEngineContext = createContext<GameEngineContextType | undefined>(undefined);

export const GameEngineProvider = ( {children}: any ) => {

  // Game states
  const [launch, setLaunch] = useMultiplayerState("launch", false);
  const [chat, setChat] = useMultiplayerState("chat", []);
  const [timer, setTimer] = useMultiplayerState("timer", 0);
  const [round, setRound] = useMultiplayerState("round", 1);
  const [phase, setPhase] = useMultiplayerState("phase", 0);
  const [roles, setRoles] = useMultiplayerState("roles", []);
  const [nightPhaseRole, setNightPhaseRole] = useMultiplayerState("nightPhaseRole", 0);

  // Roles states
  const [werewolvesTarget, setWerewolfTarget] = useMultiplayerState("wereworlfTarget", "");
  const [soothsayerTarget, setSoothsayerTarget] = useMultiplayerState("soothsayerTarget", "");
  const [witchTarget, setWitchTarget] = useMultiplayerState("witchTarget", "");
  const [witchKilled, setWitchKilled] = useMultiplayerState("witchKilled", "");
  const [witchSaved, setWitchSaved] = useMultiplayerState("witchSaved", "");

  // Players states
  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const states = {
    chat,
    timer,
    round,
    phase,
    roles,
    nightPhaseRole,
    werewolvesTarget,
    soothsayerTarget,
    witchTarget,
    witchKilled,
    witchSaved
  };

  // Functions

  const makeRoles = () => {
    const playersCount = players.length;
    const werewolfRoleCount = Math.ceil(playersCount / 3);
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
  }

  const phaseNight = () => {
    const playersAlive = getPlayersAlive();

    switch (NightPhaseCardsOrder[getState("nightPhaseRole")])
    {
      /**
       * Villagers
       *
       * Go to the next phases
       */
      case Roles.Villager:
        if (getState("round") == 0)
          setPhase(Phases.VoteMayor);
        else
          setPhase(Phases.Debate);
        break;
      /**
       * Werewolves
       *
       * Each nights, the werewolves vote a player to kill him
       * If there is an equal. A random player is choosen
       */
      case Roles.Werewolf:
        const werewolves = playersAlive.filter(player => player.getState("role") === Roles.Werewolf);
        const targets = werewolves.map(player => player.getState("target"));
        const voteCounts = targets.reduce((acc, target) => {
          acc[target] = (acc[target] || 0) + 1;
          return acc;
        }, {});
        const voteCountsArray = Object.values(voteCounts).map(value => Number(value));
        const maxVotes = Math.max(...voteCountsArray);
        const topTargets = Object.keys(voteCounts).filter(target => voteCounts[target] === maxVotes);
        const selectedTarget = topTargets[Math.floor(Math.random() * topTargets.length)];
        setWerewolfTarget(selectedTarget);
        break;
      /**
       * Soothsayer
       *
       * Each night, the soothsayer target a player to show his card
       */
      case Roles.Soothsayer:
        const soothsayer = playersAlive.find(player => player.getState("role") === Roles.Soothsayer);
        if (soothsayer == undefined)
          break;
        const target = soothsayer.getState("target");
        if (target == undefined)
          break;
        setSoothsayerTarget(target);
      /**
       * Witch
       *
       * She Has 2 different potions : Poison and Healing
       * She can use 1 time both of them
       */
      case Roles.Soothsayer:
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
  }

  const roundEnd = () => {
    // Reset night phase role
    setNightPhaseRole(0);

    // Check if it's a game over
    if (isGameOver())
      setPhase(Phases.GameOver);
    // Or continue the next round
    else {
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
      // Log
      console.log("Start game");
    }
  }

  // Exposed functions

  const getPlayer = (authorId: string): PlayerState | undefined => {
    const player = players.find((player) => player.id == authorId);

    if (player == undefined)
      return undefined;
    return player;
  }

  const getPlayersAlive = (): PlayerState[] => {
    return players.filter(player => player.getState("dead") == undefined);
  };

  const sendMessage = ( authorId: string, msg: string ) => {
    const player = players.find((player) => player.id == authorId);
    const role = player?.getState("role");

    if (player == undefined || role == undefined)
      return;

    setChat([
      ...chat,
      player?.getProfile().name + " [" + Roles[player.getState("role")] + "] " +  " : " + msg
    ]);
  };

  // Hooks

  useEffect(() => {
    if (!launch) {
      startGame();
      setLaunch(true);
    }
  });

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHost()) {
      timerInterval.current = setInterval(() => {
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
      sendMessage,
      getPlayer,
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