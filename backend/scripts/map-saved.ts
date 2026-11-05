import { readFileSync } from "node:fs";
import { mapHenrikMatch } from "../src/ingestion/henrik/mapper.js";

const saved = JSON.parse(readFileSync("scripts/out/matches.json", "utf8"));

for (const raw of saved.data) {
  const m = mapHenrikMatch(raw);
  if (!m) {
    console.log("skipped (not available)");
    continue;
  }

  // Sanity checks: the data should agree with itself.
  const sumKills = m.players.reduce((s, p) => s + p.kills, 0);
  const winners = m.players.filter((p) => p.won).length;
  const known = new Set(m.players.map((p) => p.externalId));
  const orphans = m.kills.filter(
    (k) => !known.has(k.killerExternalId) || !known.has(k.victimExternalId),
  ).length;

  console.log(
    `${m.startedAt.toISOString()} | ${m.map} | ${m.mode} | players=${m.players.length}`,
    `| kills=${m.kills.length} (sum of players=${sumKills})`,
    `| winners=${winners} | orphan kills=${orphans}`,
  );
}
