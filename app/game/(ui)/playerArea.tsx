"use client"

import Image from 'next/image';
import { NightPhaseCardsOrder, Phases, Roles, useGameEngine } from '@/app/(hooks)/useGameEngine';
import { myPlayer, setState, usePlayersList } from 'playroomkit';
import { Button } from '@/components/ui/button';

export default function PlayerArea() {

  const {
    round,
    phase,
    timer,
    pause,
    nightPhaseRole,
    setPlayOrPause,
    phaseEnd,
  } = useGameEngine();

  const me = myPlayer();
  const players = usePlayersList(true);

  return (
    <div className='flex flex-col w-full h-full p-8 space-y-4'>
        <h1>
          Round {round}
        </h1>
        <h1>
          Phase {Phases[phase]}
        </h1>
        <h1>
          Night Phase {nightPhaseRole} {Roles[NightPhaseCardsOrder[nightPhaseRole]]}
        </h1>
        <h1>
          Timer {timer}
        </h1>
        <h1>
          You are {Roles[me.getState("role")]} & { me.getProfile().name }
        </h1>
        <div className='flex flex-col space-y-2 '>
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
        <div className='h-full'/>
        <Button onClick={() => setPlayOrPause(!pause)}>{pause ? "play" : "pause"}</Button>
        <Button onClick={() => phaseEnd()}>Phase end</Button>
    </div>
  );
}