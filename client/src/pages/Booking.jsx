import { useEffect, useState } from "react";
import { getRooms, createBooking } from "../services/api";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

export default function Booking() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    room: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    getRooms()
      .then((res) => setRooms(res.data.rooms || []))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (
      !form.room ||
      !form.date ||
      !form.startTime ||
      !form.endTime ||
      !form.purpose
    ) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    if (form.startTime >= form.endTime) {
      setMessage({ type: "error", text: "End time must be after start time" });
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({ ...form, user: user.id });
      setMessage({
        type: "success",
        text: "Booking request submitted! Awaiting admin approval.",
      });
      setForm({
        room: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Booking failed. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h2>Book a Room</h2>

      {message && <Alert type={message.type} text={message.text} />}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room</label>
          <select name="room" value={form.room} onChange={handleChange}>
            <option value="">-- Select a room --</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} ({r.building}) — capacity {r.capacity}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Purpose</label>
          <textarea
            name="purpose"
            rows="3"
            value={form.purpose}
            onChange={handleChange}
            placeholder="e.g., Study group meeting"
          />
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Request Booking"}
        </button>
      </form>
    </div>
  );
}