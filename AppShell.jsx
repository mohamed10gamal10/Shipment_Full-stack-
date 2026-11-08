import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Package, PlusCircle, UserRound, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Illustrations";

export default function AppShell() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Shipments", icon: Package },
    ...(user.role === "customer" ? [{ to: "/shipments/new", label: "New shipment", icon: PlusCircle }] : []),
    ...(user.role === "admin" ? [{ to: "/customers", label: "Customers", icon: Users }] : []),
    { to: "/profile", label: "Account", icon: UserRound },
  ];

  const displayName = profile?.name || user.username;
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/dashboard" aria-label="Waybill home"><Logo /></Link>

          <nav className="nav" aria-label="Main">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}>
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="topbar__user">
            <span className="avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>
            <span className="topbar__name">{displayName}</span>
            <button className="icon-btn" onClick={handleLogout} aria-label="Log out" title="Log out">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="container main">
        <Outlet />
      </main>
    </div>
  );
}
