import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { CAREER_CATEGORIES } from "../data/careerCategories";

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

function roleHref(role) {
  return `/careers-explore?search=${encodeURIComponent(role)}`;
}

function CategoryNav() {
  const [openKey, setOpenKey] = useState(null);
  const containerRef = useRef(null);
  const location = useLocation();
  const closeTimer = useRef(null);

  // Close on route change
  useEffect(() => {
    setOpenKey(null);
  }, [location.pathname, location.search]);

  // Close on ESC + outside click
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenKey(null);
    };
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenKey(null);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const activeCategory = CAREER_CATEGORIES.find((c) => c.key === openKey);
  const subColCount = activeCategory ? Math.min(activeCategory.subsections.length, 4) : 0;
  const gridCols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[subColCount] || "grid-cols-4";

  return (
    <div ref={containerRef} className="border-t border-brand-900/40 bg-brand-900">
      {/* Desktop */}
      <div className="hidden lg:block relative">
        <div className="mx-auto w-full max-w-[1440px] px-2 xl:px-6">
          <div className="flex w-full items-center justify-between gap-0.5 py-2" onMouseLeave={scheduleClose}>
            {CAREER_CATEGORIES.map((cat) => {
              const isOpen = openKey === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`mega-${cat.key}`}
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenKey(cat.key);
                  }}
                  onClick={() => setOpenKey(isOpen ? null : cat.key)}
                  className={`inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full px-1.5 py-1.5 text-[9.5px] font-bold uppercase leading-none tracking-normal transition xl:gap-1 xl:px-2.5 xl:text-[11px] ${
                    isOpen ? "bg-yellow-300 text-brand-900" : "text-white hover:text-yellow-300 hover:bg-white/10"
                  }`}
                >
                  {cat.label}
                  <ChevronDown size={13} className={`transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
              );
            })}
          </div>
        </div>

        {activeCategory && (
          <div
            id={`mega-${activeCategory.key}`}
            className="absolute left-0 right-0 top-full z-30 px-4 lg:px-8"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="max-w-7xl mx-auto mt-1">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-2xl">
                <div className={`grid gap-5 ${gridCols}`}>
                  {activeCategory.subsections.map((sub) => (
                    <div key={sub.title} className="min-w-0">
                      <p className="font-heading text-[12px] font-black text-ink mb-2.5 pb-2 border-b border-line">
                        {sub.title}
                      </p>
                      <ul className="space-y-1.5">
                        {sub.roles.map((role) => (
                          <li key={role}>
                            <Link
                              to={roleHref(role)}
                              className="block text-[12px] text-muted2 hover:text-brand transition truncate"
                              onClick={() => setOpenKey(null)}
                            >
                              {role}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: horizontal scroll chips → direct to careers-explore filtered */}
      <nav className="lg:hidden px-3 py-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {CAREER_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              to={`/careers-explore?field=${cat.key}`}
              className="px-2.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10.5px] font-bold uppercase tracking-wide text-white whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function PublicNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const start = () => navigate(isAuthenticated ? "/dashboard" : "/signin");

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/92 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[52px] sm:h-[76px] flex items-center justify-between gap-2 sm:gap-3">
        <Link to="/" aria-label="Latecomers AI home" className="shrink-0 flex items-center">
          <span className="sm:hidden">
            <Logo size={42} compact />
          </span>
          <span className="hidden sm:block">
            <Logo size={50} compact />
          </span>
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
                  location.pathname === item.to ? "text-brand" : "hover:text-brand hover:bg-brand-50"
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
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand hover:from-brand-700 hover:to-pink-500 text-white font-bold text-[11px] sm:text-sm px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg transition whitespace-nowrap"
          >
            <span className="hidden min-[390px]:inline">Start Quiz</span>
            <span className="min-[390px]:hidden">Quiz</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <nav className="lg:hidden px-3 pb-2.5 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {navItems.map((item) =>
            item.anchor ? (
              <a key={item.label} href={item.to} className="px-2.5 py-1.5 rounded-full bg-white border border-line text-[11px] font-semibold text-muted2">
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`px-2.5 py-1.5 rounded-full border text-[11px] font-semibold ${
                  location.pathname === item.to ? "bg-brand text-white border-transparent" : "bg-white border-line text-muted2"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>

      <CategoryNav />
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
      <main id="main-content">{children}</main>
      <PublicFooter />
    </div>
  );
}
