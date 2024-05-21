"use client"

import Image from 'next/image';
import { Phases, Roles, useGameEngine } from '@/app/(hooks)/useGameEngine';
import { myPlayer, usePlayersList } from 'playroomkit';

export default function Sidebar() {

  const {
    round,
    phase,
    timer,
  } = useGameEngine();

  const me = myPlayer();
  const players = usePlayersList(true);

  return (
    <div className='flex flex-col w-80 h-full bg-gray-900 p-8 space-y-4'>
        <h1>
          Round {round}
        </h1>
        <h1>
          Phase {Phases[phase]}
        </h1>
        <h1>
          Timer {timer}
        </h1>
        <h1>
          You are {Roles[me.getState("role")]}
        </h1>
        <div className='flex flex-col'>
          {
            players.map(player => {
              const isDead = player.getState("dead");
              return (
                <div key={player.id} className='flex items-center space-x-4'>
                  <Image
                    src={player.getProfile().photo}
                    alt={player.getProfile().name}
                    width={40}
                    height={40}
                    className='rounded-full' />
                  <span className='text-lg font-medium'>{player.getProfile().name}</span>
                  { isDead && <h1 className='text-red-500'>Dead</h1> }
                </div>
              );
            })
          }
        </div>

    </div>
  );
}