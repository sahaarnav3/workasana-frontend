import "../styles/main.css";

export default function PeopleAvatar({ people }) {

  function getRandomColorPair(seed) {
    // Simple seeded color generator for consistent colors per user
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    // pastel background
    const h = Math.abs(hash) % 360;
    const bg = `hsl(${h}, 70%, 80%)`;
    // dark text for light backgrounds
    const color = "#333";
    return { bg, color };
  }

  const maxVisible = 3;
  const visiblePeople = people.slice(0, maxVisible);
  const extraCount = people.length - maxVisible;

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "1em" }}>
      <div className="avatar avatar-icon" style={{ zIndex: 10 }}>
        <img
          src="https://www.svgrepo.com/show/92943/user.svg"
          alt=""
          width={32}
          height={32}
        />
      </div>
      {visiblePeople.map((person, idx) => {
        const { bg, color } = getRandomColorPair(person.name);
        return (
          <div
            className="avatar"
            key={idx}
            style={{
              background: bg,
              color,
              marginLeft: idx === 0 ? 0 : -12,
              zIndex: 10 + idx,
              border: "1px solid #fff",
              position: "relative",
            }}
          >
            {person.initial}
          </div>
        );
      })}
      {extraCount > 0 && (
        <div
          className="avatar avatar-extra"
          style={{
            marginLeft: -12,
            zIndex: 10 + visiblePeople.length,
            position: "relative",
            border: "2px solid #fff",
          }}
        >
          +{extraCount}
        </div>
      )}
      {Array.from({ length: Math.max(0, maxVisible - people.length) }).map(
        (_, idx) => (
          <div
            className="avatar avatar-empty"
            key={`empty-${idx}`}
            style={{
              marginLeft: -12,
              zIndex: 5 - idx,
              position: "relative",
              border: "2px solid #fff",
            }}
          ></div>
        )
      )}
    </div>
  );
}
