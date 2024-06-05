import React from 'react'
import Chat from './chat';
import Board from './board';

export default function Body() {
  return (
    <div className='h-full w-full flex flex-col space-y-4'>
      <Board />
      <Chat />
    </div>
  )
}