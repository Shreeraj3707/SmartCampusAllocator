import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  // Still loading auth state from localStorage
  if (loading) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  // Not logged in → redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin, yet adminOnly route
  if (adminOnly && user.role !== "admin") {
    return (
      <div className="page">
        <h2>Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  // All checks passed — render the protected content
  return children;
}