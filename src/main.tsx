import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LocationList from "./Components/LocationList";
import Encounter from "./Components/Encounter";

function App() {
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [encounteredPokemon, setEncounteredPokemon] = useState<any | null>(
    null
  );
  const [usersPokemonUrls, setUsersPokemonUrls] = useState<string[]>([
    "https://pokeapi.co/api/v2/pokemon/bulbasaur",
    "https://pokeapi.co/api/v2/pokemon/charizard",
    "https://pokeapi.co/api/v2/pokemon/poliwhirl",
  ]);
  const [battleMessage, setBattleMessage] = useState<string>("");

  const handleLocationSelect = (location: any, pokemon: any) => {
    setSelectedLocation(location);
    setEncounteredPokemon(pokemon);
    setBattleMessage("");
  };

  const handleEndEncounter = (
    newUsersPokemonUrls: string[],
    message: string
  ) => {
    setUsersPokemonUrls(newUsersPokemonUrls);
    setSelectedLocation(null);
    setEncounteredPokemon(null);
    setBattleMessage(message);
  };

  return (
    <React.StrictMode>
      

 

      <div className="logo-container">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1280px-International_Pok%C3%A9mon_logo.svg.png" className="logo"/>
      </div>
      {battleMessage && <p>{battleMessage}</p>}
      {selectedLocation && encounteredPokemon ? (
        <Encounter
          location={selectedLocation.name.split("-")
          .map((s) => s[0].toUpperCase() + s.slice(1))
          .join(" ")}
          encounteredPokemon={encounteredPokemon}
          onEndEncounter={handleEndEncounter}
        />
      ) : (
      <LocationList onLocationSelect={handleLocationSelect} />

      )}
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
