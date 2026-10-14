import Image from "next/image";
import type { Pokemon } from "@/types/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <span className="text-sm opacity-60">
          #{String(pokemon.dexNumber).padStart(3, "0")}
        </span>

        <figure className="relative h-28 w-full">
          <Image
            src={pokemon.sprite}
            alt={pokemon.name}
            fill
            sizes="(max-width: 640px) 50vw, 160px"
            className="object-contain"
          />
        </figure>

        <h2 className="card-title justify-center capitalize text-base">
          {pokemon.name}
        </h2>

        <div className="card-actions justify-center mt-2">
          <span className="badge badge-ghost">Not caught</span>
        </div>
      </div>
    </div>
  );
}
