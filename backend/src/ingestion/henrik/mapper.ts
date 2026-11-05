import type { NormalizedMatch } from "../types.js";

// Only the Henrik v3 fields we actually use. Everything else is ignored.
interface HenrikPlayer {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  character: string;
  stats: { kills: number; deaths: number; assists: number };
}

interface HenrikKill {
  round: number;
  killer_puuid: string;
  victim_puuid: string;
  damage_weapon_name: string | null;
}

export interface HenrikMatch {
  is_available?: boolean;
  metadata?: { matchid: string; map: string; mode: string; game_start: number };
  players?: { all_players: HenrikPlayer[] };
  teams?: Record<string, { has_won: boolean }>;
  kills?: HenrikKill[];
}

// Returns null when Henrik says the details are not available.
export function mapHenrikMatch(raw: HenrikMatch): NormalizedMatch | null {
  if (!raw.is_available || !raw.metadata || !raw.players || !raw.teams || !raw.kills) {
    return null;
  }

  const { metadata, players, teams, kills } = raw;

  return {
    externalId: metadata.matchid,
    map: metadata.map,
    mode: metadata.mode,
    startedAt: new Date(metadata.game_start * 1000), // seconds -> ms
    players: players.all_players.map((p) => ({
      externalId: p.puuid,
      name: p.name,
      tag: p.tag,
      team: p.team,
      agent: p.character,
      won: teams[p.team.toLowerCase()]?.has_won ?? false,
      kills: p.stats.kills,
      deaths: p.stats.deaths,
      assists: p.stats.assists,
    })),
    kills: kills.map((k) => ({
      round: k.round,
      killerExternalId: k.killer_puuid,
      victimExternalId: k.victim_puuid,
      weapon: k.damage_weapon_name,
    })),
  };
}
