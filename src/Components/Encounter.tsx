import React, { useEffect, useState } from "react";
import HealthBar from "./Healthbar";
import "../index.css";

type Pokemon = {
  name: string;
  url: string;
  hp: number;
  attack: number;
  defense: number;
  sprite: string;
};

let initialUsersPokemonUrls = [
  "https://pokeapi.co/api/v2/pokemon/bulbasaur",
  "https://pokeapi.co/api/v2/pokemon/charizard",
  "https://pokeapi.co/api/v2/pokemon/poliwhirl",
  "https://pokeapi.co/api/v2/pokemon/dragonite"
];

type EncounterProps = {
  location: string;
  encounteredPokemon: any;
  onEndEncounter: (newUsersPokemonUrls: string[], message: string) => void;
};

export default function Encounter({
  location,
  encounteredPokemon,
  onEndEncounter,
}: EncounterProps) {
  const [usersPokemon, setUsersPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [encounteredPokemonState, setEncounteredPokemonState] =
    useState<any>(encounteredPokemon);
  const [message, setMessage] = useState("");
  const [messageTwo, setMessageTwo] = useState("");
  const [battleStarted, setBattleStarted] = useState(false);
  const [userAnimation, setUserAnimation] = useState("");
  const [opponentAnimation, setOpponentAnimation] = useState("");

  useEffect(() => {
    const fetchPokemon = async (url: string) => {
      const response = await fetch(url);
      const data = await response.json();
      return {
        name: data.name,
        url: `https://pokeapi.co/api/v2/pokemon/${data.name}`,
        hp: data.stats.find((stat: any) => stat.stat.name === "hp").base_stat,
        attack: data.stats.find((stat: any) => stat.stat.name === "attack")
          .base_stat,
        defense: data.stats.find((stat: any) => stat.stat.name === "defense")
          .base_stat,
        sprite: data.sprites.front_default,
      };
    };

    const fetchAllUsersPokemon = async () => {
      const promises = initialUsersPokemonUrls.map((url) => fetchPokemon(url));
      const results = await Promise.all(promises);
      setUsersPokemon(results);
    };

    fetchAllUsersPokemon();
  }, []);

  const selectPokemon = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const startBattle = () => {
    if (selectedPokemon) {
      setBattleStarted(true);
      setMessage("");
    } else {
      setMessage("Please select a Pokémon to start the battle.");
    }
  };

  const handleAttack = () => {
    if (!selectedPokemon || !encounteredPokemonState) return;

    setUserAnimation("attack");
    setOpponentAnimation("hit");

    const userDamage = calculateDamage(
      selectedPokemon.attack,
      encounteredPokemonState.stats.find(
        (stat: any) => stat.stat.name === "defense"
      ).base_stat
    );
    const opponentDamage = calculateDamage(
      encounteredPokemonState.stats.find(
        (stat: any) => stat.stat.name === "attack"
      ).base_stat,
      selectedPokemon.defense
    );

    const newOpponentHP =
      encounteredPokemonState.stats.find((stat: any) => stat.stat.name === "hp")
        .base_stat - userDamage;
    const newUserHP = selectedPokemon.hp - opponentDamage;

    setMessage(
      `${selectedPokemon.name} hits ${encounteredPokemonState.name} for ${userDamage} damage!`
    );
    setMessageTwo(
      `${encounteredPokemonState.name} hits ${selectedPokemon.name} for ${opponentDamage} damage!`
    );

    if (newOpponentHP <= 0) {
      setMessage(`You captured ${encounteredPokemonState.name}!`);
      const newUsersPokemonUrls = [
        ...initialUsersPokemonUrls,
        encounteredPokemonState.url,
      ];
      onEndEncounter(newUsersPokemonUrls, "Victory! You captured the Pokémon.");
      initialUsersPokemonUrls.push(
        `https://pokeapi.co/api/v2/pokemon/${encounteredPokemonState.name}`
      );
      setBattleStarted(false);
      return;
    }

    if (newUserHP <= 0) {
      const newUsersPokemonUrls = initialUsersPokemonUrls.filter(
        (url) => url !== selectedPokemon.url
      );
      onEndEncounter(newUsersPokemonUrls, "Defeat! You lost your Pokémon.");
      initialUsersPokemonUrls = initialUsersPokemonUrls.filter(
        (url) =>
          url !== `https://pokeapi.co/api/v2/pokemon/${selectedPokemon.name}`
      );
      setBattleStarted(false);
      return;
    }

    setSelectedPokemon({ ...selectedPokemon, hp: newUserHP });
    setEncounteredPokemonState({
      ...encounteredPokemonState,
      stats: encounteredPokemonState.stats.map((stat: any) =>
        stat.stat.name === "hp" ? { ...stat, base_stat: newOpponentHP } : stat
      ),
    });

    setTimeout(() => {
      setUserAnimation("");
      setOpponentAnimation("");
    }, 500);
  };

  const handleDefense = () => {};

  const calculateDamage = (attack: number, defense: number) => {
    const randomFactor = Math.floor(Math.random() * (255 - 217)) + 217;
    const damage =
      ((((2 / 5 + 2) * attack * 60) / defense / 50 + 2) * randomFactor) / 255;
    console.log(`Damage: ${damage}`);
    return Math.ceil(damage);
  };

  return (
    <div>
      <h2>Encounter in {location}!</h2>
      <div className="battle-ground">
        {selectedPokemon && (
          <div className="pokemon-container">
            <h3>Your Pokémon</h3>
            <img
              className={userAnimation}
              src={selectedPokemon.sprite}
              alt={selectedPokemon.name}
            />
            <HealthBar
              hp={selectedPokemon.hp}
              maxHp={
                usersPokemon.find((p) => p.name === selectedPokemon.name)?.hp ||
                100
              }
            />
            <p>{selectedPokemon.name}</p>
            <p>Attack: {selectedPokemon.attack}</p>
            <p>Defense: {selectedPokemon.defense}</p>
          </div>
        )}
        {encounteredPokemonState && (
          <div className="pokemon-container">
            
            <h3>Encountered Pokémon</h3>
            <img
              className={opponentAnimation}
              src={encounteredPokemonState.sprites.front_default}
              alt={encounteredPokemonState.name}
            />
            <HealthBar
              hp={
                encounteredPokemonState.stats.find(
                  (stat: any) => stat.stat.name === "hp"
                ).base_stat
              }
              maxHp={
                encounteredPokemon.stats.find(
                  (stat: any) => stat.stat.name === "hp"
                ).base_stat
              }
            />
            <p>{encounteredPokemonState.name}</p>
            <p>
              Attack:{" "}
              {
                encounteredPokemonState.stats.find(
                  (stat: any) => stat.stat.name === "attack"
                ).base_stat
              }
            </p>
            <p>
              Defense:{" "}
              {
                encounteredPokemonState.stats.find(
                  (stat: any) => stat.stat.name === "defense"
                ).base_stat
              }
            </p>
          </div>
        )}
      </div>
      {battleStarted ? (
        <>
          <button onClick={handleAttack}>Attack</button>
          <button onClick={handleDefense}>Defense</button>
        </>
      ) : (
        <>
          <h3 className="selection">Select Your Pokémon</h3>
          <div className="flex-container">
            {usersPokemon.map((pokemon) => (
              <div
              className="select-pokemon-container"
                key={pokemon.name}
                onClick={() => selectPokemon(pokemon)}
              >
                <img src={pokemon.sprite} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </div>
            ))}
          </div>
          <button className="start-button" onClick={startBattle}>Start Battle</button>
        </>
      )}
      <p className="damage-mesage">{message}</p>
      <p className="damage-mesage">{messageTwo}</p>
    </div>
  );
}


