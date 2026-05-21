import React, { useMemo, useState } from "react";
import { Bell, Sparkles, Bookmark, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const notifications = useMemo(() => {
    const match = user?.top_career_matches?.[0];
    const savedCount =
      (user?.saved_items?.careers?.length || 0) +
      (user?.saved_items?.colleges?.length || 0) +
      (user?.saved_items?.scholarships?.length || 0);
    return [
      match
        ? {
            id: "match",
            icon: Sparkles,
            title: "New top career insight",
            desc: `${match.careerSlug?.replace(/-/g, " ")} is a ${match.matchPercent}% fit.`,
            to: `/careers/${match.careerSlug}`,
          }
        : null,
      {
        id: "saved",
        icon: Bookmark,
        title: "Saved items reminder",
        desc: `${savedCount} saved items are ready to review.`,
        to: "/profile",
      },
      {
        id: "chat",
        icon: MessageSquare,
        title: "Ask AI follow-up",
        desc: "Get a focused 30-day action plan for your target role.",
        to: "/ai-chat",
      },
    ].filter(Boolean);
  }, [user]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full bg-white border border-line"
        data-testid="notification-bell"
      >
        <Bell size={16} className="text-ink" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>

      {open && (
        <>
          <button
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
            aria-label="Close notifications"
          />
          <div className="absolute right-0 mt-2 w-[320px] max-w-[calc(100vw-2rem)] bg-white border border-line rounded-2xl shadow-xl z-40 overflow-hidden">
            <div className="px-4 py-3 border-b border-line">
              <p className="font-heading font-bold text-sm text-ink">Notifications</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 border-b border-line last:border-b-0 hover:bg-brand-50 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0">
                    <item.icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">{item.title}</p>
                    <p className="text-[11px] text-muted2 mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
