import React, { useState } from "react";

type Location = {
  name: string;
  url: string;
};

type LocationCardProps = {
  location: Location;
};

export default function LocationCard({ location }: LocationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pokemon, setPokemon] = useState<T>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchPokemon(location);
    }
  };

  const fetchPokemon = async (location: Location) => {
    const areaUrl = location.url.replace("/location/", "/location-area/");
    const areaResponse = await fetch(areaUrl);
    const areaData = await areaResponse.json();
    const rand = Math.floor(Math.random() * areaData.pokemon_encounters.length);
    const pokemonUrl = areaData.pokemon_encounters[rand].pokemon.url;
    const pokemonResponse = await fetch(pokemonUrl);
    const pokemonData = await pokemonResponse.json();
    setPokemon(pokemonData);
  };

  return (
    <div>
      <div onClick={toggleOpen}>
        <h2>{location.name}</h2>
      </div>
      {isOpen && pokemon && (
        <div>
          <div>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
          <h2>{pokemon.name}</h2>
        </div>
      )}
    </div>
  );
}
