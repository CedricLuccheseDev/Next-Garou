"use client"

import { useGameEngine } from '@/app/(hooks)/useGameEngine';
import Chat from './chat';
import PlayerArea from './playerArea';

export default function ContentBody() {

  const {
    round
  } = useGameEngine();

  return (
    <div className='flex flex-row space-x-8 w-full h-full p-8'>
      <div className='w-64'>
        <PlayerArea />
      </div>
      <Chat />
      <div className='w-64'/>
    </div>
  );
};