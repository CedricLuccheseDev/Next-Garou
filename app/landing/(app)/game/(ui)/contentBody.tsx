"use client"

import { useGameEngine } from '../(hooks)/useGameEngine';
import Chat from './chat';
import PlayerArea from './playerArea';

export default function ContentBody() {

  const {
    round
  } = useGameEngine();

  return (
    <div className='flex flex-row space-x-8 w-full h-3/4 p-8'>
      <div className='w-80'>
        <PlayerArea />
      </div>
      <Chat />
      <div className='w-80'/>
    </div>
  );
};