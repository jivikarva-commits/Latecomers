import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  { to: "/contact", label: "Contact" },
];

export function PublicNav() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const start = () => navigate(isAuthenticated ? "/dashboard" : "/signin");

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-brand-50/90 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" aria-label="Latecomers home">
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-muted2">
          {navItems.map((item) =>
            item.anchor ? (
              <a key={item.label} href={item.to} className="hover:text-ink">
                {item.label}
              </a>
            ) : (
              <Link key={item.to} to={item.to} className="hover:text-ink">
                {item.label}
              </Link>
            )
          )}
        </nav>
        <button
          onClick={start}
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-brand transition whitespace-nowrap"
        >
          Explore Careers <ArrowRight size={15} />
        </button>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-6 md:grid-cols-[1.2fr_2fr]">
        <Logo showTagline />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Link to="/about" className="text-muted2 hover:text-ink">About</Link>
          <Link to="/careers-explore" className="text-muted2 hover:text-ink">Careers</Link>
          <Link to="/pricing" className="text-muted2 hover:text-ink">Pricing</Link>
          <Link to="/for-institutes" className="text-muted2 hover:text-ink">For Institutes</Link>
          <Link to="/blog" className="text-muted2 hover:text-ink">Blog</Link>
          <Link to="/contact" className="text-muted2 hover:text-ink">Contact</Link>
          <Link to="/signin" className="text-muted2 hover:text-ink">Sign In</Link>
          <Link to="/dashboard" className="text-muted2 hover:text-ink">Dashboard</Link>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted2">
        © 2026 Latecomers. Late But not Lost.
      </div>
    </footer>
  );
}

export default function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-brand-50 font-body overflow-x-hidden">
      <PublicNav />
      {children}
      <PublicFooter />
    </div>
  );
}
