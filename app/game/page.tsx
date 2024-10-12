'use client';  // Assurer que le code est exécuté côté client

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export default function Lobby() {
  const [players, setPlayers] = useState<string[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialiser le WebSocket côté client
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();  // Assurer une déconnexion propre
      }
    };
  }, []);

  const socketInitializer = async () => {
    // Connexion au WebSocket du serveur
    socket = io({
      path: '/api/game/server',
    });

    socket.on('connect', () => {
      console.log('Connecté au serveur WebSocket');
    });

    socket.on('updatePlayers', (updatedPlayers: string[]) => {
      setPlayers(updatedPlayers);
    });
  };

  const handleCreateGame = () => {
    socket.emit('createGame', (gameId: string) => {
      setGameId(gameId);
      router.push(`/game/${gameId}`);
    });
  };

  return (
    <div className='w-full h-full flex flex-col'>
      <h1>Lobby - Créer ou rejoindre une partie</h1>
      <button onClick={handleCreateGame}>Créer une nouvelle partie</button>
      <h2>Joueurs dans le lobby :</h2>
      <ul className='flex flex-col'>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
    </div>
  );
}
