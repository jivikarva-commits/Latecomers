import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  // Not logged in → sign in
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Logged in but onboarding not completed →  force onboarding
  // (allow access to /onboarding itself so they can complete it)
  if (!user.onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
