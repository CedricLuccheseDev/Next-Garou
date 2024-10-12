'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export default function GamePage({ params }: { params: { id: string } }) {
  const { id: gameId } = params;
  const [players, setPlayers] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Initialiser le WebSocket pour cette partie spécifique
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const socketInitializer = async () => {
    socket = io({
      path: '/api/game/server',
    });

    // socket.emit('joinGame', { gameId, playerName: 'MonNom' });

    // socket.on('updatePlayers', (updatedPlayers: string[]) => {
    //   setPlayers(updatedPlayers);
    // });

    /** @brief Push the user to game page if game is removed */
    socket.on('gameRemoved', (_gameId: string) => {
      if (gameId == _gameId)
        router.push('/game')
    });
  };

  const handleLeaveGame = () => {
    socket.emit('leaveGame', gameId);
    router.push('/game');  // Retourner au lobby
  };

  return (
    <div className='w-full h-full flex flex-col'>
      <h1 className='text-3x1'>Partie en cours - ID : {gameId}</h1>
      <h2>Joueurs :</h2>
      <ul className='flex flex-col'>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <button onClick={handleLeaveGame}>Quitter la partie</button>
    </div>
  );
}
