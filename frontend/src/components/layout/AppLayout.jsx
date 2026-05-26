import React from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";
import Logo from "../Logo";
import NotificationBell from "../NotificationBell";

function MobileHeader() {
  const { user } = useAuth();
  const [avatarError, setAvatarError] = React.useState(false);
  return (
    <header className="md:hidden sticky top-0 z-30 bg-brand-50/90 backdrop-blur border-b border-line">
      <div className="flex items-center justify-between px-4 h-14">
        <NavLink to="/dashboard"><Logo size={32} /></NavLink>
        <div className="flex items-center gap-2">
          <div data-testid="mobile-bell">
            <NotificationBell />
          </div>
          <NavLink to="/profile">
            {user?.picture && !avatarError ? (
              <img
                src={user.picture}
                alt=""
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                {(user?.name || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const isOnboarding = location.pathname.startsWith("/onboarding");
  const isChat = location.pathname.startsWith("/ai-chat");
  return (
    <div className="bg-brand-50 overflow-x-hidden max-w-[100vw]">
      <div className="flex w-full min-w-0">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-20 md:pb-0 relative overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(560px_260px_at_12%_0%,rgba(11,155,212,0.09),transparent_58%),radial-gradient(500px_240px_at_100%_8%,rgba(6,27,79,0.055),transparent_56%)]" />
          {!isOnboarding && !isChat && <MobileHeader />}
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
      {!isOnboarding && !isChat && <BottomTabBar />}
    </div>
  );
}
