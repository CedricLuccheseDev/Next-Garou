"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { myPlayer, PlayerState, RPC, usePlayerState } from 'playroomkit';
import React, { useState } from 'react'
import { useGameEngine } from '../../(hooks)/useGameEngine';

export default function Chat() {

  const {
    sendMessage,
  } = useGameEngine();

  RPC.register('chat', async (data) => {
    if (data.players.find((player: PlayerState) => player.id === me.id) == undefined)
      return;
    setChat([
      ...chat,
      data.msg
    ]);
  });

  const me = myPlayer();

  const [text, setText] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  return (
    <div className='h-full w-full flex flex-col space-y-4'>
      <div className="flex-grow bg-gray-900 rounded-md p-4 h-96 overflow-y-auto flex flex-col-reverse">
        <ul className='space-y-2'>
          {chat.map((txt: string, index: number) => (
            <li
              key={index}
              className='text-[18px]'
            >
              {txt}
            </li>
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
          sendMessage({playerId: me.id, message: text})
        }>
          Send
        </Button>
      </div>
    </div>
  )
}