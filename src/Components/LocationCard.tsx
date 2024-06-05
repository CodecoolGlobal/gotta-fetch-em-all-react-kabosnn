import React from "react";

type LocationCardProps = {
  location: {
    name: string;
    url: string;
  };
  onClick: () => void;
};

function LocationCard({ location, onClick }: LocationCardProps) {
  return (
    <div onClick={onClick}>
      <h2>{location.name}</h2>
    </div>
  );
}

export default LocationCard;
