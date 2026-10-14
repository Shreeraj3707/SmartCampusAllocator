import { useEffect, useState } from "react";
import {
  getAllBookingsAdmin,
  adminUpdateBookingStatus,
  getAdminStats,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const { token } = useAuth();

  const load = async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        getAllBookingsAdmin(token),
        getAdminStats(token),
      ]);
      setBookings(bookingsRes.data.bookings || []);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load admin data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      await adminUpdateBookingStatus(id, status, token);
      setMessage({ type: "success", text: `Booking ${status}` });
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Update failed",
      });
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "approved":
        return "#27ae60";
      case "pending":
        return "#f39c12";
      case "rejected":
        return "#e74c3c";
      case "cancelled":
        return "#95a5a6";
      default:
        return "#3498db";
    }
  };

  if (loading) return <div className="page"><h2>Loading admin panel...</h2></div>;

  const filtered =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  return (
    <div className="page">
      <h2>Admin Panel</h2>

      {message && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}

      {stats && (
        <div className="stats-grid" style={{ marginBottom: 32 }}>
          <StatCard number={stats.totalUsers} label="Total Users" />
          <StatCard number={stats.totalBookings} label="Total Bookings" />
          <StatCard number={stats.pending} label="Pending" />
          <StatCard number={stats.approved} label="Approved" />
          <StatCard number={stats.rejected} label="Rejected" />
        </div>
      )}

      <h3 style={{ marginBottom: 12 }}>All Bookings</h3>

      <div className="form-group" style={{ maxWidth: 300, marginBottom: 20 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No bookings to show.</p>
      ) : (
        <div className="card-grid">
          {filtered.map((b) => (
            <div key={b._id} className="room-card">
              <h3>{b.room?.name || "Unknown Room"}</h3>
              <p className="meta">
                👤 {b.user?.name} ({b.user?.email})
              </p>
              <p className="meta">📅 {b.date}</p>
              <p className="meta">
                🕐 {b.startTime} – {b.endTime}
              </p>
              <p className="meta">📝 {b.purpose}</p>
              <p className="meta">
                Status:{" "}
                <strong style={{ color: statusColor(b.status) }}>
                  {b.status.toUpperCase()}
                </strong>
              </p>

              {b.status === "pending" && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    className="btn"
                    style={{ background: "#27ae60", flex: 1 }}
                    onClick={() => updateStatus(b._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn"
                    style={{ background: "#e74c3c", flex: 1 }}
                    onClick={() => updateStatus(b._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}