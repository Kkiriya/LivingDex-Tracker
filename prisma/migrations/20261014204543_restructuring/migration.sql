/*
  Warnings:

  - You are about to drop the `games` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `poke_game_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_tracked_pokemon` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "poke_game_orders" DROP CONSTRAINT "poke_game_orders_game_id_fkey";

-- DropForeignKey
ALTER TABLE "poke_game_orders" DROP CONSTRAINT "poke_game_orders_poke_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tracked_pokemon" DROP CONSTRAINT "user_tracked_pokemon_poke_id_game_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tracked_pokemon" DROP CONSTRAINT "user_tracked_pokemon_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "games";

-- DropTable
DROP TABLE "poke_game_orders";

-- DropTable
DROP TABLE "user_tracked_pokemon";

-- CreateTable
CREATE TABLE "pokedex" (
    "dex_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "pokedex_pkey" PRIMARY KEY ("dex_id")
);

-- CreateTable
CREATE TABLE "pokedex_pokemons" (
    "dex_id" INTEGER NOT NULL,
    "poke_id" INTEGER NOT NULL,
    "entry_number" INTEGER NOT NULL,

    CONSTRAINT "pokedex_pokemons_pkey" PRIMARY KEY ("dex_id","poke_id")
);

-- CreateTable
CREATE TABLE "living_dex" (
    "living_dex_id" SERIAL NOT NULL,
    "dex_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,

    CONSTRAINT "living_dex_pkey" PRIMARY KEY ("living_dex_id")
);

-- CreateTable
CREATE TABLE "living_dex_pokemon" (
    "living_dex_id" INTEGER NOT NULL,
    "poke_id" INTEGER NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "caught" BOOLEAN NOT NULL DEFAULT false,
    "shiny" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "living_dex_pokemon_pkey" PRIMARY KEY ("living_dex_id","poke_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pokedex_pokemons_dex_id_entry_number_key" ON "pokedex_pokemons"("dex_id", "entry_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "pokedex_pokemons" ADD CONSTRAINT "pokedex_pokemons_dex_id_fkey" FOREIGN KEY ("dex_id") REFERENCES "pokedex"("dex_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokedex_pokemons" ADD CONSTRAINT "pokedex_pokemons_poke_id_fkey" FOREIGN KEY ("poke_id") REFERENCES "pokemon"("poke_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "living_dex" ADD CONSTRAINT "living_dex_dex_id_fkey" FOREIGN KEY ("dex_id") REFERENCES "pokedex"("dex_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "living_dex" ADD CONSTRAINT "living_dex_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "living_dex_pokemon" ADD CONSTRAINT "living_dex_pokemon_living_dex_id_fkey" FOREIGN KEY ("living_dex_id") REFERENCES "living_dex"("living_dex_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "living_dex_pokemon" ADD CONSTRAINT "living_dex_pokemon_poke_id_fkey" FOREIGN KEY ("poke_id") REFERENCES "pokemon"("poke_id") ON DELETE RESTRICT ON UPDATE CASCADE;
