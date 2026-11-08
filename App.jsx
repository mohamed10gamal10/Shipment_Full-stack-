import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { GuestRoute, ProtectedRoute } from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import NewShipment from "./pages/NewShipment";
import ShipmentDetail from "./pages/ShipmentDetail";
import Profile from "./pages/Profile";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    // reducedMotion="user": people who turned off animations in their OS won't see them
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/welcome" element={<ProtectedRoute needProfile={false}><Welcome /></ProtectedRoute>} />

              {/* Everything below shares the top bar */}
              <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shipments/new" element={<ProtectedRoute roles={["customer"]}><NewShipment /></ProtectedRoute>} />
                <Route path="/shipments/:id" element={<ShipmentDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/customers" element={<ProtectedRoute roles={["admin"]}><Customers /></ProtectedRoute>} />
              </Route>

              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
