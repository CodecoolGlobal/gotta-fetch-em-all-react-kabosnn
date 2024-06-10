import React from "react";

type LocationCardProps = {
  location: {
    name: string;
    url: string;
  };
  onClick: () => void;
};

export default function LocationCard(props: LocationCardProps) {
  const { location, onClick } = props;

  return (
    <div className="location"
      onClick={onClick}
    >

      <h4>
        {location.name
          .split("-")
          .map((s) => s[0].toUpperCase() + s.slice(1))
          .join(" ")}
      </h4>
    </div>
  );
}
