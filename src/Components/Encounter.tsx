import React, { useEffect, useState } from 'react';

type Pokemon = {
  name: string;
  url: string;
  hp: number;
  attack: number;
  defense: number;
  sprite: string;
};

const usersPokemonUrls = [
  "https://pokeapi.co/api/v2/pokemon/bulbasaur",
  "https://pokeapi.co/api/v2/pokemon/charizard",
  "https://pokeapi.co/api/v2/pokemon/poliwhirl"
];

type EncounterProps = {
  location: string;
  encounteredPokemon: any;
  onEndEncounter: (newUsersPokemon: string[], message: string) => void;
};

const Encounter: React.FC<EncounterProps> = ({ location, encounteredPokemon, onEndEncounter }) => {
  const [usersPokemon, setUsersPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [message, setMessage] = useState<string>('');
  const [battleStarted, setBattleStarted] = useState<boolean>(false);

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
      const promises = usersPokemonUrls.map(url => fetchPokemon(url));
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
    if (!selectedPokemon || !encounteredPokemon) return;
  
    let userHP = selectedPokemon.hp;
    let opponentHP = encounteredPokemon.stats.find((stat: any) => stat.stat.name === 'hp').base_stat;
  
    const userDamage = calculateDamage(selectedPokemon.attack, encounteredPokemon.stats.find((stat: any) => stat.stat.name === 'defense').base_stat);
    opponentHP -= userDamage;
    setMessage(`${selectedPokemon.name} hits ${encounteredPokemon.name} for ${userDamage} damage!`);
  
    const opponentDamage = calculateDamage(encounteredPokemon.stats.find((stat: any) => stat.stat.name === 'attack').base_stat, selectedPokemon.defense);
    userHP -= opponentDamage;
    setMessage(`${encounteredPokemon.name} hits ${selectedPokemon.name} for ${opponentDamage} damage!`);
  
    setSelectedPokemon({ ...selectedPokemon, hp: userHP });
    setEncounteredPokemon({ ...encounteredPokemon, stats: [{ base_stat: opponentHP, stat: { name: 'hp' } }] });
  
    if (opponentHP <= 0) {
      setMessage(`You captured ${encounteredPokemon.name}!`);
      const newUsersPokemon = [...usersPokemon, encounteredPokemon];
      onEndEncounter(newUsersPokemon, 'Victory! You captured the Pokémon.');
      setBattleStarted(false);
    }
  
    if (userHP <= 0) {
      setMessage(`${selectedPokemon.name} fainted!`);
      const newUsersPokemon = usersPokemon.filter(pokemon => pokemon.url !== selectedPokemon.url);
      onEndEncounter(newUsersPokemon.map(pokemon => pokemon.url), 'Defeat! You lost your Pokémon.');
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
    return damage;
  };
  


  return (
    <div>
      <h1>Encounter in {location}!</h1>
      {battleStarted ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {selectedPokemon && (
              <div>
                <h2>Your Pokémon</h2>
                <img src={selectedPokemon.sprite} alt={selectedPokemon.name} />
                <p>{selectedPokemon.name}</p>
                <p>HP: {selectedPokemon.hp}</p>
                <p>Attack: {selectedPokemon.attack}</p>
                <p>Defense: {selectedPokemon.defense}</p>
              </div>
            )}
            {encounteredPokemon && (
              <div>
                <h2>Encountered Pokémon</h2>
                <img src={encounteredPokemon.sprites.front_default} alt={encounteredPokemon.name} />
                <p>{encounteredPokemon.name}</p>
                <p>HP: {encounteredPokemon.stats.find((stat: any) => stat.stat.name === 'hp').base_stat}</p>
                <p>Attack: {encounteredPokemon.stats.find((stat: any) => stat.stat.name === 'attack').base_stat}</p>
                <p>Defense: {encounteredPokemon.stats.find((stat: any) => stat.stat.name === 'defense').base_stat}</p>
              </div>
            )}
          </div>
          <div>
            <button onClick={handleAttack}>Attack</button>
            <button onClick={handleDefense}>Defense</button>
          </div>
        </>
      ) : (
        <>
          <h2>Select Your Pokémon</h2>
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
    </div>
  );
};

export default Encounter;
