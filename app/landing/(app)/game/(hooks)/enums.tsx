export enum Roles
{
  Seer,
  Werewolf,
  Witch
};

export enum Phases
{
  Night,
  WakeUp,
  Discussion,
  Vote,
  Execution
}

export enum States
{
  Launch = "launch",
  Chat = "chat",
  GlobalChat = "globalChat",
  Timer = "timer",
  Pause = "pause",
  Round = "round",
  Phase = "phase",
  NightPhase = "nightPhase",
  Roles = "roles",
  //
  Dead = "dead",
  Role = "role",
}