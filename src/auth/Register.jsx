import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://chat-room-backend-nvx4.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email: email.toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email.toLowerCase());
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
          Join ChatRoom
        </h2>
        <p className="text-center text-secondary mb-4">
          Register now and start chatting in seconds.
        </p>

        <div className="auth-tabs d-flex mb-4">
          <Link to="/" className="tab-btn w-50 text-center">
            Login
          </Link>
          <button className="tab-btn active w-50">Register</button>
        </div>

        {error && (
          <p className="text-danger text-center small mb-3">{error}</p>
        )}

        <div className="mb-3">
          <label className="form-label text-white-50 fw-semibold">
            Full Name
          </label>
          <input
            type="text"
            className="form-control auth-input"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-white-50 fw-semibold">
            Email
          </label>
          <input
            type="email"
            className="form-control auth-input"
            placeholder="johndoe@gmail.com"
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn w-100 auth-btn fw-semibold py-2"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
