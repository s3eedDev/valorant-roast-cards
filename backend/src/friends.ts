import { readFileSync } from "node:fs";

export interface Friend {
  name: string;
  tag: string;
}

// Reads backend/friends.json (path is relative to where you run the command,
// which is the backend/ folder for npm scripts).
export function loadFriends(path = "friends.json"): Friend[] {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new Error(
      `Could not read ${path}. Copy friends.example.json to friends.json and edit it.`,
    );
  }

  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`${path} must be a non-empty array of { name, tag }.`);
  }

  return raw.map((f, i) => {
    if (typeof f?.name !== "string" || typeof f?.tag !== "string") {
      throw new Error(`${path}: entry ${i} needs string "name" and "tag".`);
    }
    return { name: f.name, tag: f.tag };
  });
}
