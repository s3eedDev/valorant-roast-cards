import { mkdirSync, writeFileSync } from "node:fs";

const BASE = "https://api.henrikdev.xyz";

async function get(path: string, key: string){

    const res = await fetch(`${BASE}${path}`, { headers: { Authorization: key } });
    console.log(res.status, path, "| remaining:", res.headers.get("x-ratelimit-remaining"));

    const body: any  = await res.json();
    if(!res.ok){
        console.error(JSON.stringify(body, null, 2));
        process.exit(1);
    }

    return body;
}


async function main() {
  const key = process.env.HENRIK_API_KEY;
  if (!key) {
    console.error("HENRIK_API_KEY is missing. Run with --env-file=.env");
    process.exit(1);
  }

  const [name, tag] = process.argv.slice(2);
  if (!name || !tag) {
    console.error("Usage: npx tsx --env-file=.env scripts/matches.ts <name> <tag>");
    process.exit(1);
  }

    // Call 1: Riot ID -> puuid + region
  const account = await get(`/valorant/v2/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,key,);
  const { puuid, region } = account.data;

  // Call 2: puuid + region -> recent matches
    const matches = await get(`/valorant/v3/by-puuid/matches/${region}/${puuid}?size=5`, key);  

      if (matches.data.length === 0) {
    console.log("No matches returned for this player.");
    return;
  }

    mkdirSync("scripts/out", { recursive: true });
    writeFileSync("scripts/out/matches.json", JSON.stringify(matches, null, 2));

        for (const m of matches.data) {
    // v3 can return matches whose details aren't available; skip them
    if (!m.is_available || !m.metadata || !m.players) continue;

    const me = m.players.all_players.find((p: any) => p.puuid === puuid);
    console.log(
      m.metadata.game_start_patched,
      "|", m.metadata.map,
      "|", m.metadata.mode,
      "|", me?.character,
      "|", `${me?.stats.kills}/${me?.stats.deaths}/${me?.stats.assists}`,
    );
  }
}

main();