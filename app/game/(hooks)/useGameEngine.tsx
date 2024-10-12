import { getState, isHost, myPlayer, PlayerState, useMultiplayerState, usePlayersList } from 'playroomkit';
import { createContext, useContext, useEffect, useRef } from 'react';
import { Message, Phase } from './types';
import { NightPhaseOrder, NightPhaseTexts } from './constants';
import { Phases, Roles, States } from './enums';

// Setup

type GameEngineContextType = {
  timer: number;
  pause: boolean;
  round: number;
  phase: number;
  nightPhase: number;
  roles: any[];
  globalChat: any[];
  werewolvesTarget: string;
  SeerTarget: string;
  witchTarget: string;
  witchKilled: string;
  witchSaved: string;
  SetPlayOrPause: (state: boolean) => void;
  SendPlayerMessage: (message: string) => void;
  GetPlayer: (authorId: string) => PlayerState | undefined;
  GetPlayersAlive: () => PlayerState [];
  GetPlayersVoted: (filteredPlayers: PlayerState []) => any;
  // Debug
  DebugPhaseEnd: () => void;
};

const GameEngineContext = createContext<GameEngineContextType | undefined>(undefined);

export const GameEngineProvider = ( {children}: any ) => {

  // Game states
  const [launch, setLaunch] = useMultiplayerState(States.Launch, false);
  const [globalChat, setGlobalChat] = useMultiplayerState(States.GlobalChat, []);
  const [timer, setTimer] = useMultiplayerState(States.Timer, 30);
  const [pause, setPause] = useMultiplayerState(States.Pause, false);
  const [round, setRound] = useMultiplayerState(States.Round, 1);
  const [phase, setPhase] = useMultiplayerState(States.Phase, 0);
  const [nightPhase, setNightPhase] = useMultiplayerState(States.NightPhase, 0);
  const [roles, setRoles] = useMultiplayerState(States.Roles, []);

  // Players states
  const me = myPlayer();
  const players = usePlayersList(true);
  players.sort((a: { id: string; }, b: { id: any; }) => a.id.localeCompare(b.id));

  // Roles states
  const [werewolvesTarget, setWerewolfTarget] = useMultiplayerState("wereworlfTarget", "");
  const [SeerTarget, setSeerTarget] = useMultiplayerState("SeerTarget", "");
  const [witchTarget, setWitchTarget] = useMultiplayerState("witchTarget", "");
  const [witchKilled, setWitchKilled] = useMultiplayerState("witchKilled", "");
  const [witchSaved, setWitchSaved] = useMultiplayerState("witchSaved", "");

  // Roles actions
  const roleActions: Record<Roles, () => void> = {
    [Roles.Werewolf]: () => {
      const werewolves = GetPlayersAlive().filter(player => player.getState(States.Role) === Roles.Werewolf);
      const voteCounts = GetPlayersVoted(werewolves);
      const maxVotes = Math.max(...Object.values(voteCounts as number));
      const topTargets = Object.keys(voteCounts).filter(target => voteCounts[target] === maxVotes);
      const selectedTarget = topTargets[Math.floor(Math.random() * topTargets.length)];
      setWerewolfTarget(selectedTarget);
    },
    [Roles.Seer]: () => {
      const seer = GetPlayersAlive().find(player => player.getState(States.Role) === Roles.Seer);
      if (seer) {
        const target: PlayerState = seer.getState("target");
        if (target) {
          setSeerTarget(target);
          _sendNarratorMessage(`${target.getProfile().name} is a ${Roles[target.getState(States.Role)]}`, [seer]);
        }
      }
    },
    [Roles.Witch]: () => {
      // const witch = GetPlayersAlive().find(player => player.getState(States.Role) === Roles.Witch);
    }
  };

  // Phases
  const phasesHandlers: Record<Phases, Phase> = {
    [Phases.Night]: {
      time: 30,
      message: "It's night time",
      nextPhase: Phases.WakeUp,
      initFunc: () => {
        setNightPhase(0);
        _sendNarratorMessage(NightPhaseTexts[0], players);
        console.log("init");
      },
      updateFunc: () => {
        _sendNarratorMessage(NightPhaseTexts[nightPhase + 1], players);
      },
      endFunc: () => {
        roleActions[NightPhaseOrder[nightPhase]];
        players.forEach(player => player.setState("target", undefined));
        setNightPhase(nightPhase + 1);
      },
      isFinishedFunc: () => {
        return nightPhase == NightPhaseOrder.length - 1;
      }
    },
    [Phases.WakeUp]: {
      time: 10,
      message: 'Somebody is dead',
      nextPhase: Phases.Discussion,
      initFunc: () => { },
      updateFunc: () => {},
      endFunc: () => { },
      isFinishedFunc: () => { return true; }
    },
    [Phases.Discussion]: {
      time: 90,
      message: 'Lets discuss',
      nextPhase: Phases.Vote,
      initFunc: () => { },
      updateFunc: () => {},
      endFunc: () => { },
      isFinishedFunc: () => { return true; },
    },
    [Phases.Vote]: {
      time: 15,
      message: 'Lets vote',
      nextPhase: Phases.Execution,
      initFunc: () => { },
      updateFunc: () => {},
      endFunc: () => { },
      isFinishedFunc: () => { return true; },
    },
    [Phases.Execution]: {
      time: 10,
      message: 'Is dead',
      nextPhase: Phases.Night,
      initFunc: () => { },
      updateFunc: () => {},
      endFunc: () => { setRound(round + 1); },
      isFinishedFunc: () => { return true; },
    }
  };

  const states = {
    timer,
    pause,
    round,
    phase,
    nightPhase,
    roles,
    globalChat,
    werewolvesTarget,
    SeerTarget,
    witchTarget,
    witchKilled,
    witchSaved
  };

  /**
   * Static functions
   */

  const _makeRoles = () => {
    const playersCount = players.length;
    const werewolfRoleCount = Math.ceil(playersCount / 3);
    let roles_: Roles[] = [];
    // Add werewolves
    roles_.push(...Array(werewolfRoleCount).fill(Roles.Werewolf));
    // Add others
    roles_.push(...Array(playersCount - werewolfRoleCount).fill(0).map((_, index) => Math.min(index + 1, (Object.keys(Roles).length / 2) - 1)));

    // Shuffle
    const shuffledRoles = roles_.sort(() => Math.random() - 0.5);

    // Set roles
    setRoles(roles_);

    // Attribution des rôles
    players.forEach((player, index) => {
      player.setState(States.Role, shuffledRoles[index]);
    });
  };

  const _onTimerCompleted = () => {
    // Launch end phase
    const phaseHandler = phasesHandlers[phase as Phases] as Phase;
    phaseHandler.endFunc();

    // Next phase
    const nextIndex = (phase + 1) % (Object.keys(Phases).length / 2);
    const nextPhaseHandler = phasesHandlers[nextIndex as Phases] as Phase;
    if (phaseHandler.isFinishedFunc()) {
      setPhase(nextIndex);
      _sendNarratorMessage(nextPhaseHandler.message, players);
      nextPhaseHandler.initFunc();
      setTimer(nextPhaseHandler.time);
    } else {
      phaseHandler.updateFunc();
      setTimer(phaseHandler.time);
    }
  }

  const _isGameOver = (): boolean => {
    return false;
  }

  const _startGame = () => {
    if (isHost()) {
      // Default init
      setRound(1, true);
      setPhase(0);
      setGlobalChat([], true);

      // Setup game
      _makeRoles();

      // Send narrator message
      _sendNarratorMessage("The game started, you are " + Roles[me.getState(States.Role)], players);

      // Init first phase
      const phaseHandler = phasesHandlers[phase as Phases] as Phase;
      phaseHandler.initFunc();
      setTimer(phaseHandler.time);

      console.log("Game Started");
    }
  }

  const _sendNarratorMessage = async (text: string, targetsPlayers: PlayerState []) => {
    // Format time
    const formattedTime = new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

    // Fetch narrator message from OpenAI API
    // const narratorMessage = await fetchNarratorMessage(message);

    const narratorMessage: Message = {
      id: globalChat.length,
      targets: targetsPlayers,
      text: text,
      time: formattedTime,
      author: "Narrator"
    }

    // Send message
    setGlobalChat(
    [
      ...globalChat,
      narratorMessage
    ]);
  };

  /**
   * Public functions
   */

  const SetPlayOrPause = (state: boolean): void => {
    setPause(state);
  };

  const GetPlayer = (authorId: string): PlayerState | undefined => {
    const player = players.find((player: { id: string; }) => player.id == authorId);

    if (player == undefined)
      return undefined;
    return player;
  };

  const GetPlayersAlive = (): PlayerState[] => {
    return players.filter((player: { getState: (arg0: string) => undefined; }) => player.getState(States.Dead) == undefined);
  };

  const GetPlayersVoted = (filteredPlayers: PlayerState []): any => {
    const targets = filteredPlayers.map(player => player.getState("target"));
    return targets.reduce((acc, target) => {
        acc[target] = (acc[target] || 0) + 1;
      return acc;
    }, {});
  }

  const SendPlayerMessage = (text: string) => {
    // Check if role is defined
    const role = me.getState(States.Role);
    if (role == undefined)
      return;

    // Select players targets
    let targetsPlayers = players;
    // Dead players send message to dead players
    if (me.getState(States.Dead))
      targetsPlayers = players.filter((target: { getState: (arg0: string) => any; }) => target.getState(States.Dead));
    // Players send message to role mates in night phase
    else if (getState("phase") == Phases.Night)
      targetsPlayers = players.filter((target: { getState: (arg0: string) => any; }) => target.getState(States.Role) == me.getState(States.Role));

    // Format time
    const formattedTime = new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

    // Format message
    const profile = me.getProfile();
    const playerMessage: Message = {
      id: globalChat.length,
      targets: targetsPlayers,
      text: text,
      time: formattedTime,
      author: profile.name,
      photo: profile.photo,
      color: profile.color.hexString,
    }

    // Send message
    setGlobalChat(
    [
      ...globalChat,
      playerMessage
    ]);
  };

  const DebugPhaseEnd = () => {
    _onTimerCompleted();
  }

  /**
   * GPT functions
   */

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

  /**
   * Hooks
   */

  useEffect(() => {
    if (!launch) {
      _startGame();
      setLaunch(true);
    }
  }, [launch]);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHost()) {
      timerInterval.current = setInterval(() => {
          if (getState(States.Pause))
            return;
          const newTime = getState(States.Timer) - 1;
          if (newTime <= 0)
            _onTimerCompleted();
          else
            setTimer( newTime, true);
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
      SetPlayOrPause,
      SendPlayerMessage,
      GetPlayer,
      GetPlayersAlive,
      GetPlayersVoted,
      DebugPhaseEnd
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