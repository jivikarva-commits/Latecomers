import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../lib/api";

const VISITOR_KEY = "lc_visitor_id";

function visitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    const random = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    id = `visitor_${random}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search || ""}`;
    api.post("/track/visit", {
      visitorId: visitorId(),
      path,
      referrer: document.referrer || "",
    }).catch(() => {});
  }, [location.pathname, location.search]);

  return null;
}
