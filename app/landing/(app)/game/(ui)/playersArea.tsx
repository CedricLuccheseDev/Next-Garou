"use client"

import Image from 'next/image';
import { myPlayer, setState, usePlayersList } from 'playroomkit';
import { Button } from '@/components/ui/button';
import { useGameEngine } from '../(hooks)/useGameEngine';
import { Phases, States } from '../(hooks)/enums';
import { NightPhaseOrder } from '../(hooks)/constants';

export default function PlayersArea() {

  const players = usePlayersList(true);

  const {
    phase,
    nightPhase
  } = useGameEngine();

  const me = myPlayer();

  const shouldShowVote = (
    (phase === Phases.Night && me.getState(States.Role) === NightPhaseOrder[nightPhase]) ||
    phase === Phases.Vote
  );

  return (
    <div className='flex flex-col w-full h-full p-8 space-y-4'>
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
                  { shouldShowVote && <Button></Button> }
                </div>
              );
            })
          }
        </div>
    </div>
  );
}