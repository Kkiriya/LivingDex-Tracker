-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "pokemon" (
    "poke_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "pokemon_pkey" PRIMARY KEY ("poke_id")
);

-- CreateTable
CREATE TABLE "types" (
    "type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "types_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "pokemon_types" (
    "poke_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,

    CONSTRAINT "pokemon_types_pkey" PRIMARY KEY ("poke_id","type_id")
);

-- CreateTable
CREATE TABLE "games" (
    "game_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "poke_game_orders" (
    "poke_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "game_order" INTEGER NOT NULL,

    CONSTRAINT "poke_game_orders_pkey" PRIMARY KEY ("poke_id","game_id")
);

-- CreateTable
CREATE TABLE "user_tracked_pokemon" (
    "user_id" INTEGER NOT NULL,
    "poke_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "caught" BOOLEAN NOT NULL DEFAULT false,
    "shiny" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_tracked_pokemon_pkey" PRIMARY KEY ("user_id","poke_id","game_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "types_name_key" ON "types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_types_poke_id_slot_key" ON "pokemon_types"("poke_id", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "games_name_key" ON "games"("name");

-- CreateIndex
CREATE UNIQUE INDEX "poke_game_orders_game_id_game_order_key" ON "poke_game_orders"("game_id", "game_order");

-- CreateIndex
CREATE INDEX "user_tracked_pokemon_poke_id_game_id_idx" ON "user_tracked_pokemon"("poke_id", "game_id");

-- AddForeignKey
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_poke_id_fkey" FOREIGN KEY ("poke_id") REFERENCES "pokemon"("poke_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types"("type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poke_game_orders" ADD CONSTRAINT "poke_game_orders_poke_id_fkey" FOREIGN KEY ("poke_id") REFERENCES "pokemon"("poke_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poke_game_orders" ADD CONSTRAINT "poke_game_orders_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tracked_pokemon" ADD CONSTRAINT "user_tracked_pokemon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tracked_pokemon" ADD CONSTRAINT "user_tracked_pokemon_poke_id_game_id_fkey" FOREIGN KEY ("poke_id", "game_id") REFERENCES "poke_game_orders"("poke_id", "game_id") ON DELETE RESTRICT ON UPDATE CASCADE;
