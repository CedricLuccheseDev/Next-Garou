import { Game } from './game';
import { nanoid } from 'nanoid';
import { Server as IOServer } from 'socket.io';

/** @brief Game Manager class */
export class GameManager {
/**
 * Public
 */
  /** @brief create new game */
  create(io: IOServer): string {
    const gameId = nanoid(8);
    const newGame = new Game(gameId, (game: Game) => {
      io.emit('updateGame', ({game}));
    });
    this.games.push(newGame);
    return gameId;
  }

  /** @brief get game */
  get(gameId: string): Game | undefined {
    return this.games.find(game => game.id === gameId);
  }

  /** @brief get all games */
  getAll(): Game[] {
    return this.games;
  }

  /** @brief remove game */
  remove(gameId: string): void {
    this.games = this.games.filter(game => game.id !== gameId);
  }


/**
 * Private
 */
  /** @brief Games */
  private games: Game[] = [];
}
