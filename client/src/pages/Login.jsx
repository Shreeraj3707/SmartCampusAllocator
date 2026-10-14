import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        if (!form.email || !form.password) {
          setMessage({ type: "error", text: "Email and password required" });
          return;
        }
        const user = await login(form.email, form.password);
        setMessage({ type: "success", text: `Welcome back, ${user.name}!` });
        setTimeout(() => navigate("/"), 500);
      } else {
        if (!form.name || !form.email || !form.password) {
          setMessage({ type: "error", text: "All fields are required" });
          return;
        }
        const user = await register(form.name, form.email, form.password, form.role);
        setMessage({ type: "success", text: `Account created. Hi, ${user.name}!` });
        setTimeout(() => navigate("/"), 500);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

      {message && <Alert type={message.type} text={message.text} />}

      <form className="form" onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@campus.edu"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <p style={{ marginTop: 16, fontSize: "0.9rem", color: "#7f8c8d" }}>
          {mode === "login" ? "New here? " : "Already have an account? "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMode(mode === "login" ? "register" : "login");
              setMessage(null);
            }}
            style={{ color: "#3498db" }}
          >
            {mode === "login" ? "Create an account" : "Login instead"}
          </a>
        </p>
      </form>
    </div>
  );
}