import { useEffect, useState } from "react";
import { getRooms } from "../services/api";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms()
      .then((res) => setRooms(res.data.rooms || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.building.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="page"><h2>Loading rooms...</h2></div>;

  return (
    <div className="page">
      <h2>Available Rooms</h2>
      <div className="form-group" style={{ maxWidth: 400, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search by name or building..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <div className="card-grid">
          {filtered.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}