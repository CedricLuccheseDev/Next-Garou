'use client';

import { Button } from '@/components/ui/button';
import { Game, Phases, Player } from '@/lib/game';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export default function AdminPage() {
  const [indexOpened, setIndexOpened] = useState<number>(-1)
  const [games, setGames] = useState<Game[]>([]);
  const [usersId, setUsersId] = useState<string[]>([]);
  const router = useRouter();

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
      socket.emit('getAdminInfos', (data: { games: any[]; usersId: string[] }) => {
        setGames(data.games);
        setUsersId(data.usersId);
      });

      /** @brief Get admin informations */
      socket.on('adminInfosUpdated', (data: { games: any[]; usersId: string[] }) => {
        setGames(data.games);
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

  // Handle join game
  const handleJoinGame = (gameId: string) => {
    router.push('/game/' + gameId);
  };

  return (
    <div className='w-screen h-screen bg-slate-200 text-slate-900 flex justify-center'>
      <div className='p-8 w-full max-w-[1280px]'>
        <div className='flex flex-col w-full h-full space-y-8'>
          <div className='flex flex-row justify-between'>
            <h1 className='text-4xl font-unbounded-bold'>
              Admin Panel
            </h1>
            <h2 className='text-2xl font-mulish-regular'>
              Players: {usersId.length}
            </h2>
          </div>
          <div className='w-full flex flex-col space-y-8 p-8 bg-slate-100 rounded-lg shadow-md'>
            <div className='flex flex-row justify-between'>
              <h1 className='text-3xl font-mulish-bold'>
                Games
              </h1>
              <Button onClick={() => handleCreateGame()}>Create game</Button>
            </div>
            <div className='flex flex-col space-y-4 divide-y-2 divide-slate-300'>
            {
              games.length > 0 ? (
                games.map((game, index) => (
                  <button key={game.id} className={`flex flex-col p-4 rounded-lg ${indexOpened === index ? 'bg-slate-50' : ''}`} onClick={() => setIndexOpened(indexOpened != index ? index : -1)}>
                    <div className='w-full space-x-4 flex flex-row'>
                      <div className='w-64 font-mulish-bold text-xl text-left'>
                        Game {index + 1}
                      </div>
                      <div className='w-64 font-mulish-regular text-xl text-left'>
                        {game.id}
                      </div>
                      <div className='w-64 font-mulish-regular text-xl text-center'>
                        {game.playersCount} players
                      </div>
                      <div className='w-full flex flex-row space-x-2 justify-end'>
                        <Button variant="secondary" onClick={() => handleJoinGame(game.id)}>
                          Join
                        </Button>
                        <Button variant="destructive" onClick={() => handleRemoveGame(game.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className={`flex flex-col text-left duration-300 overflow-hidden ${indexOpened === index ? 'max-h-96' : 'max-h-0'}`}>
                      <div className='font-mulish-regular text-lg'>
                        Is started: {game.isStarted ? "True" : "False"}
                      </div>
                      <div className='font-mulish-regular text-lg'>
                        Phase: {Phases[game.phase]}
                      </div>
                      <div className='font-mulish-regular text-lg'>
                        Round: {game.round}
                      </div>
                      <div className='font-mulish-regular text-lg'>
                        Timer: {game.timer}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className='font-mulish-bold text-xl text-red-400'>
                  No games
                </div>
              )
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
