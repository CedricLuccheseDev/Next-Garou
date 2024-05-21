import { isHost, onPlayerJoin, PlayerState, useMultiplayerState, usePlayersList } from 'playroomkit';
import { createContext, useContext, useEffect } from 'react';

/**
 * Rules
 *
 * Villagers against the Werewolf.
 *
 * Wereworlf count = 1/3 of players
 *
 */

// Enum

export enum Roles
{
  Werewolf,
  Soothsayer,
  Witch,
  Hunter,
  Villager,
  Count
};

export enum Phases
{
  NightAction,
  VoteMayor,
  Debate,
  VoteVillager,
  Count
};

// Constants

const TimePhase = 120;
const TimePhaseStarting = 30;

const MinPlayers = 5;
const MaxPlayers = 12;

const PhasesOrder = [
  Phases.NightAction,
  Phases.VoteMayor,
  Phases.Debate,
  Phases.VoteVillager,
];

const NightActionPhaseCardsOrder = [
  Roles.Soothsayer,
  Roles.Werewolf,
  Roles.Witch,
  Roles.Villager,
];

// Setup

type GameEngineContextType = {
  chat: any[];
  timer: number;
  round: number;
  phase: number;
  roles: any[];
  nightActionPhaseRole: number;
  sendMessage: (author: string, msg: string) => void;
  getPlayer: (authorId: string) => PlayerState | undefined;
};

const GameEngineContext = createContext<GameEngineContextType | undefined>(undefined);

export const GameEngineProvider = ( {children}: any ) => {

  // Game States

  const [launch, setLaunch] = useMultiplayerState("launch", false);
  const [chat, setChat] = useMultiplayerState("chat", []);
  const [timer, setTimer] = useMultiplayerState("timer", 0);
  const [round, setRound] = useMultiplayerState("round", 1);
  const [phase, setPhase] = useMultiplayerState("phase", 0);
  const [roles, setRoles] = useMultiplayerState("roles", []);
  const [nightActionPhaseRole, setNightActionPhaseRole] = useMultiplayerState("nightActionPhaseRole", 0);

  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id));

  const gameState = {
    chat,
    timer,
    round,
    phase,
    roles,
    nightActionPhaseRole
  };

  // Functions

  const makeRoles = () => {
    // Create roles

    const playersCount = players.length;
    const werewolfRoleCount = Math.ceil(playersCount / 3);

    let roles_: Roles[] = [];

    Array.from({ length: werewolfRoleCount }).map((_, index) =>
      roles_.push(Roles.Werewolf)
    );

    Array.from({ length: playersCount - werewolfRoleCount }).map((_, index) =>
      roles_.push(Math.min(index + 1, Roles.Count - 1) as Roles)
    );

    // Set roles
    setRoles(roles_);

    const shuffledRoles = roles_;

    // Shuffle list
    for (let i = shuffledRoles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j], shuffledRoles[i]];
    }

    // Assign roles
    players.forEach((player, index) => {
      player.setState("role", shuffledRoles[index]);
    });
  };

  const startGame = () => {
    if (isHost()) {
      // Default init
      setTimer(TimePhase, true);
      setRound(1, true);
      setPhase(0, true);
      setNightActionPhaseRole(0, true);
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

  return (
    <GameEngineContext.Provider value={{
      ...gameState,
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