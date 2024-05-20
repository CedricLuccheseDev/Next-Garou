"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Background from '@/src/layout/Background';
import Wrapper from '@/src/layout/Wrapper';
import { insertCoin, myPlayer, onPlayerJoin, RPC } from 'playroomkit';
import React, { useEffect, useState } from 'react'
import { GameEngineProvider, useGameEngine } from '../(hooks)/useGameEngine';
import Party from './(ui)/party';

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
      <Party />
    </GameEngineProvider>
  );
};