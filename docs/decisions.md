# Decisions

## Scope
- **MVP:** one friend group, one game (Valorant), three roast categories (map, agent, weapon).
- **Design goal:** the schema stays game-agnostic so other games can be added later.

## Data source
- **Strategy:** real data first. Ingestion pulls matches from the HenrikDev unofficial Valorant API into PostgreSQL. The roast engine only reads from the database, never from the API.
- **Ingestion** sits behind an interface (`fetchMatches`) so the source can be swapped.
- **Stored matches are skipped** on later syncs, to respect the rate limit (Basic key: 30 requests/minute).
- **API key** lives in `backend/.env` (never committed). `backend/.env.example` documents the variable.
- **Tests:** a small hand-written fixture (a few invented matches) is used only by unit tests, so results never change.
- **Fallback:** CSV import / manual entry.
- **Rejected for MVP:** Riot official API (production key approval is slow and uncertain).

## Order of work
1. API sandbox script (learn to call and handle an API)
2. Schema + migrations (shaped by real responses)
3. Ingestion service
4. Roast engine + unit tests (using the fixture)
5. REST endpoints
6. Frontend

## Stack
- Backend: Node + Express + TypeScript (ESM modules, required by Prisma 7), Prisma 7 + PostgreSQL (Docker, port 5433)
- Repo layout: single repo, `backend/` and `frontend/` folders