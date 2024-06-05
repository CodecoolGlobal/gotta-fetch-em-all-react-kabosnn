import React, { useState, useEffect } from "react";
import LocationCard from "./LocationCard";
import PokemonCard from "./PokemonCard";

function LocationList() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/location/");
      const data = await response.json();
      setLocations(data.results);
    };

    fetchLocations();
  }, []);

  const handleLocationClick = async (location) => {
    setSelectedLocation(location);

    const areaUrl = location.url.replace("/location/", "/location-area/");
    const areaResponse = await fetch(areaUrl);
    const areaData = await areaResponse.json();
    const rand = Math.floor(Math.random() * areaData.pokemon_encounters.length);
    const pokemonUrl = areaData.pokemon_encounters[rand].pokemon.url;
    const pokemonResponse = await fetch(pokemonUrl);
    const pokemonData = await pokemonResponse.json();
    setSelectedLocation({ ...selectedLocation, pokemon: pokemonData });
  };

  return (
    <div>
      {selectedLocation ? (
        <div>
          <h2>{selectedLocation.name}</h2>
          {selectedLocation.pokemon && <PokemonCard pokemon={selectedLocation.pokemon} />}
        </div>
      ) : (
        <div>
          {locations.map((location) => (
            <LocationCard
              key={location.url}
              location={location}
              onClick={() => handleLocationClick(location)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationList;
