"use client"

import React, { useState } from 'react'
import { useGameEngine } from '../../(hooks)/useGameEngine';

export default function Board() {

  const {
    sendMessage,
  } = useGameEngine();

  return (
    <div className='h-64 w-full flex flex-col space-y-4'>
    </div>
  )
}