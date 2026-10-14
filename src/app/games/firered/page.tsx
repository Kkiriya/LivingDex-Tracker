import PokemonCard from "@/app/components/PokemonCard";
import type { Pokemon } from "@/types/pokemon";

const pokemon: Pokemon[] = [
  {
    pokeId: 1,
    name: "Bulbasaur",
    dexNumber: 1,
    sprite: "/images/pokemon/1.png",
  },
  {
    pokeId: 2,
    name: "Ivysaur",
    dexNumber: 2,
    sprite: "/images/pokemon/2.png",
  },
  {
    pokeId: 3,
    name: "Venusaur",
    dexNumber: 3,
    sprite: "/images/pokemon/3.png",
  },
];

export default function FireRedDex() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pokémon FireRed</h1>

        <p className="text-base-content/60 mt-2">Kanto Regional Pokédex</p>

        <div className="badge badge-primary mt-4">{pokemon.length} Pokémon</div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {pokemon.map((p) => (
          <PokemonCard key={p.pokeId} pokemon={p} />
        ))}
      </div>
    </div>
  );
}
