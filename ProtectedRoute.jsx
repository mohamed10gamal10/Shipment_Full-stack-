import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullPageLoader } from "./ui/Feedback";

// roles: who may see the page.  needProfile: customers must finish their profile first.
export function ProtectedRoute({ roles, needProfile = true, children }) {
  const { user, profile, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  if (needProfile && user.role === "customer" && !profile) return <Navigate to="/welcome" replace />;
  return children;
}

// Login / register pages: logged-in users go straight to the dashboard.
export function GuestRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <FullPageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
