import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://chat-room-backend-nvx4.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // SAVE ALL REQUIRED DATA
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);         
      localStorage.setItem("fullName", data.fullName);

      navigate("/chat");
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100">
      <div className="auth-card p-4 p-md-5">
        <h2 className="text-center text-white fw-bold mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-center text-secondary mb-4">
          Log in to continue chatting with your friends.
        </p>

        <div className="auth-tabs d-flex mb-4">
          <button className="tab-btn active w-50">Login</button>
          <Link to="/register" className="tab-btn w-50 text-center">
            Register
          </Link>
        </div>

        {error && (
          <p className="text-danger text-center small mb-3">{error}</p>
        )}

        <div className="mb-3">
          <label className="form-label text-white-50 fw-semibold">
            Email
          </label>
          <input
            type="email"
            className="form-control auth-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-white-50 fw-semibold">
            Password
          </label>
          <input
            type="password"
            className="form-control auth-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn w-100 auth-btn fw-semibold py-2"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}
