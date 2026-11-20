
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Standard User Dashboard */}
          <Route element={
            <ProtectedRoute allowedRoles={["STANDARD_USER"]} />
          }>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Administrator pages */}
          <Route element={
            <ProtectedRoute allowedRoles={["ADMINISTRATOR"]} />
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          {/* Products: both authenticated roles */}
          <Route element={
            <ProtectedRoute allowedRoles={["STANDARD_USER", "ADMINISTRATOR"]} />
          }>
            <Route path="/products" element={<ProductManagement />} />
          </Route>

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
