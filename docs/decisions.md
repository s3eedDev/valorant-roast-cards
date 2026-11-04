# Decisions

## Scope
- **MVP:** one friend group, one game (Valorant), three roast categories (map, agent, weapon).
- **Design goal:** the schema stays game-agnostic so other games can be added later.

## Data source
- **Strategy:** seed data first, then real ingestion behind an interface (`fetchMatches`).
- **First real source:** HenrikDev unofficial Valorant API (free Basic key, kept in `.env`, never committed).
- **Fallback:** CSV import / manual entry.
- **Rejected for MVP:** Riot official API (production key approval is slow and uncertain).

## Stack
- Backend: Node + Express + TypeScript (CommonJS modules)
- Repo layout: single repo, `backend/` and `frontend/` folders