import { Server as NetServer, Socket } from 'net';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
}

interface Room {
  players: string[];
  gameState: 'waiting' | 'in_game';
}

let rooms: Record<string, Room> = {};

export default function SocketHandler(req: NextApiRequest, res: ExtendedNextApiResponse) {
  if (!res.socket.server.io) {
    const io = new SocketIOServer();
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A player connected');

      socket.on('create_lobby', (lobbyId: string) => {
        rooms[lobbyId] = { players: [], gameState: 'waiting' };
        socket.join(lobbyId);
        io.to(lobbyId).emit('lobby_created', { lobbyId });
      });

      socket.on('join_lobby', ({ lobbyId, playerName }: { lobbyId: string; playerName: string }) => {
        if (rooms[lobbyId]) {
          rooms[lobbyId].players.push(playerName);
          socket.join(lobbyId);
          io.to(lobbyId).emit('player_joined', { playerName });
        } else {
          socket.emit('error', 'Lobby not found');
        }
      });

      socket.on('start_game', (lobbyId: string) => {
        if (rooms[lobbyId]) {
          rooms[lobbyId].gameState = 'in_game';
          io.to(lobbyId).emit('game_started');
        }
      });

      socket.on('disconnect', () => {
        console.log('A player disconnected');
      });
    });
  }

  res.end();
}
