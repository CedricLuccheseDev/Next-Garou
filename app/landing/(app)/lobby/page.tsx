"use client"

import { initSocket } from '@/lib/socket';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface Player {
  name: string;
}

export default function Lobby() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lobbyId, setLobbyId] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const sock = initSocket();
    setSocket(sock);

    sock.on('lobby_created', ({ lobbyId }: { lobbyId: string }) => {
      console.log(`Lobby created with ID: ${lobbyId}`);
      setLobbyId(lobbyId);
    });

    sock.on('player_joined', ({ playerName }: { playerName: string }) => {
      setPlayers((prevPlayers) => [...prevPlayers, { name: playerName }]);
    });

    sock.on('game_started', () => {
      console.log('Game started!');
    });

    return () => {
      sock.disconnect();
    };
  }, []);

  const createLobby = () => {
    const id = prompt('Enter a lobby ID') || '';
    if (socket && id) {
      socket.emit('create_lobby', id);
    }
  };

  const joinLobby = () => {
    const playerName = prompt('Enter your name') || '';
    if (socket && lobbyId && playerName) {
      socket.emit('join_lobby', { lobbyId, playerName });
    }
  };

  const startGame = () => {
    if (socket && lobbyId) {
      socket.emit('start_game', lobbyId);
    }
  };

  return (
    <div>
      <h1>Lobby</h1>
      <div className='flex flex-col'>
        <button onClick={createLobby}>Create Lobby</button>
        <button onClick={joinLobby}>Join Lobby</button>
        <button onClick={startGame}>Start Game</button>
      </div>

      <h2>Players in Lobby:</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}
