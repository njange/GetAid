import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppHeader } from "../components/AppHeader";
import "./app.css";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="app-page">
      <AppHeader />
      <main className="courses-main">
        <section className="courses-hero">
          <h1>Profile</h1>
          <p>Your account details.</p>
        </section>

        <section className="profile-card">
          <span className="profile-avatar" aria-hidden="true">
            {initials(user?.name)}
          </span>
          <div className="profile-info">
            <span className="profile-name">{user?.name ?? "—"}</span>
            <span className="profile-email">{user?.email ?? ""}</span>
          </div>
        </section>

        <button
          type="button"
          className="profile-logout-button"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out…" : "Log out"}
        </button>
      </main>
    </div>
  );
}
