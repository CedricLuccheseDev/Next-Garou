"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Wrapper from '@/src/layout/Wrapper';
import { myPlayer } from 'playroomkit';
import React, { useEffect, useState } from 'react'
import { useGameEngine } from '../../(hooks)/useGameEngine';

export default function Party() {

  const {
    chat,
    sendMessage,
  } = useGameEngine();

  const me = myPlayer();

  const [text, setText] = useState("");

  return (
    <Wrapper>
      <div className="flex-col">
        <Input
          onChange={event => { setText(event.target.value); }}
          value={text}
        />
        <Button onClick={() =>
          sendMessage(me.id, text)
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
  )
}