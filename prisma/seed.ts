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

// Type of responses of API fetch on /type
type TypeResponse = {
  next: string | null; // allows us to fetch all results in case of pagination
  results: {
    name: string;
    url: string;
  }[];
};

// Type specific to Data meant to be stored for Type
type TypeData = {
  typeId: number;
  name: string;
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
// Fetching Pokedex & Seeding DB
// ===================================== //
