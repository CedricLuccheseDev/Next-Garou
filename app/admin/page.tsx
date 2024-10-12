'use client';

import { Button } from '@/components/ui/button';
import { Game } from '@/lib/game';
import { Player } from '@/lib/types';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [usersId, setUsersId] = useState<string[]>([]);

  useEffect(() => {
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
      console.log('Connecté au serveur WebSocket Admin');

      /** @brief Request admin informations */
      socket.emit('getAdminInfos', (data: { games: any; usersId: string[] }) => {
        const gamesList = data.games.map((gameData: { id: string; players: Player[] }) =>
          new Game(gameData.id, gameData.players)
        );
        setGames(gamesList);
        setUsersId(data.usersId);

      });

      /** @brief Get admin informations */
      socket.on('adminInfosUpdated', (data: { games: any; usersId: string[] }) => {
        const gamesList = data.games.map((gameData: { id: string; players: Player[] }) =>
          new Game(gameData.id, gameData.players)
        );
        setGames(gamesList);
        setUsersId(data.usersId);
      });
    });
  };

  // Handle remove game
  const handleRemoveGame = (gameId: string) => {
    socket.emit('removeGame', { gameId });
  };

  // Handle create game
  const handleCreateGame = () => {
    socket.emit('createGame', (gameId: string) => {});
  };

  return (
    <div className='p-24 w-screen h-screen'>
      <div className='flex flex-col w-full h-full space-y-16'>
        <div className='flex flex-row justify-between'>
          <h1 className='text-4xl font-unbounded-bold'>
            Admin Panel
          </h1>
          <h2 className='text-3x1 font-mulish-bold'>
            Players: {usersId.length}
          </h2>
        </div>
        <div className='grid grid-cols-3 space-x-8 space-y-8'>
          {
            games.length > 0 ? (
              games.map((game, index) => (
                <div key={game.getId()} className='flex flex-col p-8 space-y-4 bg-slate-700 rounded-md'>
                  <div className='flex flex-row justify-between'>
                    <h1 className='font-mulish-bold text-xl'>
                      Game {index + 1}
                    </h1>
                    <h1 className='font-mulish-italic text-2xl'>
                      {game.getId()}
                    </h1>
                  </div>
                  <div className='font-mulish-regular text-lg'>
                    Players count: {game.getPlayers().length}
                  </div>
                  <Button variant="destructive" onClick={() => handleRemoveGame(game.getId())}>
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <div className='font-unbounded-bold text-3xl text-red-400'>
                No games
              </div>
            )
          }
          <Button className='w-full h-full' onClick={() => handleCreateGame()}>Create game</Button>
        </div>
      </div>
    </div>
  );
}
