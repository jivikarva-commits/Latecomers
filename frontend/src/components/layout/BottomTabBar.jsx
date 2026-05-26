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
                className={`relative -mt-7 w-14 h-14 rounded-full flex items-center justify-center shadow-brand border-4 border-brand-50 ${
                  isActive ? "bg-brand" : "bg-brand-800"
                } text-white`}
              >
                <t.icon size={24} />
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
