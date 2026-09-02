import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AppHeader.css";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const NAV_ITEMS = [
  { label: "Hub", path: "/hub" },
  { label: "Learning", path: "/", isActive: (pathname) => pathname === "/" || pathname.startsWith("/courses") },
  { label: "Progress", path: "/progress" },
  { label: "Profile", path: "/profile" },
];

export function AppHeader() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <Link to="/" className="app-header-brand">
        <span className="app-avatar" aria-hidden="true">
          {initials(user?.name)}
        </span>
        <span className="app-logo">First Aid Training</span>
      </Link>

      <nav className="app-header-nav">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive ? item.isActive(pathname) : pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`app-header-nav-link${active ? " active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="app-header-search"
        aria-label="Search first aid topics"
        onClick={() => navigate("/")}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          search
        </span>
      </button>
    </header>
  );
}
