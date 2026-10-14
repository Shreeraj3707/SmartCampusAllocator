import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ─── Rooms ────────────────────────────────────────
export const getRooms = () => API.get("/rooms");
export const createRoom = (data) => API.post("/rooms", data);

// ─── Bookings ─────────────────────────────────────
export const createBooking = (data) => API.post("/bookings", data);
export const getMyBookings = (userId) => API.get(`/bookings/my/${userId}`);
export const updateBookingStatus = (id, status) =>
  API.patch(`/bookings/${id}/status`, { status });

// ─── Users / Auth ─────────────────────────────────
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);

// ─── Admin (require token) ────────────────────────
export const getAllBookingsAdmin = (token) =>
  API.get("/admin/bookings", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const adminUpdateBookingStatus = (id, status, token) =>
  API.patch(
    `/admin/bookings/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getAdminStats = (token) =>
  API.get("/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });