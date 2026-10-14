import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

import { supportedGanes } from "./games";
import { Prisma, Type } from "@/generated/prisma/browser";
import { off } from "process";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const API = process.env.API_URL || "https://pokeapi.co/api/v2";

// general data type widely used in the API
type data = {
  name: string;
  url: string;
};

/**
 *  Response Types
 */

// Type of responses of API fetch on /type
type TypeResponse = {
  results: {
    name: string;
    url: string;
  }[];
};

// Type of response of API fetch on /pokedex
type PokedexResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

// Type of response of API fetch on /pokemon
type PokemonResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

/**
 *  Data Types
 */

// Type specific to Data meant to be stored in Type table
type TypeData = {
  typeId: number;
  name: string;
};

// Type specific to Data meant to be stored in Pokedex table
type PokedexData = {
  dexId: number;
  name: string;
};

// Type specific to Data meant to be stored in Pokemon table
type PokemonData = {
  pokeId: number;
  name: string;
};

// Type specific to Data meant to be stored in PokemonType table
type PokemonType = {
  pokeId: number;
  typeId: number;
  slot: number;
};

// Type specific to Data meant to be stored in PokedexPokemon table
type PokedexPokemon = {
  dexId: number;
  pokeId: number;
  entryNumber: number;
};

// Type specific to Data meant to be stored in PokedexPokemon table
type LivingDex = {
  livingDexId: number;
  dexId: number;
  userId: number;
  name: string;
  description: string | null;
};

type LivingDexPokemon = {
  livingDexId: number;
  pokeId: number;
  seen: boolean;
  caught: boolean;
  shiny: boolean;
};

// fetches API with provided URL, has retries and timeouts
// returns the Response.json
async function fetchApi<T>(
  path: string,
  maxAttempts = 3,
  timeoutMs = 10_000,
  offset = 0,
  limit = 25,
): Promise<T> {
  // To not have to type the whole url everytime
  const url = `${API}/${path}?offset=${offset}&limit=${limit}`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeoutMs),
      });

      // Retry only temporary HTTP failures.
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Dont retry other HTTP erros, such as 404.
      if (!response.ok) {
        throw new Error(`Request failed: HTTP ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      console.warn(
        `Request failed (attempt ${attempt}/${maxAttempts}):`,
        error,
      );

      // Wait 1s, then 2s before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * 2 ** (attempt - 1)),
      );
    }
  }
  throw new Error("Unexpected fetch failure");
}

// ====================================== //
// Fetching Types & Seeding DB
// ===================================== //

/**
 *
 * @returns Promise containing a list of all fetcehd types from API
 */
async function fetchTypes(): Promise<TypeData[]> {
  const fetchedTypesList: TypeData[] = []; // list of all fetched types

  // fetches types
  const typesResponse = await fetchApi<TypeResponse>("type");

  for (const type of typesResponse.results) {
    fetchedTypesList.push({
      typeId: Number(type.url.split("/").at(-2)),
      name: type.name,
    });
  }

  return fetchedTypesList;
}

async function seedTypes(typesList: TypeData[]): Promise<boolean> {
  // Check if provided typeData is valid
  if (!typesList || typesList.length === 0) return false;

  // Seeds the Type table in the DB
  for (const type of typesList) {
    await prisma.type.upsert({
      where: { typeId: type.typeId },
      update: { name: type.name },
      create: {
        typeId: type.typeId,
        name: type.name,
      },
    });
  }
  return true;
}

// ====================================== //
// Fetching Pokemon & Seeding DB
// ===================================== //
async function fetchPokemons(): Promise<PokemonData[]> {
  const fetchedPokemonList: PokemonData[] = []; // list of all fetched pokemons
  const limit = 100;
  let offset = 0;

  while (true) {
    // fetches current page
    const pokemonsResponse = await fetchApi<PokemonResponse>(
      "pokemon",
      undefined,
      undefined,
      offset,
      limit,
    );

    // adds data to fetchedList
    for (const pokemon of pokemonsResponse.results) {
      fetchedPokemonList.push({
        pokeId: Number(pokemon.url.split("/").at(-2)),
        name: pokemon.name,
      });
    }

    // checks if we are on the last page
    if (pokemonsResponse.next === null) return fetchedPokemonList;

    // raise the offset to go to next page
    offset += pokemonsResponse.results.length;
  }
}

async function seedPokemons(pokemonsList: PokemonData[]): Promise<boolean> {
  // Check if provided pokemonData is valid
  if (pokemonsList.length === 0 || pokemonsList === null) return false;

  // Seeds the Pokemon table in the DB
  for (const pokemon of pokemonsList) {
    await prisma.pokemon.upsert({
      where: { pokeId: pokemon.pokeId },
      update: { name: pokemon.name },
      create: {
        pokeId: pokemon.pokeId,
        name: pokemon.name,
      },
    });
  }
  return true;
}

// ====================================== //
// Fetching PokemonType & Seeding DB
// ===================================== //

/**
 *  TBD, it's honestly not super necessary for now
 */

// ====================================== //
// Fetching Pokedex & Seeding DB
// ===================================== //
async function fetchPokedex(): Promise<PokedexData[]> {
  const fetchedPokedexesList: TypeData[] = []; // list of all fetched pokedexes
}
