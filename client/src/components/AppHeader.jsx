import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AppHeader.css";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="app-header">
      <Link to="/" className="app-logo">
        First Aid
      </Link>
      <div className="app-header-user">
        {user && <span className="app-header-greeting">Hi, {user.name?.split(" ")[0] ?? user.name}</span>}
        <button type="button" className="app-header-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
