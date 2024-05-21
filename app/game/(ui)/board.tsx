"use client"

import React, { useState } from 'react'
import { NightPhasesTexts, Phases, PhasesTexts, useGameEngine } from '../../(hooks)/useGameEngine';

export default function Board() {

  const {
    phase,
    nightPhaseRole
  } = useGameEngine();

  return (
    <div className="flex-grow bg-gray-900 rounded-md p-4 h-16 w-full overflow-y-auto">
      {PhasesTexts[phase]} { phase === Phases.Night ? NightPhasesTexts[nightPhaseRole] : "" }
    </div>
  )
}