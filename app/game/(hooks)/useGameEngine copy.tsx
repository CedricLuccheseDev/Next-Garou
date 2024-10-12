import { getState, isHost, myPlayer, PlayerState, useMultiplayerState, usePlayersList } from 'playroomkit';
import { createContext, useContext, useEffect, useRef } from 'react';
import { Message } from './types';
import { PhasesTexts } from './constants';
import { Roles } from './enums';

// Setup

type GameEngineContextType = {
  chat: any[];
  timer: number;
  pause: boolean;
  round: number;
  phase: number;
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
  const [launch, setLaunch] = useMultiplayerState("launch", false);
  const [chat] = useMultiplayerState("chat", []);
  const [timer, setTimer] = useMultiplayerState("timer", 0);
  const [pause, setPause] = useMultiplayerState("pause", false);
  const [round, setRound] = useMultiplayerState("round", 1);
  const [phase, setPhase] = useMultiplayerState("phase", 0);
  const [roles, setRoles] = useMultiplayerState("roles", []);
  const [globalChat, setGlobalChat] = useMultiplayerState("globalChat", []);

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
      const werewolves = GetPlayersAlive().filter(player => player.getState("role") === Roles.Werewolf);
      const voteCounts = GetPlayersVoted(werewolves);
      const maxVotes = Math.max(...Object.values(voteCounts as number));
      const topTargets = Object.keys(voteCounts).filter(target => voteCounts[target] === maxVotes);
      const selectedTarget = topTargets[Math.floor(Math.random() * topTargets.length)];
      setWerewolfTarget(selectedTarget);
    },
    [Roles.Seer]: () => {
      const seer = GetPlayersAlive().find(player => player.getState("role") === Roles.Seer);
      if (seer) {
        const target: PlayerState = seer.getState("target");
        if (target) {
          setSeerTarget(target);
          _sendNarratorMessage(`${target.getProfile().name} is a ${Roles[target.getState("role")]}`, [seer]);
        }
      }
    },
    [Roles.Witch]: () => {
      const witch = GetPlayersAlive().find(player => player.getState("role") === Roles.Witch);
      // Ajoute ici la logique pour la sorcière
    },
    [Roles.Villager]: function (): void {
      throw new Error('Function not implemented.');
    },
    [Roles.Count]: function (): void {
      throw new Error('Function not implemented.');
    }
  };

  const phaseHandlers: Record<Phases, () => void> = {
    [Phases.Start]: () => {
      setTimer(TimePhase);
    },
    [Phases.Night]: () => {
      setTimer(TimePhase);
    },
    [Phases.NightRole0]: () => {
      setTimer(TimePhase);
    },
    [Phases.NightRole1]: () => {
      setTimer(TimePhase);
    },
    [Phases.NightRole2]: () => {
      setTimer(TimePhase);
    },
    [Phases.WakeUp]: () => {
      setTimer(TimePhaseInterlude);
    },
    [Phases.VoteMayor]: () => {
      setTimer(TimePhase);
    },
    [Phases.Debate]: () => {
      setTimer(TimePhase);
    },
    [Phases.VoteVillager]: () => {
      setTimer(TimePhase);
    },
    [Phases.Execution]: () => {
      setTimer(TimePhase);
      // Check if it's a game over
      if (_isGameOver()) {
        _sendNarratorMessage("Game Over", players);
      // Or continue the next round
      } else {
        setRound(getState("round") + 1)
      }
    },
    [Phases.End]: () => {
      setTimer(TimePhase);
    },
    [Phases.Count]: () => {
      throw new Error('Function not implemented.');
    }
  };

  const phaseTransition: Record<Phases, () => void> = {
    [Phases.Start]: () => {
      _setPhase(Phases.Night);
    },
    [Phases.Night]: () => {
      _setPhase(Phases.Night);
    },
    [Phases.Seer]: () => {
      _setPhase(Phases.Werewolf)
      _processRolesActions()
    },
    [Phases.Werewolf]: () => {
      _setPhase(Phases.Witch)
      _processRolesActions()
    },
    [Phases.Witch]: () => {
      _setPhase(Phases.WakeUp)
      _processRolesActions()
    },
    [Phases.WakeUp]: () => {
      if (round == 1)
        _setPhase(Phases.VoteMayor);
      else
        _setPhase(Phases.Debate);
    },
    [Phases.VoteMayor]: () => {
      _setPhase(Phases.Debate);
    },
    [Phases.Debate]: () => {
      _setPhase(Phases.VoteVillager);
    },
    [Phases.VoteVillager]: () => {
      _setPhase(Phases.Execution);
    },
    [Phases.Execution]: () => {
      // Check if it's a game over
      if (_isGameOver()) {
        _setPhase(Phases.End);
      // Or continue the next round
      } else {
        _setPhase(Phases.Night);
      }
    },
    [Phases.End]: () => {
      setTimer(TimePhase);
    },
    [Phases.Count]: () => {
      throw new Error('Function not implemented.');
    }
  };

  const states = {
    chat,
    timer,
    pause,
    round,
    phase,
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
    roles_.push(...Array(playersCount - werewolfRoleCount).fill(0).map((_, index) => Math.min(index + 1, Roles.Count - 1)));

    // Shuffle
    const shuffledRoles = roles_.sort(() => Math.random() - 0.5);

    // Attribution des rôles
    players.forEach((player, index) => {
      player.setState("role", shuffledRoles[index]);
    });
  };

  const _setPhase = (phase_: Phases) => {
    if (getState("phase") == phase_)
      return;

    // Set phase
    setPhase(phase_);

    // Send message
    _sendNarratorMessage(PhasesTexts[phase_], players);
  }

  const _onTimerCompleted = () => {
    let phase = getState("phase") as Phases;
    if (phaseTransition[phase]) {
      phaseTransition[phase]();
    }

    phase = getState("phase") as Phases;
    if (phaseHandlers[phase]) {
      phaseHandlers[phase]();
    }
  }

  const _processRolesActions = () => {
    if (roleActions[getState("roles") as Roles]) {
      roleActions[getState("roles") as Roles]();
    }

    // Reset des cibles des joueurs
    players.forEach(player => player.setState("target", undefined));
  }

  const _isGameOver = (): boolean => {
    return false;
  }

  const _startGame = () => {
    if (isHost()) {
      // Default init
      setTimer(TimePhaseInterlude, true);
      setRound(1, true);
      _setPhase(Phases.Start);
      setGlobalChat([], true);

      // Setup game
      _makeRoles();

      // Send narrator message
      _sendNarratorMessage("The game started, you are " + Roles[me.getState("role")], players);
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
    return players.filter((player: { getState: (arg0: string) => undefined; }) => player.getState("dead") == undefined);
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
    const role = me.getState("role");
    if (role == undefined)
      return;

    // Select players targets
    let targetsPlayers = players;
    // Dead players send message to dead players
    if (me.getState("dead"))
      targetsPlayers = players.filter((target: { getState: (arg0: string) => any; }) => target.getState("dead"));
    // Players send message to role mates in night phase
    else if (getState("phase") == Phases.Night)
      targetsPlayers = players.filter((target: { getState: (arg0: string) => any; }) => target.getState("role") == me.getState("role"));

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
          if (getState("pause"))
            return;
          const newTime = getState("timer") - 1;
          if (newTime <= 0)
            _onTimerCompleted();
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