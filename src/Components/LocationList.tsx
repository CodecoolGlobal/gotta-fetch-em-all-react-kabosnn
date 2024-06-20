import React, { useState, useEffect } from "react";
import LocationCard from "./LocationCard";
import PokemonCard from "./PokemonCard";

type Location = {
  name: string;
  url: string;
};

type Pokemon = {
  name: string;
  url: string;
  sprites: { front_default: string };
};

type LocationListProps = {
  onLocationSelect: (location: Location, pokemon: Pokemon) => void;
  usersPokemonUrls: string[];
};

export default function LocationList(props: LocationListProps) {
  const { onLocationSelect, usersPokemonUrls } = props;
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/location/");
      const data = await response.json();
      setLocations(data.results);
    };

    fetchLocations();
  }, []);

  const handleLocationClick = async (location: Location) => {
    setSelectedLocation(location);

    const areaUrl = location.url.replace("/location/", "/location-area/");
    const areaResponse = await fetch(areaUrl);
    const areaData = await areaResponse.json();
    const rand = Math.floor(Math.random() * areaData.pokemon_encounters.length);
    const pokemonUrl = areaData.pokemon_encounters[rand].pokemon.url;
    const pokemonResponse = await fetch(pokemonUrl);
    const pokemonData = await pokemonResponse.json();

    setSelectedPokemon(pokemonData);
    onLocationSelect(location, pokemonData);
  };

  const imagesArray = [
    "https://archives.bulbagarden.net/media/upload/thumb/7/7d/Canalave_City_anime.png/250px-Canalave_City_anime.png",
    "https://images.shoutwiki.com/pokemmo/d/d3/Eterna_City.png",
    "https://images.shoutwiki.com/pokemmo/e/eb/Pastoria_City.png",
    "https://archives.bulbagarden.net/media/upload/thumb/1/1b/Sunyshore_City_Pt.png/433px-Sunyshore_City_Pt.png",
    "https://archives.bulbagarden.net/media/upload/1/11/Pok%C3%A9mon_League_lobby_DP.png",
    "https://images.shoutwiki.com/pokemmo/8/8c/Oreburgh_Mine.png",
    "https://images.shoutwiki.com/pokemmo/4/4c/Valley_Windworks.png",
    "https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fj5uelfcnwix11.png",
    "https://images.shoutwiki.com/pokemmo/5/53/Fuego_Ironworks.png",
    "https://archives.bulbagarden.net/media/upload/4/46/Mt._Coronet.png",
    "https://images.shoutwiki.com/pokemmo/0/0c/Great_Marsh.png",
    "https://images.shoutwiki.com/pokemmo/9/99/Solaceon_Ruins_exterior.png",
    "https://wiki.pokeclicker.com/images/Victory%20Road%20Sinnoh.png",
    "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-leafgreen-version/b/be/Altering_Cave_FRLG.png",
    "https://images.shoutwiki.com/pokemmo/7/78/Oreburgh_Gate_B1F_DPPt.png",
    "https://images.shoutwiki.com/pokemmo/4/45/Stark_Mountain.png",
    "https://www.serebii.net/pokearth/maps/sinnoh-bdsp/96.jpg",
    "https://cdn.staticneo.com/w/pokemon/f/f8/Spring_Giratina.png",
    "https://wiki.pokeclicker.com/images/Snowpoint%20Temple.png",
    "https://lh5.googleusercontent.com/proxy/5gYVGfbWiWMTzsi5oJSWdCyz_Lce5xQccajYrdTQPD0r0V0RqDHY7sPSf6RIPBhaQivapzspCIjaiT7xfa7EQ3yl24KC82lYBJPiIPgrx4Vk0A"
  ];

  return (
    <div>
      <div className="logo-container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1280px-International_Pok%C3%A9mon_logo.svg.png" className="logo" />
      </div>
      <div>
        {selectedLocation && selectedPokemon ? (
          <PokemonCard pokemon={selectedPokemon} />
        ) : (
          <div className="table-container">
            <div className="location-table">
              {locations.map((location, index) => (
                <LocationCard
                  key={location.url}
                  location={location}
                  imageUrl={imagesArray[index % imagesArray.length]} 
                  onClick={() => handleLocationClick(location)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
