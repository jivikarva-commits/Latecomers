import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Map, Search, User, Bot } from "lucide-react";

export default function BottomTabBar() {
  const tabs = [
    { to: "/dashboard", label: "Home", icon: Home, id: "tab-home" },
    { to: "/roadmap", label: "Roadmap", icon: Map, id: "tab-roadmap" },
    { to: "/ai-chat", label: "AI Chat", icon: Bot, id: "tab-ai-chat", center: true },
    { to: "/careers", label: "Explore", icon: Search, id: "tab-explore" },
    { to: "/profile", label: "Profile", icon: User, id: "tab-profile" },
  ];
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-line h-16 flex items-center justify-around px-2"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      data-testid="bottom-tab-bar"
    >
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          data-testid={t.id}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full ${
              t.center ? "" : isActive ? "text-brand" : "text-muted2"
            }`
          }
        >
          {({ isActive }) =>
            t.center ? (
              <div
                className={`relative -mt-5 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition ${
                  isActive
                    ? "bg-gradient-to-br from-brand to-pink-500 text-white shadow-[0_12px_26px_rgba(124,44,242,0.24)]"
                    : "bg-brand-100 text-brand shadow-[0_8px_20px_rgba(124,44,242,0.14)]"
                }`}
              >
                <t.icon size={21} />
              </div>
            ) : (
              <>
                <t.icon size={22} className={isActive ? "text-brand" : "text-muted2"} />
                <span className={`text-[11px] mt-0.5 font-medium ${isActive ? "text-brand" : "text-muted2"}`}>
                  {t.label}
                </span>
              </>
            )
          }
        </NavLink>
      ))}
    </nav>
  );
}
