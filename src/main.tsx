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
    setSelectedLocation(null);
    setEncounteredPokemon(null);
    setBattleMessage(message);
  };

  return (
    <React.StrictMode>
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
