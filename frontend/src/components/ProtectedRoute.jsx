import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "latecomers.in@gmail.com";
const isAdminUser = (user) => (user?.email || "").toLowerCase() === ADMIN_EMAIL;

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (isAdminUser(user)) {
    if (location.pathname !== "/admin") {
      return <Navigate to="/admin" replace />;
    }
    return children;
  }

  if (!user.isProfileCompleted && location.pathname !== "/profile-setup") {
    return <Navigate to="/profile-setup" replace />;
  }

  if (user.isProfileCompleted && !user.onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
