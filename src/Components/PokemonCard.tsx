import React from "react";

type PokemonCardProps = {
  pokemon: {
    name: string;
    url: string;
    sprites: { front_default: string };
  };
};

export default function PokemonCard(props: PokemonCardProps) {
  const { pokemon } = props;

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h4>{pokemon.name}</h4>
    </div>
  );
}

