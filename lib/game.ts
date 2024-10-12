/** @brief Roles enumeration */
export enum Roles
{
  Seer,
  Werewolf,
  Witch,
  Villager
};

/** @brief Phases enumeration */
export enum Phases
{
  Night,
  WakeUp,
  Discussion,
  Vote,
  Execution
}

/** @brief Player structure */
export type Player = {
  id: string;
  name: string;
  role: Roles
  isAlive: boolean;
};

/** @brief Phase structure */
export type Phase =
{
  time: number;
  message: string;
  nextPhase: Phases;
  initFunc: () => void;
  updateFunc: () => void;
  endFunc: () => void;
  isFinishedFunc: () => boolean;
}

/** @brief Message structure */
export type Message =
{
  id: number;
  targets: Player[];
  author: string;
  time: string;
  text: string;
  photo?: string;
  color?: string;
}

/** @brief Game class */
export class Game {
/**
 *  Public
 */
  /** @brief Constructor */
  constructor(id: string, players: Player[] = []) {
    this.id = id;
    this.players = players;
  }

  /** @brief Get game id */
  public getId(): string { return this.id; }


  /** @brief Get players */
  public getPlayers(): Player[] { return this.players; }

  /** @brief Get the count of players */
  public getPlayerCount(): number { return this.players.length; }

  /** @brief Add a new player */
  public addPlayer(playerId: string, name: string) {
    const player: Player = { id: playerId, name, role: Roles.Werewolf, isAlive: true };
    this.players.push(player);
  }

  /** @brief Remove a player */
  public removePlayer(playerId: string) {
    this.players = this.players.filter(player => player.id !== playerId);
  }

  /** @brief Get messages */
  public getMessages(): Message[] { return this.messages; }


  /** @brief Get players role */
  public getRoles(): Roles[] { return this.players.map(player => player.role); }


  /** @brief Get timer */
  public getTimer(): number { return this.timer; }


  /** @brief Get phase */
  public getPhase(): number { return this.phase; }


  /** @brief Get round */
  public getRound(): number { return this.round; }


  /** @brief Start or Restart a game */
  start(): void {
    // Clear data
    this.phase = Phases.Night;
    this.round = 0;
    this.messages = [];

    // Assign roles
    this.assignRoles();

    // Start game
    this.isStarted = true;
  }

/**
 * Private
 */
  private assignRoles() {
    const playersCount = this.players.length;
    const rolesCount = Object.keys(Roles).length / 2;
    const werewolfRoleCount = Math.ceil(playersCount / 3);
    let roles_: Roles[] = [];
    // Add werewolves
    roles_.push(...Array(werewolfRoleCount).fill(Roles.Werewolf));
    // Add others
    roles_.push(...Array(playersCount - werewolfRoleCount).fill(0).map((_, index) => Math.min(index + 1, rolesCount - 1)));

    // Shuffle
    const shuffledRoles = roles_.sort(() => Math.random() - 0.5);

    // Attribution des rôles
    this.players.forEach((player, index) => {
      player.role = shuffledRoles[index];
    });
  }


  /** @brief Game id */
  private id: string;

  /** @brief Players */
  private players: Player[] = [];

  /** @brief Messages */
  private messages: Message[] = [];

  /** @brief Phase */
  private phase: Phases = Phases.Night;

  /** @brief Round */
  private round: number = 0;

  /** @brief Timer */
  private timer: number = 30;

  /** @brief Is started */
  private isStarted: boolean = false;
}

// vote(voterId: string, targetId: string) {
//   this.votes[voterId] = targetId;
// }

// resolveVotes() {
//   const voteCount: Record<string, number> = {};

//   Object.values(this.votes).forEach((vote) => {
//     voteCount[vote] = (voteCount[vote] || 0) + 1;
//   });

//   const [eliminatedPlayerId] = Object.entries(voteCount).sort(
//     (a, b) => b[1] - a[1]
//   )[0];

//   const eliminatedPlayer = this.players.find((p) => p.id === eliminatedPlayerId);
//   if (eliminatedPlayer) {
//     eliminatedPlayer.isAlive = false;
//   }

//   this.votes = {};
// }
