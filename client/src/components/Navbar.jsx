import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h1>🏫 Smart Campus Allocator</h1>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/rooms">Rooms</Link>
        <Link to="/book">Book</Link>
        <Link to="/my-bookings">My Bookings</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}

        {user ? (
          <>
            <span style={{ marginLeft: 20, fontSize: "0.9rem", opacity: 0.85 }}>
              👤 {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                marginLeft: 12,
                padding: "6px 12px",
                background: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </div>
  );
}