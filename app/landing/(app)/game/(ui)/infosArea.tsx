"use client"

import { myPlayer } from 'playroomkit';
import { Button } from '@/components/ui/button';
import { useGameEngine } from '../(hooks)/useGameEngine';
import { Phases, Roles } from '../(hooks)/enums';

export default function InfosArea() {

  const {
    round,
    phase,
    timer,
    pause,
    SetPlayOrPause,
    DebugPhaseEnd,
  } = useGameEngine();

  const me = myPlayer();

  return (
    <div className='flex flex-col w-full h-full p-8 space-y-4'>
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
          Role : {Roles[me.getState("role")]}
        </h1>
        <h1>
          Name : {me.getProfile().name}
        </h1>
        <div className='h-full'/>
        <Button onClick={() => SetPlayOrPause(!pause)}>{pause ? "play" : "pause"}</Button>
        <Button onClick={() => DebugPhaseEnd()}>Phase end</Button>
    </div>
  );
}