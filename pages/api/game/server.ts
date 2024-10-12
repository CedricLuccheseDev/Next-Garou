import { NextApiRequest, NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Socket as NetSocket } from 'net';
import { GameManager } from '../../../lib/gameManager';

const globalGameManager = global as any;
globalGameManager.gameManager = globalGameManager.gameManager || new GameManager();

const globalUsersId = global as any
globalUsersId.usersId = globalUsersId.usersId || []

interface SocketServer extends HttpServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Initialiser WebSocket si non déjà fait
  const socket = res.socket as SocketWithIO;
  if (!socket.server.io) {
    const io = new IOServer(socket.server, {
      path: '/api/game/server',
    });
    socket.server.io = io;

    // On user connection
    io.on('connection', (clientSocket) => {
      // Get game manager from server stack
      const gameManager = globalGameManager.gameManager;
      // Get game manager from server stack
      const usersId = globalUsersId.usersId as string[];

      // Add user Id
      usersId.push(clientSocket.id);
      // Send admin informations
      io.emit('adminInfosUpdated', getAdminInformations());
      // Server log
      console.log(`[success] server.ts: on 'connection' => User connected ${clientSocket.id}`);

      function getAdminInformations() {
        return {
          games: gameManager.getAll(),
          usersId: usersId
        }
      }

      /** @brief Create Game */
      clientSocket.on('createGame', (callback) => {
        // Create game
        const gameId = gameManager.create();
        // Process callback
        callback(gameId);
        // Send admin informations
        io.emit('adminInfosUpdated', getAdminInformations());
        // Server Log
        console.log(`[success] server.ts: on 'createGame' => Game ${gameId} created`);
      });

      /** @brief Join Game */
      clientSocket.on('joinGame', ({ gameId, playerName }) => {
        // Get game
        const game = gameManager.get(gameId);
        if (!game) {
          console.error(`[error] server.ts: on 'joinGame' => game not found ${gameId}`)
          return;
        }

        // Add player to game
        game.addPlayer(clientSocket.id, playerName);
        // Notify all clients that game players updated
        io.to(gameId).emit('playersUpdated', game.getPlayers());  // Mise à jour des joueurs dans la partie
        // Send admin informations
        io.emit('adminInfosUpdated', getAdminInformations());
        // Server Log
        console.log(`[success] server.ts: on 'joinGame' => ${playerName} has join the game ${gameId}`);
      });

      /** @brief Leave Game */
      clientSocket.on('leaveGame', (gameId) => {
        // Get game
        const game = gameManager.get(gameId);
        if (!game) {
          console.error(`[error] server.ts: on 'leaveGame' => game not found ${gameId}`)
          return;
        }

        // Remove player from the game
        game.removePlayer(clientSocket.id);
        // Remove game if there is no longer players
        if (game.getPlayerCount() === 0) {
          gameManager.remove(gameId);
          console.log(`[success] server.ts: on 'leaveGame' => Game ${gameId} removed due to no longer players`);
        // Or update players to all clients in the game
        } else
          io.to(gameId).emit('updatePlayers', game.getPlayers());  // Mise à jour des joueurs dans la partie
        // Send admin informations
        io.emit('adminInfosUpdated', getAdminInformations());
        // Server log
        console.log(`[success] server.ts: on 'leaveGame' => Player ${clientSocket.id} has left the game ${gameId}`);
      });

      /** @brief Remove game */
      clientSocket.on('removeGame', (data) => {
        // Get game
        const gameId = data.gameId
        const game = gameManager.get(gameId);
        if (!game) {
          console.error(`[error] server.ts: on 'removeGame' => game not found ${gameId}`)
          return;
        }

        // Remove game from the game manager
        gameManager.remove(gameId);
        // Send admin informations
        io.emit('adminInfosUpdated', getAdminInformations());
        // Notify all clients that the game has been removed
        io.emit('gameRemoved', gameId);
        // Server log
        console.log(`[success] server.ts: on 'removeGame' => Game ${gameId} has been removed`);
      });

      /** @brief Send games */
      clientSocket.on('getGames', (callback) => {
        // Process callback
        const games = Object.values(gameManager.getAll());
        callback(games);
        // Server Log
        console.log("server.ts: on 'gets' => " + gameManager.getAll())
      });

      /** @brief Get admin infos games */
      clientSocket.on('getAdminInfos', (callback) => {
        // Process callback
        callback(getAdminInformations());
        // Server Log
        console.log("server.ts: on 'getAdminInfos' => " + getAdminInformations())
      });

      /** @brief User Disconnection */
      clientSocket.on('disconnect', () => {
        // Remove user id
        const userIndex = usersId.indexOf(clientSocket.id);
        if (userIndex !== -1)
          usersId.splice(userIndex, 1);
        // Send admin informations
        io.emit('adminInfosUpdated', getAdminInformations());
        // Server Log
        console.log(`[success] server.ts: on 'disconnect' => User ${clientSocket.id} disconnected`);
      });
    });
  }

  res.end();
}
