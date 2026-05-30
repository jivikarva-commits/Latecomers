import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/#how", label: "How it works", anchor: true },
  { to: "/careers-explore", label: "Careers" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/for-institutes", label: "For Institutes" },
  { to: "/contact", label: "Contact" },
];

export function PublicNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const start = () => navigate(isAuthenticated ? "/dashboard" : "/signin");

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/92 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[58px] sm:h-[76px] flex items-center justify-between gap-2 sm:gap-3">
        <Link to="/" aria-label="Latecomers AI home" className="shrink-0 flex items-center">
          <Logo size={50} compact />
        </Link>

        <nav className="hidden lg:flex items-center gap-2 text-sm font-bold text-ink">
          {navItems.map((item) =>
            item.anchor ? (
              <a key={item.label} href={item.to} className="px-3.5 py-2 rounded-full hover:text-brand hover:bg-brand-50 transition">
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-full transition ${
                  location.pathname === item.to ? "bg-brand text-white" : "hover:text-brand hover:bg-brand-50"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={start}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand hover:from-brand-700 hover:to-pink-500 text-white font-bold text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg transition whitespace-nowrap"
          >
            <span className="hidden min-[390px]:inline">Start Quiz</span>
            <span className="min-[390px]:hidden">Quiz</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <nav className="lg:hidden px-3 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {navItems.map((item) =>
            item.anchor ? (
              <a key={item.label} href={item.to} className="px-3 py-1.5 rounded-full bg-white border border-line text-xs font-semibold text-muted2">
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                  location.pathname === item.to ? "bg-brand text-white border-transparent" : "bg-white border-line text-muted2"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-6 md:grid-cols-[1.2fr_2fr]">
        <Logo size={48} showTagline />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Link to="/about" className="text-muted2 hover:text-ink">About</Link>
          <Link to="/careers-explore" className="text-muted2 hover:text-ink">Careers</Link>
          <Link to="/pricing" className="text-muted2 hover:text-ink">Pricing</Link>
          <Link to="/for-institutes" className="text-muted2 hover:text-ink">For Institutes</Link>
          <Link to="/blog" className="text-muted2 hover:text-ink">Blog</Link>
          <Link to="/contact" className="text-muted2 hover:text-ink">Contact</Link>
          <Link to="/signin" className="text-muted2 hover:text-ink">Sign In</Link>
          <Link to="/pricing" className="text-muted2 hover:text-ink">Start Quiz</Link>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted2">
        © 2026 Latecomers AI. Late but not lost.
      </div>
    </footer>
  );
}

export default function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-brand-50 font-body overflow-x-hidden scroll-smooth">
      <PublicNav />
      {children}
      <PublicFooter />
    </div>
  );
}
