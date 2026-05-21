import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = location.hash || window.location.hash;
    const m = hash.match(/session_id=([^&]+)/);
    if (!m) {
      setError("Missing session_id");
      return;
    }
    const sessionId = decodeURIComponent(m[1]);

    (async () => {
      try {
        const { data } = await api.post("/auth/session", { session_id: sessionId });
        setUser(data.user);
        // Clear hash and route to dashboard or onboarding
        window.history.replaceState({}, "", "/dashboard");
        if (data.user && !data.user.onboarded) {
          navigate("/onboarding", { state: { user: data.user }, replace: true });
        } else {
          navigate("/dashboard", { state: { user: data.user }, replace: true });
        }
      } catch (e) {
        setError(e?.response?.data?.detail || "Authentication failed");
        setTimeout(() => navigate("/signin", { replace: true }), 2500);
      }
    })();
  }, [location.hash, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50" data-testid="auth-callback">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-600 font-semibold mb-2">{error}</p>
            <p className="text-sm text-muted2">Redirecting…</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink font-semibold">Signing you in…</p>
          </>
        )}
      </div>
    </div>
  );
}
