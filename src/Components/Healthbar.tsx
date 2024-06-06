export default function HealthBar({
  maxHp,
  hp,
}: {
  maxHp: number;
  hp: number;
}) {
  const barWidth = (hp / maxHp) * 100;

  return (
    <div
      style={{ position: "relative", width: "100%", border: "1px solid #000" }}
    >
      <div
        style={{
          width: `${barWidth}%`,
          backgroundColor: "green",
          height: "20px",
          transition: "width 0.5s ease",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          textSizeAdjust: "auto",
        }}
      >
        {hp} / {maxHp}
      </div>
    </div>
  );
}
