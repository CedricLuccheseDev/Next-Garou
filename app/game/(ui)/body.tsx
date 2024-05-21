import React from 'react'
import Chat from './chat';
import Board from './board';

export default function Body() {
  return (
    <div className='h-full w-full flex flex-col space-y-4 p-8 bg-gray-950'>
      <Board />
      <Chat />
    </div>
  )
}