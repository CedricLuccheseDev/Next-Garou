"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { myPlayer, PlayerState } from 'playroomkit';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Message, useGameEngine } from '../(hooks)/useGameEngine';

export default function Chat() {

  const {
    globalChat,
    sendPlayerMessage,
  } = useGameEngine();

  const me = myPlayer();
  const [text, setText] = useState("");
  const [chat, setChat] = useState<Message[]>([]);

  useEffect(() => {
    if (!globalChat || !globalChat.length) {
      setChat([]);
      return;
    }

    const last = globalChat[globalChat.length - 1];
    if (last.targets.find((player: PlayerState) => player.id === myPlayer().id) !== undefined) {
        setChat(
        [
          ...chat,
          last
        ]);
    }

  }, [globalChat]);

  return (
    <div className='w-full h-full flex flex-col space-y-8'>
      { /* Chat content */ }
      <div className="container flex flex-col-reverse p-8 h-full overflow-y-auto bg-black rounded-sm shadow-[rgba(30,58,138,0.9)_0px_0px_10px_1px]">
        <ul className='flex flex-col space-y-4'>
          {chat.map((message: Message, index: number) => (
            <li
              key={index}
              className={`${message.author === me.getProfile().name ? "flex flex-row-reverse" : ""}`}
            >
              {message.author === "Narrator" ? (
                <div className="w-full text-center text-1xl font-unbounded-bold bg-gray-900 p-4 rounded-full">
                  {message.text}
                </div>
              ) : (
                <div className='flex flex-col space-y-2'>

                  {
                    // <span>{index} {chat.length}</span>
                    index + 1 < chat.length
                    && chat[index - 1].author !== message.author ?
                      <span className={`flex w-full ${message.author === me.getProfile().name ? "justify-end" : "justify-start"} text-1xl font-bold`}>
                        {message.author}
                      </span>
                    :
                      undefined
                  }

                  <div className={`flex ${message.author === me.getProfile().name ? "flex-row-reverse space-x-reverse" : "flex-row"} space-x-4 items-end`}>
                    <Image
                      src={message.photo ? message.photo : ""}
                      alt={`${message.author}${index}`}
                      width={56}
                      height={56}
                      className='rounded-full'
                    />
                    <div
                      className={`flex flex-row items-center ${message.author === me.getProfile().name ? "items-end" : ""} space-y-2 w-max-2/3 bg-slate-950 rounded-full py-4 px-8 text-wrap font-mulish-regular`}
                      style={{ backgroundColor: `${message.color}30` }}
                    >
                      <span className=''>{message.text}</span>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className='w-full flex flex-row space-x-8'>
        <Input
          className='w-full'
          onChange={event => { setText(event.target.value); }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || !text.length)
              return;
            sendPlayerMessage(text);
            setText("")
          }}
          value={text}
        />
        <Button onClick={() => {
          if (!text.length)
            return;
          sendPlayerMessage(text)
          setText("")
        }}>
          Send
        </Button>
      </div>
    </div>
  )
}