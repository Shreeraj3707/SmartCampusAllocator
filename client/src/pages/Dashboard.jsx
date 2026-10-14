import { useEffect, useState } from "react";
import { getRooms, getMyBookings } from "../services/api";
import StatCard from "../components/StatCard";
import RoomCard from "../components/RoomCard";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          getRooms(),
          getMyBookings(user.id),
        ]);
        setRooms(roomsRes.data.rooms || []);
        setBookings(bookingsRes.data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  if (loading) return <div className="page"><h2>Loading...</h2></div>;

  const pending = bookings.filter((b) => b.status === "pending").length;
  const approved = bookings.filter((b) => b.status === "approved").length;

  return (
    <div className="page">
      <h2>Dashboard</h2>
      <p style={{ marginBottom: 20, color: "#7f8c8d" }}>
        Welcome back, <strong>{user?.name}</strong> ({user?.role})
      </p>

      <div className="stats-grid">
        <StatCard number={rooms.length} label="Total Rooms" />
        <StatCard number={bookings.length} label="My Bookings" />
        <StatCard number={pending} label="Pending Requests" />
        <StatCard number={approved} label="Approved Bookings" />
      </div>

      <h2>Rooms Overview</h2>
      <div className="card-grid">
        {rooms.slice(0, 6).map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
}