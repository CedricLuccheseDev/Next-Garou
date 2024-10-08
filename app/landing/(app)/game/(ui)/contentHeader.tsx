"use client"

import Image from 'next/image'
import { FaRegUser } from "react-icons/fa";
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useGameEngine } from '../(hooks)/useGameEngine';
import { useEffect, useState } from 'react';
import { Message } from '../(hooks)/types';
import { Phases } from '../(hooks)/enums';

export default function ContentHeader() {

  const [narratorMessage, setNarratorMessage] = useState("");

  const {
    round,
    phase,
    nightPhase,
    globalChat
  } = useGameEngine();

  useEffect(() => {
    const message: Message = globalChat.findLast((data: Message) => data.author === "Narrator");
    if (message != undefined)
      setNarratorMessage(message.text);
  }, [globalChat, ]);

  return (
    <div className='flex relative w-full h-1/4'>
      {/* Page Content Header Background */}
      <div>
        <Image
          className="animate-appearance-in"
          src="/Header.png"
          layout="fill"
          objectFit="cover"
          alt="header"
          quality={100} />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background/30 to-[#050519]"/>
      </div>
      {/* Page Content Header Foreground */}
      <div className='flex flex-col w-full h-full p-4'>
        <div className='flex flex-row w-full h-full items-start'>
          {/* Page Content Header Foreground Narrator Component */}
          <div className='w-full flex flex-row space-x-4 items-center'>
            <FaRegUser className='relative w-8 h-8 text-white'/>
              <div className='flex w-1/3 h-12 bg-white/5 backdrop-blur-md rounded-xl justify-start items-center px-4 text-wrap font-mulish-regular'>
                {narratorMessage ? narratorMessage : ""}
              </div>
          </div>
          {/* Page Content Header Foreground Party Infos */}
          <div className='relative flex flex-col w-32 items-end'>
            <div className='text-2xl font-medium'>
              Round {round}
            </div>
          </div>
        </div>
        {/* Page Content Header Foreground Phases */}
        <div className='relative flex flex-row text-3xl items-center justify-center space-x-8'>
          <div className={`${phase === Phases.Night ? 'text-white' : 'text-white/50'}`}>
            Night
          </div>
          <div className={`${phase === Phases.Night && nightPhase === 0 ? 'text-white' : 'text-white/50'} text-xl`}>
            Seer
          </div>
          <div className={`${phase === Phases.Night && nightPhase === 1 ? 'text-white' : 'text-white/50'} text-xl`}>
            Werewolves
          </div>
          <div className={`${phase === Phases.Night && nightPhase === 2 ? 'text-white' : 'text-white/50'} text-xl`}>
            Witch
          </div>
          <ArrowRightIcon />
          <div className={`${phase === Phases.Discussion ? 'text-white' : 'text-white/50'}`}>
            Discussion
          </div>
          <ArrowRightIcon />
          <div className={`${phase === Phases.Vote ? 'text-white' : 'text-white/50'}`}>
            Vote
          </div>
          <ArrowRightIcon />
          <div className={`${phase === Phases.Execution ? 'text-white' : 'text-white/50'}`}>
            Execution
          </div>
        </div>
      </div>
    </div>
  );
};