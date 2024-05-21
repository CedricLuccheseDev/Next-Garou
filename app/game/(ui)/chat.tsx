"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { myPlayer } from 'playroomkit';
import React, { useState } from 'react'
import { useGameEngine } from '../../(hooks)/useGameEngine';

export default function Chat() {

  const {
    chat,
    sendMessage,
  } = useGameEngine();

  const me = myPlayer();

  const [text, setText] = useState("");

  return (
    <div className='h-full w-full flex flex-col space-y-8'>
      <div className="flex-grow bg-gray-900 rounded-md p-4 h-96 overflow-y-auto">
        <ul className='flex flex-col-reverse space-y-reverse'>
          {chat.toReversed().map((txt, index) => (
            <li key={index}>{txt}</li>
          ))}
        </ul>
      </div>
      <div className='w-full flex flex-row space-x-8'>
        <Input
          className='w-full'
          onChange={event => { setText(event.target.value); }}
          value={text}
        />
        <Button onClick={() =>
          sendMessage(me.id, text)
        }>
          Send
        </Button>
      </div>
    </div>
  )
}