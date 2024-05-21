"use client"

import { insertCoin } from 'playroomkit';
import React, { useEffect, useState } from 'react'
import { GameEngineProvider } from '../(hooks)/useGameEngine';
import Sidebar from './(ui)/sidebar';
import Body from './(ui)/body';

export default function Game() {

  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    insertCoin().then(() => {
      setGameReady(true);
    });
  }, []);

  if (!gameReady) {
    return <div>Loading...</div>;
  }

  return (
    <GameEngineProvider>
      <div className='flex flex-row w-full h-full'>
        <Sidebar />
        <Body />
      </div>
    </GameEngineProvider>
  );
};