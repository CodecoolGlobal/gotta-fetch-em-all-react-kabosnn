import React, { useEffect, useState } from "react";
import LocationCard from "./LocationCard";

export default function LocationsList() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/location/");
      const data = await response.json();
      setLocations(data.results);
    };

    fetchLocations();
  }, []);

  return (
    <div>
      {locations.map((location) => (
        <LocationCard key={location.url} location={location} />
      ))}
    </div>
  );
}


