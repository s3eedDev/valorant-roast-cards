// Our own match shape. Independent of any API: the database writer and the
// roast engine only know this, so swapping Henrik for another source
// (or a CSV) means writing one new mapper, nothing else.

export interface NormalizedPlayer {
  externalId: string; // puuid
  name: string;
  tag: string;
  team: string; // "Red" | "Blue"
  agent: string;
  won: boolean;
  kills: number;
  deaths: number;
  assists: number;
}

export interface NormalizedKill {
  round: number;
  killerExternalId: string;
  victimExternalId: string;
  weapon: string | null; // null = ability / unknown
}

export interface NormalizedMatch {
  externalId: string;
  map: string;
  mode: string;
  startedAt: Date;
  players: NormalizedPlayer[];
  kills: NormalizedKill[];
}
