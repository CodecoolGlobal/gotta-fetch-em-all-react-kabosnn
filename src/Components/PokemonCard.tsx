import React from "react";

type PokemonCardProps = {
  pokemon: {
    name: string;
    url: string;
  };
};

function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>
    </div>
  );
}

export default PokemonCard;

