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
      style={{
        cursor: "pointer",
        margin: "10px",
        border: "1px solid black",
        padding: "10px",
      }}
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
