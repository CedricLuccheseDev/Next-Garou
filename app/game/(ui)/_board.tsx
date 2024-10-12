"use client"

import React from 'react'
import Image from 'next/image';
import { myPlayer, usePlayersList } from 'playroomkit';
import { Button } from '@/components/ui/button';
import { NightPhaseCardsOrder, NightPhasesTexts, Phases, PhasesTexts, useGameEngine } from '../(hooks)/useGameEngine';

export default function Board() {

  const {
    phase,
    nightPhaseRole,
    getPlayersAlive,
    getPlayersVoted
  } = useGameEngine();

  const me = myPlayer();

  const renderPlayers = () => {
    const playersAlive = getPlayersAlive();

    const shouldShowPlayers = (
      (phase === Phases.Night && me.getState("role") === NightPhaseCardsOrder[nightPhaseRole]) ||
      phase === Phases.VoteVillager ||
      phase === Phases.VoteMayor
    );

    if (!shouldShowPlayers) {
      return <div />;
    }

    return playersAlive
      .filter(playerState => playerState.id !== me.id)
      .map(player => (
        <div key={player.id} className='flex flex-row space-x-2 items-center'>
          <Image
            src={player.getProfile().photo}
            alt={player.getProfile().name}
            width={40}
            height={40}
            className='rounded-full'
          />
          <div>
            { player.getProfile().name }
          </div>
          <Button variant="ghost" onClick={() => me.setState("target", player.id)}>
            Vote
          </Button>
          <div>
            votes : {getPlayersVoted(playersAlive)[player.id]}
          </div>
        </div>
      ));
  };

  return (
    <div className='flex flex-col space-y-4'>
      <div className="p-4 h-16 w-full font-medium text-8x1">
        {PhasesTexts[phase]} - { phase === Phases.Night ? NightPhasesTexts[nightPhaseRole] : "" }
      </div>
      <div className="flex flex-row space-x-4 items-center p-4 h-32 w-full">
        { renderPlayers() }
      </div>
    </div>
  )
}