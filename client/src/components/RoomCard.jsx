export default function RoomCard({ room, footer }) {
  return (
    <div className="room-card">
      <h3>{room.name}</h3>
      <p className="meta">📍 {room.building}</p>
      <p className="meta">👥 Capacity: {room.capacity}</p>
      <p className="meta">🏷️ {room.type}</p>
      {room.equipment && room.equipment.length > 0 && (
        <div className="equipment">
          {room.equipment.map((eq) => (
            <span key={eq} className="tag">
              {eq}
            </span>
          ))}
        </div>
      )}
      {footer}
    </div>
  );
}