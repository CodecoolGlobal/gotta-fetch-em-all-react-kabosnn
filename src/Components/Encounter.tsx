import React, { useEffect, useState } from 'react';

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
  "https://pokeapi.co/api/v2/pokemon/poliwhirl"
];

type EncounterProps = {
  location: string;
  encounteredPokemon: any;
  onEndEncounter: (newUsersPokemonUrls: string[], message: string) => void;
};

function Encounter(props: EncounterProps) {
  const { location, encounteredPokemon, onEndEncounter } = props;
  const [usersPokemon, setUsersPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [encounteredPokemonState, setEncounteredPokemonState] = useState<any>(encounteredPokemon);
  const [message, setMessage] = useState('');
  const [messageTwo, setMessageTwo] = useState('');
  const [battleStarted, setBattleStarted] = useState(false);

  useEffect(() => {
    const fetchPokemon = async (url: string) => {
      const response = await fetch(url);
      const data = await response.json();
      return {
        name: data.name,
        url,
        hp: data.stats.find((stat: any) => stat.stat.name === 'hp').base_stat,
        attack: data.stats.find((stat: any) => stat.stat.name === 'attack').base_stat,
        defense: data.stats.find((stat: any) => stat.stat.name === 'defense').base_stat,
        sprite: data.sprites.front_default
      };
    };

    const fetchAllUsersPokemon = async () => {
      const promises = initialUsersPokemonUrls.map(url => fetchPokemon(url));
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
      setMessage('');
    } else {
      setMessage('Please select a Pokémon to start the battle.');
    }
  };

  const handleAttack = () => {
    if (!selectedPokemon || !encounteredPokemonState) return;

    let userHP = selectedPokemon.hp;
    let opponentHP = encounteredPokemonState.stats.find((stat: any) => stat.stat.name === 'hp').base_stat;

    const userDamage = calculateDamage(selectedPokemon.attack, encounteredPokemonState.stats.find((stat: any) => stat.stat.name === 'defense').base_stat);
    opponentHP -= userDamage;

    setMessage(`${selectedPokemon.name} hits ${encounteredPokemonState.name} for ${userDamage} damage!`);
    

    if (opponentHP <= 0) {
      setMessage(`You captured ${encounteredPokemonState.name}!`);
      const newUsersPokemonUrls = [...initialUsersPokemonUrls, encounteredPokemonState];
      onEndEncounter(newUsersPokemonUrls, 'Victory! You captured the Pokémon.');
      initialUsersPokemonUrls.push(`https://pokeapi.co/api/v2/pokemon/${encounteredPokemonState.name}`)
      
      setBattleStarted(false);
      
      return;
    }

    const opponentDamage = calculateDamage(encounteredPokemonState.stats.find((stat: any) => stat.stat.name === 'attack').base_stat, selectedPokemon.defense);
    userHP -= opponentDamage;
    setMessageTwo(`${encounteredPokemonState.name} hits ${selectedPokemon.name} for ${opponentDamage} damage!`);

    setSelectedPokemon({ ...selectedPokemon, hp: userHP });
    setEncounteredPokemonState({ ...encounteredPokemonState, stats: encounteredPokemonState.stats.map((stat: any) => stat.stat.name === 'hp' ? { ...stat, base_stat: opponentHP } : stat) });

    if (userHP <= 0) {
      setMessage(`${selectedPokemon.name} fainted!`);
      const newUsersPokemonUrls = initialUsersPokemonUrls.filter(url => url !== selectedPokemon.url);
      onEndEncounter(newUsersPokemonUrls, 'Defeat! You lost your Pokémon.');
      setBattleStarted(false);
    }
  };

  const handleDefense = () => {
    // Handle defense logic if needed
  };

  const calculateDamage = (attack: number, defense: number) => {
    const randomFactor = Math.floor(Math.random() * (255 - 217 + 1)) + 217;
    const damage = ((((2 / 5 + 2) * attack * 60 / defense) / 50) + 2) * randomFactor / 255;
    console.log(`Damage: ${damage}`);
    return Math.ceil(damage);
  };

  return (
    <div>
      <h2>Encounter in {location}!</h2>
      {battleStarted ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {selectedPokemon && (
              <div>
                <h3>Your Pokémon</h3>
                <img src={selectedPokemon.sprite} alt={selectedPokemon.name} />
                <p>{selectedPokemon.name}</p>
                <p>HP: {selectedPokemon.hp}</p>
                <p>Attack: {selectedPokemon.attack}</p>
                <p>Defense: {selectedPokemon.defense}</p>
              </div>
            )}
            {encounteredPokemonState && (
              <div>
                <h3>Encountered Pokémon</h3>
                <img src={encounteredPokemonState.sprites.front_default} alt={encounteredPokemonState.name} />
                <p>{encounteredPokemonState.name}</p>
                <p>HP: {encounteredPokemonState.stats.find((stat: any) => stat.stat.name === 'hp').base_stat}</p>
                <p>Attack: {encounteredPokemonState.stats.find((stat: any) => stat.stat.name === 'attack').base_stat}</p>
                <p>Defense: {encounteredPokemonState.stats.find((stat: any) => stat.stat.name === 'defense').base_stat}</p>
              </div>
            )}
          </div>
          <button onClick={handleAttack}>Attack</button>
          <button onClick={handleDefense}>Defense</button>
        </>
      ) : (
        <>
          <h3>Select Your Pokémon</h3>
          <div style={{ display: 'flex' }}>
            {usersPokemon.map(pokemon => (
              <div key={pokemon.name} onClick={() => selectPokemon(pokemon)} style={{ cursor: 'pointer', margin: '10px' }}>
                <img src={pokemon.sprite} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </div>
            ))}
          </div>
          <button onClick={startBattle}>Start Battle</button>
        </>
      )}
      <p>{message}</p>
      <p>{messageTwo}</p>
    </div>
  );
}

export default Encounter;
