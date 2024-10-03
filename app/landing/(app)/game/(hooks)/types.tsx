import { PlayerState } from 'playroomkit';
import { Phases } from './enums';

export type Message =
{
  id: number;
  targets: PlayerState[];
  author: string;
  time: string;
  text: string;
  photo?: string;
  color?: string;
}

export type Phase =
{
  time: number;
  message: string;
  nextPhase: Phases;
  initFunc: () => void;
  updateFunc: () => void;
  endFunc: () => void;
  isFinishedFunc: () => boolean;
}