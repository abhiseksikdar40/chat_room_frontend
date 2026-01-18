import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100">
      <div className="auth-card p-4 p-md-5">
        <h2 className="text-center text-white fw-bold mb-1">Welcome Back 👋</h2>
        <p className="text-center text-secondary mb-4">
        Log in to continue chatting with your friends.
        </p>

        <div className="auth-tabs d-flex mb-4">
          <button className="tab-btn active w-50">Login</button>
          <Link to="/register" className="tab-btn w-50 text-center">
            Register
          </Link>
        </div>

        <div className="mb-3">
          <label className="form-label text-white-50 fw-semibold">Email</label>
          <input type="email" className="form-control auth-input" placeholder="Enter your email" />
        </div>

        <div className="mb-4">
          <label className="form-label text-white-50 fw-semibold">Password</label>
          <input type="password" className="form-control auth-input" placeholder="Enter your password" />
        </div>

        <button className="btn w-100 auth-btn fw-semibold py-2">Sign In</button>
      </div>
    </div>
  );
}
