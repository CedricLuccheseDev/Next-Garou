"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Wrapper from '@/src/layout/Wrapper';
import { myPlayer } from 'playroomkit';
import React, { useEffect, useState } from 'react'
import { Phases, Roles, useGameEngine } from '../../(hooks)/useGameEngine';

export default function Party() {

  const {
    chat,
    round,
    phase,
    sendMessage,
    getPlayer
  } = useGameEngine();

  const me = myPlayer();

  const [text, setText] = useState("");

  return (
    <Wrapper>
      <div className="h-full flex flex-col space-y-4 p-4">
        <h1>
          Round {round} Phase {Phases[phase]}
        </h1>
        <h1>
          You are {Roles[me.getState("role")]}
        </h1>
        <div className='h-full flex flex-col p-4'>
          <div className="flex-grow flex flex-col mb-4">
            <div className="flex-grow overflow-y-auto flex flex-col-reverse h-64 border border-gray-300 p-2">
              <ul className='flex flex-col-reverse'>
                {chat.toReversed().map((txt, index) => (
                  <li key={index}>{txt}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className='w-full flex flex-row space-x-4'>
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
      </div>
    </Wrapper>
  )
}