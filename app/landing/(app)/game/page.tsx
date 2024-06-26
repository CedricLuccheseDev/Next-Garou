"use client"

import { insertCoin } from 'playroomkit';
import React, { useEffect, useState } from 'react'
import ContentHeader from './(ui)/contentHeader';
import ContentBody from './(ui)/contentBody';
import { GameEngineProvider } from './(hooks)/useGameEngine';

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
      {/* Page */}
      <div className='flex flex-row w-screen h-screen'>
        {/* Page SideBar */}
        <div></div>
        {/* Page Content */}
        <div className='flex flex-col w-full h-full bg-gradient-to-b from-background to-[#070721]'>
          {/* <ContentHeader /> */}
          <ContentHeader />
          {/* Page Content Body */}
          <ContentBody />
          <div>
          </div>
        </div>
      </div>
    </GameEngineProvider>
  );
};