/** @brief Game update callback  */
type GameUpdateCallback = (game: Game) => void;

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
  constructor(id: string, gameUpdateCallback: GameUpdateCallback) {
    this._id = id;
    this._onGameUpdate = gameUpdateCallback;
  }

  /** @brief Get game id */
  public get id(): string { return this._id; }


  /** @brief Get players */
  public get players(): Player[] { return this._players; }

  /** @brief Get the count of players */
  public get playersCount(): number { return this.players.length; }

  /** @brief Add a new player */
  public addPlayer(playerId: string, name: string) {
    // Add player
    this._players.push({ id: playerId, name, role: Roles.Werewolf, isAlive: true } as Player);
    // Emit event
    this._emitGameUpdate();
  }

  /** @brief Remove a player */
  public removePlayer(playerId: string) {
    // Remove player
    this._players = this.players.filter(player => player.id !== playerId);
    // Emit event
    this._emitGameUpdate();
  }


  /** @brief Get messages */
  public get messages(): Message[] { return this._messages; }

  /** @brief Send message by player */
  public sendMessageByPlayer(userId: string, text: string): void {
    // Get player
    const player = this.players.find(player => player.id !== userId) as Player;
    // Select players targets
    let targetsPlayers = this.players.filter((target: Player) => target.id != userId);
    // Dead players send message to dead players
    if (!player.isAlive)
      targetsPlayers = this.players.filter((target: Player) =>  !target.isAlive);
    // Players send message to role mates in night phase
    else if (this._phase == Phases.Night)
      targetsPlayers = this.players.filter((target) => target.role == player.role);

    // Format time
    const formattedTime = new Date().toLocaleTimeString('fr-FR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

    // Push new message
    this._messages.push({
      id: this.messages.length,
      targets: targetsPlayers,
      text: text,
      time: formattedTime,
      author: player.name,
    });

    // Emit event
    this._emitGameUpdate();
  };


  /** @brief Get players role */
  public get roles(): Roles[] { return this._players.map(player => player.role); }


  /** @brief Get timer */
  public get timer(): number { return this._timer; }


  /** @brief Get phase */
  public get phase(): number { return this._phase; }


  /** @brief Get round */
  public get round(): number { return this._round; }


  /** @brief is Started */
  public get isStarted(): boolean { return this._isStarted; }


  /** @brief Start or Restart a game */
  start(): void {
    // Clear data
    this._phase = Phases.Night;
    this._round = 0;
    this._messages = [];

    // Assign roles
    this._assignRoles();

    // Launch timer
    if (this._timerInterval)
      clearInterval(this._timerInterval);
    this._timerInterval = setInterval(() => {
      // Launch timer completed when timer is done
      const newTime = this._timer - 1;
      if (newTime <= 0)
        this._timerCompleted();
      // Set new timer
      else
        this._timer = newTime;
    }, 1000);

    // Start game
    this._isStarted = true;

    // Emit event
    this._emitGameUpdate();
  }

/**
 * Private
 */
  /** @brief Assign roles */
  private _assignRoles() {
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

  /** @brief timer completed */
  private _timerCompleted() {
    // // Launch end phase
    // const phaseHandler = phasesHandlers[phase as Phases] as Phase;
    // phaseHandler.endFunc();

    // // Next phase
    // const nextIndex = (phase + 1) % (Object.keys(Phases).length / 2);
    // const nextPhaseHandler = phasesHandlers[nextIndex as Phases] as Phase;
    // if (phaseHandler.isFinishedFunc()) {
    //   setPhase(nextIndex);
    //   _sendNarratorMessage(nextPhaseHandler.message, players);
    //   nextPhaseHandler.initFunc();
    //   setTimer(nextPhaseHandler.time);
    // } else {
    //   phaseHandler.updateFunc();
    //   setTimer(phaseHandler.time);
    // }
  }

  /** @brief Emit game update */
  private _emitGameUpdate() {
    if (this._onGameUpdate)
      this._onGameUpdate(this);
  }

  /** @brief Game id */
  private _id: string;

  /** @brief Event on update */
  private _onGameUpdate: GameUpdateCallback | null = null;

  /** @brief Players */
  private _players: Player[] = [];

  /** @brief Messages */
  private _messages: Message[] = [];

  /** @brief Phase */
  private _phase: Phases = Phases.Night;

  /** @brief Round */
  private _round: number = 0;

  /** @brief Timer */
  private _timer: number = 30;

  /** @brief Timer interval */
  private _timerInterval: NodeJS.Timeout | null = null;

  /** @brief Is started */
  private _isStarted: boolean = false;
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
