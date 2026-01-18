import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100">
      <div className="auth-card p-4 p-md-5">
        <h2 className="text-center text-white fw-bold mb-1">Join ChatRoom</h2>
            <p className="text-center text-secondary mb-4">
            Register now and start chatting in seconds.
            </p>

        <div className="auth-tabs d-flex mb-4">
          <Link to="/" className="tab-btn w-50 text-center">
            Login
          </Link>
          <button className="tab-btn active w-50">Register</button>
        </div>

        <div className="mb-3">
          <label className="form-label text-white-50 fw-semibold">Full Name</label>
          <input type="text" className="form-control auth-input" placeholder="Jhon Doe" />
        </div>

        <div className="mb-3">
          <label className="form-label text-white-50 fw-semibold">Email</label>
          <input type="email" className="form-control auth-input" placeholder="jhondoe@gmail.com" />
        </div>

        <div className="mb-4">
          <label className="form-label text-white-50 fw-semibold">Password</label>
          <input type="password" className="form-control auth-input" placeholder="Create a password" />
        </div>

        <button className="btn w-100 auth-btn fw-semibold py-2">Register</button>
      </div>
    </div>
  );
}
