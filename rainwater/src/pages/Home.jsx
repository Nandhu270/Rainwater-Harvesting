import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUser({ name: storedUser });
  }, []);

  const handleLogin = () => {
    if (!usernameInput) return alert("Enter username to login.");
    setUser({ name: usernameInput });
    localStorage.setItem("username", usernameInput);
    setUsernameInput("");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("username");
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark shadow-sm py-3"
        style={{
          background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
          borderBottomLeftRadius: "15px",
          borderBottomRightRadius: "15px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div className="container">
          <a className="navbar-brand fw-bold fs-4" href="#">
            RainwaterHarvest
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item mx-2">
                <a
                  className="nav-link active fw-semibold"
                  href="#"
                  style={{ transition: "0.3s" }}
                >
                  Home
                </a>
              </li>
              <li className="nav-item mx-2">
                <a
                  className="nav-link fw-semibold"
                  href="#"
                  style={{ transition: "0.3s" }}
                >
                  Assessment
                </a>
              </li>
              <li className="nav-item mx-2">
                <a
                  className="nav-link fw-semibold"
                  href="#"
                  style={{ transition: "0.3s" }}
                >
                  About Us
                </a>
              </li>

              {/* User Section */}
              <li className="nav-item ms-3">
                {user ? (
                  <div className="d-flex align-items-center bg-white rounded-pill px-3 py-1 shadow-sm">
                    <span className="me-2 text-primary fw-bold">
                     {user.name}
                    </span>
                    <button
                      className="btn btn-gradient fw-bold"
                      onClick={handleLogout}
                      style={{
                        background: "linear-gradient(to right, #f87171, #fbbf24)",
                        color: "#fff",
                        border: "none",
                        padding: "0.35rem 0.9rem",
                        borderRadius: "50px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        transition: "0.3s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(to right, #fbbf24, #f87171)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(to right, #f87171, #fbbf24)")
                      }
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-pill"
                      placeholder="Username"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                    />
                    <button
                      className="btn btn-light btn-sm rounded-pill fw-bold"
                      onClick={handleLogin}
                    >
                      Login
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center text-center"
        style={{
          height: "50vh",
          background: "linear-gradient(to right, #3b82f6, #60a5fa)",
          color: "white",
          flexDirection: "column",
        }}
      >
        <h1 className="display-4 fw-bold mb-3">
          Welcome to Rainwater Harvesting
        </h1>
        <p className="lead mb-4">
          Assess, plan, and implement sustainable rainwater solutions for your
          home.
        </p>
      </section>

      {/* Info Cards Section */}
      <section className="container py-5">
        <h2 className="text-center mb-5">Turn Your Roof into a Water Source! 💧</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm h-100 p-3">
              <h5>How It Works</h5>
              <ol>
                <li>
                  <strong>Catchment:</strong> Your roof collects rainwater as it
                  falls.
                </li>
                <li>
                  <strong>Conveyance:</strong> Gutters & pipes direct water to
                  storage, filtered for debris.
                </li>
                <li>
                  <strong>Storage:</strong> Water stored in a tank or sump,
                  ready to use.
                </li>
              </ol>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100 p-3">
              <h5>Key Benefits</h5>
              <ul className="mb-0">
                <li>✅ Reduces Water Bills</li>
                <li>🌍 Eco-Friendly</li>
                <li>🌿 Healthier for Plants</li>
                <li>💧 Provides Water Security</li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm h-100 p-3">
              <h5>Is Your Property Suitable?</h5>
              <p>
                Our experts in Coimbatore provide a professional RTRWH
                assessment to analyze your roof, calculate potential water
                collection, recommend tank size, and design a customized plan
                for your needs.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/dashboard"
            className="btn btn-primary btn-lg fw-bold rounded-pill"
          >
            Start Assessment
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="container py-5" id="about">
        <h2 className="text-center mb-4">About Us</h2>
        <p className="text-center mx-auto" style={{ maxWidth: "700px" }}>
          We are dedicated to helping homeowners and communities implement
          efficient rainwater harvesting systems. Our platform provides
          assessments, recommendations, and guidance for sustainable water
          management.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container text-center">
          &copy; {new Date().getFullYear()} RainwaterHarvest. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
