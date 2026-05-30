import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Map, Briefcase, Building2, GraduationCap, Mic, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../Logo";

const sections = [
  {
    label: "Main",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: Home, id: "nav-dashboard" },
      { to: "/roadmap", label: "Roadmap", icon: Map, id: "nav-roadmap" },
      { to: "/careers", label: "Careers", icon: Briefcase, id: "nav-careers" },
    ],
  },
  {
    label: "Explore",
    items: [
      { to: "/colleges", label: "Institutes", icon: Building2, id: "nav-colleges" },
      { to: "/scholarships", label: "Scholarships", icon: GraduationCap, id: "nav-scholarships" },
    ],
  },
  {
    label: "Practice",
    items: [
      { to: "/mock-interview", label: "Mock Interview", icon: Mic, id: "nav-mock-interview" },
      { to: "/ai-chat", label: "AI Chat", icon: MessageCircle, id: "nav-ai-chat" },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = React.useState(false);

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col gap-2 p-5 border-r border-line bg-white sticky top-0 h-screen">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-left mb-4"
        data-testid="sidebar-logo-button"
      >
        <Logo />
      </button>

      <nav className="flex-1 flex flex-col gap-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted2/70">
              {section.label}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  data-testid={it.id}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[15px] transition-colors ${
                      isActive ? "bg-brand text-white" : "text-muted2 hover:bg-brand-50 hover:text-brand"
                    }`
                  }
                >
                  <it.icon size={18} />
                  <span>{it.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line pt-3 mt-3">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-2xl border border-line bg-white"
          data-testid="sidebar-profile-link"
        >
          {user?.picture && !avatarError ? (
            <img
              src={user.picture}
              alt=""
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-pink-500 text-white flex items-center justify-center font-semibold">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
            <p className="text-xs text-muted2 truncate">{user?.email}</p>
          </div>
        </NavLink>
        <button
          onClick={logout}
          className="mt-2 w-full flex items-center gap-2 px-4 py-2 text-sm text-muted2 hover:text-brand"
          data-testid="sidebar-logout-button"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
