import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api/client";

export function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(`${data.status} (db: ${data.db})`))
      .catch((err) => setStatus(`error: ${err.message}`));
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <section id="center">
      <h1>First Aid</h1>
      <p>Welcome, {user.name}</p>
      <p>API status: {status}</p>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </section>
  );
}
