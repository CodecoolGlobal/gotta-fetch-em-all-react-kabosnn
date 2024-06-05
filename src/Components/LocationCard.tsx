import React from "react";

type LocationCardProps = {
  location: {
    name: string;
    url: string;
  };
  onClick: () => void;
};

function LocationCard(props: LocationCardProps) {
  const { location, onClick } = props;

  return (
    <div onClick={onClick} style={{ cursor: 'pointer', margin: '10px', border: '1px solid black', padding: '10px' }}>
      <h4>{location.name}</h4>
    </div>
  );
}

export default LocationCard;
