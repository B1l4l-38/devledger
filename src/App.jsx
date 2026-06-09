import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Explore from "./pages/public/Explore";
import DeveloperProfile from "./pages/public/DeveloperProfile";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Projects from "./pages/dashboard/Projects";
import Logs from "./pages/dashboard/Logs";

import Subscribers from "./pages/admin/Subscribers";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dev/:username" element={<DeveloperProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="logs" element={<Logs />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route path="subscribers" element={<Subscribers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}