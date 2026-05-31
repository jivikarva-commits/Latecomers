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

  // Logged in but profile (name/gender/phone) not completed → force profile setup
  // (allow access to /profile-setup itself so they can complete it)
  if (!user.isProfileCompleted && location.pathname !== "/profile-setup") {
    return <Navigate to="/profile-setup" replace />;
  }

  // Profile complete but onboarding (quiz) not completed → force onboarding
  if (user.isProfileCompleted && !user.onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
