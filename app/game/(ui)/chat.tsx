"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { myPlayer, PlayerState } from 'playroomkit';
import React, { useEffect, useState } from 'react'
import { Message, useGameEngine } from '../../(hooks)/useGameEngine';
import Image from 'next/image';

export default function Chat() {

  const {
    globalChat,
    sendPlayerMessage,
  } = useGameEngine();

  const [text, setText] = useState("");
  const [chat, setChat] = useState<Message[]>([]);

  useEffect(() => {
    if (!globalChat || !globalChat.length)
      return;

    const last = globalChat[globalChat.length - 1];
    const targets = last.targets;
    const message = last.message as Message;

    if (message === undefined || targets === undefined) return;

    if (targets.find((player: PlayerState) => player.id === myPlayer().id) !== undefined) {
        setChat(
        [
          ...chat,
          message
        ]);
    }

  }, [globalChat]);

  return (
    <div className='h-128 w-full flex flex-grow flex-col space-y-8'>
      { /* Chat content */ }
      <div className="flex flex-col-reverse p-8 h-full overflow-y-auto bg-black rounded-sm shadow-[rgba(30,58,138,0.9)_0px_0px_10px_1px]">
        <ul className='flex flex-col space-y-4'>
          {chat.map((message: Message, index: number) => (
            <li
              key={index}
              className='flex flex-row space-x-2 items-center h-12'
            >

              <Image
                src={message.photo}
                alt={message.author + index}
                width={40}
                height={40}
                className='rounded-full' />

              <div className={`flex flex-row space-x-2 w-2/3 h-full bg-purple-950 rounded-full items-center px-4`}>
                <span className='text-3x1 font-bold'> [ {message.time} ] {message.author}: </span>
                <span> {message.message} </span>
              </div>

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
          sendPlayerMessage(text)
        }>
          Send
        </Button>
      </div>
    </div>
  )
}