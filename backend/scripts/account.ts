async function main() {
  const key = process.env.HENRIK_API_KEY;
  if (!key) {
    console.error("HENRIK_API_KEY is missing. Run with --env-file=.env");
    process.exit(1);
  }

  // Read the Riot ID from the command line: <name> <tag>
  const [name, tag] = process.argv.slice(2);
  if (!name || !tag) {
    console.error("Usage: npx tsx --env-file=.env scripts/account.ts <name> <tag>");
    process.exit(1);
  }

  // encodeURIComponent makes names with spaces or symbols safe inside a URL
  const url = `https://api.henrikdev.xyz/valorant/v2/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;

  const res = await fetch(url, { headers: { Authorization: key } });

  console.log("status:", res.status, res.statusText);
  console.log("rate limit remaining:", res.headers.get("x-ratelimit-remaining"));

  const body = await res.json();
  console.log(JSON.stringify(body, null, 2));
}

main();