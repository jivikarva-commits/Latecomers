import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { toast } from "sonner";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function SignIn() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const btnContainerRef = useRef(null);
  const initializedRef = useRef(false);

  // Handle the ID token returned by Google — MUST be before any early return
  const handleCredential = useCallback(
    async (response) => {
      try {
        const { data } = await api.post("/auth/google", { id_token: response.credential });
        setUser(data.user);
        if (data.user && !data.user.onboarded) {
          window.location.href = "/onboarding";
        } else {
          window.location.href = "/dashboard";
        }
      } catch (e) {
        const detail = e?.response?.data?.detail || "Sign-in failed. Please try again.";
        toast.error(detail);
        console.error("Google sign-in error:", e?.response?.data || e);
      }
    },
    [setUser]
  );

  // Render Google's official Sign In button — MUST be before any early return
  useEffect(() => {
    const tryInit = () => {
      if (!window.google?.accounts?.id || !btnContainerRef.current) return false;
      if (initializedRef.current) return true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(btnContainerRef.current, {
        theme: "filled_blue",
        size: "large",
        width: btnContainerRef.current.offsetWidth || 380,
        text: "continue_with",
        shape: "pill",
        logo_alignment: "left",
      });

      initializedRef.current = true;
      return true;
    };

    if (!tryInit()) {
      const interval = setInterval(() => {
        if (tryInit()) clearInterval(interval);
      }, 200);
      const timeout = setTimeout(() => clearInterval(interval), 8000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  }, [handleCredential]);

  // Early return AFTER all hooks
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4" data-testid="signin-page">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-muted2 hover:text-ink text-sm"
          data-testid="signin-back-button"
        >
          <ArrowLeft size={18} /> Back to home
        </button>

        <div className="bg-white rounded-3xl border border-line shadow-soft p-8 text-center">
          <div className="flex justify-center mb-3">
            <Logo size={44} />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-ink mt-4">Welcome back</h1>
          <p className="text-sm text-muted2 mt-2">Sign in to access your personalized roadmap</p>

          {/* Google renders its official button here */}
          <div className="mt-7 flex justify-center" ref={btnContainerRef} data-testid="signin-google-button">
            {/* Loading placeholder */}
            <div className="w-full h-11 rounded-full bg-brand-100 animate-pulse" />
          </div>

          <p className="text-xs text-muted2 mt-6 leading-relaxed">
            By continuing you agree to LATE COMERS AI's Terms &amp; Privacy. We never share your data.
          </p>
        </div>
      </div>
    </div>
  );
}
