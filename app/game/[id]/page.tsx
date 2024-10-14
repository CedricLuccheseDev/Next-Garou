'use client';

import { Game } from '@/lib/game';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export default function GamePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [game, setGame] = useState<Game>()

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
    await fetch('/api/game/server');

    socket = io({
      path: "/api/game/server",
    });

    socket.on('connect', () => {
      console.log('Connecté au serveur WebSocket player');

      /** @brief Request game */
      socket.emit('getGame', params.id, (response: { success: boolean, game?: any, message?: string }) => {
      // Si la requête a réussi, traiter les données du jeu
        if (response.success) {
          // Set game
          setGame(response.game);
          // Add player to game
          game?.addPlayer("10", "hello");
        // En cas d'erreur, afficher le message
        } else {
          console.error(response.message);
        }
      });

      /** @brief Push the user to game page if game is removed */
      socket.on('gameRemoved', (_gameId: string) => {
        if (!game)
            return;
        if (game.id == _gameId)
          router.push('/game')
      });

    });
  }

  const handleLeaveGame = () => {
    if (!game)
      return;
    socket.emit('leaveGame', game.id);
    router.push('/game');  // Retourner au lobby
  };

  return (
    (
      game
      ?
        <div>Game found</div>
      :
        <div>Game not found</div>
    )
  );
}
