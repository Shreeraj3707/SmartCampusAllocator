import { useEffect, useState } from "react";
import { getMyBookings, updateBookingStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const { user } = useAuth();

  const load = async () => {
    if (!user) return;
    try {
      const res = await getMyBookings(user.id);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await updateBookingStatus(id, "cancelled");
      setMessage({ type: "success", text: "Booking cancelled." });
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to cancel booking",
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

  if (loading) return <div className="page"><h2>Loading...</h2></div>;

  return (
    <div className="page">
      <h2>My Bookings</h2>

      {message && (
        <div className={`alert ${message.type}`} style={{ marginBottom: 20 }}>
          {message.text}
        </div>
      )}

      {bookings.length === 0 ? (
        <p>You have no bookings yet. Go to the <strong>Book</strong> page to request one.</p>
      ) : (
        <div className="card-grid">
          {bookings.map((b) => (
            <div key={b._id} className="room-card">
              <h3>{b.room?.name || "Unknown Room"}</h3>
              <p className="meta">📍 {b.room?.building || "—"}</p>
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

              {(b.status === "pending" || b.status === "approved") && (
                <button
                  className="btn"
                  style={{ marginTop: 12, background: "#e74c3c" }}
                  onClick={() => cancel(b._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}