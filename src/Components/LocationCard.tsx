import React from "react";

type LocationCardProps = {
  location: {
    name: string;
    url: string;
  };
  imageUrl: string; // Add imageUrl prop
  onClick: () => void;
};

export default function LocationCard(props: LocationCardProps) {
  const { location, imageUrl, onClick } = props;

  return (
    <div className="location" onClick={onClick}>
      <div className="img-container">
        <img src={imageUrl} alt={location.name} className="location-img" />
      </div>
      <h4>
        {location.name
          .split("-")
          .map((s) => s[0].toUpperCase() + s.slice(1))
          .join(" ")}
      </h4>
    </div>
  );
}

