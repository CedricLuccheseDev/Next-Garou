"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Background from '@/src/layout/Background';
import Wrapper from '@/src/layout/Wrapper';
import { insertCoin, RPC } from 'playroomkit';
import React, { useEffect, useState } from 'react'

export default function Game() {

  const [text, setText] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  const start = async () => {
    await insertCoin();

    RPC.register('message', (data, sender) => {
      console.log(`Player ${sender.id} send a message ${data.message}`);

      setChat((prevChat) =>
        [
          ...prevChat,
          sender.id + " " + data.message
        ]
      );

      console.log(chat);

      return Promise.resolve();
    });
  }

  useEffect(() => {
    start();
  }, []);


  return (
    <Background>
      <Wrapper>
        <div className="flex-col">
          <Input
            onChange={event => { setText(event.target.value); }}
            value={text}
          />
          <Button onClick={() =>
            RPC.call('message', { message: text }, RPC.Mode.ALL)
          }>
            Send
          </Button>
          <ul>
            {chat.toReversed().map((txt, index) => {
              return <li key={index}>{txt}</li>
            })}
          </ul>
        </div>
      </Wrapper>
    </Background>

  )
}