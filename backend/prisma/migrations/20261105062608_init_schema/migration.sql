-- CreateEnum
CREATE TYPE "DimensionType" AS ENUM ('MAP', 'AGENT', 'WEAPON');

-- CreateTable
CREATE TABLE "games" (
    "id"   SERIAL NOT NULL,
    "slug" TEXT   NOT NULL,
    "name" TEXT   NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dimensions" (
    "id"                   SERIAL       NOT NULL,
    "game_id"              INTEGER      NOT NULL,
    "type" "DimensionType"              NOT NULL,
    "key"                  TEXT         NOT NULL,
    "display_name"         TEXT         NOT NULL,

    CONSTRAINT "dimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id"              SERIAL   NOT NULL,
    "game_id"         INTEGER  NOT NULL,
    "external_id"     TEXT     NOT NULL,
    "name"            TEXT     NOT NULL,
    "tag"             TEXT,
    "is_tracked"      BOOLEAN  NOT NULL DEFAULT false,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id"            SERIAL         NOT NULL,
    "game_id"       INTEGER        NOT NULL,
    "external_id"   TEXT           NOT NULL,
    "map_id"        INTEGER        NOT NULL,
    "mode"          TEXT           NOT NULL,
    "started_at"    TIMESTAMP(3)   NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_players" (
    "id"          SERIAL     NOT NULL,
    "match_id"    INTEGER    NOT NULL,
    "player_id"   INTEGER    NOT NULL,
    "agent_id"    INTEGER    NOT NULL,
    "team"        TEXT       NOT NULL,
    "won"         BOOLEAN    NOT NULL,
    "kills"       INTEGER    NOT NULL,
    "deaths"      INTEGER    NOT NULL,
    "assists"     INTEGER    NOT NULL,

    CONSTRAINT "match_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kill_events" (
    "id"              SERIAL   NOT NULL,
    "match_id"        INTEGER   NOT NULL,
    "killer_id"       INTEGER   NOT NULL,
    "victim_id"       INTEGER   NOT NULL,
    "weapon_id"       INTEGER,
    "round"           INTEGER   NOT NULL,

    CONSTRAINT "kill_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "dimensions_game_id_type_key_key" ON "dimensions"("game_id", "type", "key");

-- CreateIndex
CREATE UNIQUE INDEX "players_game_id_external_id_key" ON "players"("game_id", "external_id");

-- CreateIndex
CREATE INDEX "matches_started_at_idx" ON "matches"("started_at");

-- CreateIndex
CREATE UNIQUE INDEX "matches_game_id_external_id_key" ON "matches"("game_id", "external_id");

-- CreateIndex
CREATE INDEX "match_players_player_id_idx" ON "match_players"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_players_match_id_player_id_key" ON "match_players"("match_id", "player_id");

-- CreateIndex
CREATE INDEX "kill_events_killer_id_idx" ON "kill_events"("killer_id");

-- CreateIndex
CREATE INDEX "kill_events_victim_id_idx" ON "kill_events"("victim_id");

-- AddForeignKey
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "dimensions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "dimensions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kill_events" ADD CONSTRAINT "kill_events_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kill_events" ADD CONSTRAINT "kill_events_killer_id_fkey" FOREIGN KEY ("killer_id") REFERENCES "match_players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kill_events" ADD CONSTRAINT "kill_events_victim_id_fkey" FOREIGN KEY ("victim_id") REFERENCES "match_players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kill_events" ADD CONSTRAINT "kill_events_weapon_id_fkey" FOREIGN KEY ("weapon_id") REFERENCES "dimensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
