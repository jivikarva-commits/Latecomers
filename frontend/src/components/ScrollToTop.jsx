import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Start every newly opened page at the top. Without this, React Router keeps
 * the previous page's scroll offset, so e.g. a career report opened from deep
 * in the explore list lands half-way down and then jumps as content loads.
 * Only a pathname change counts (filter/search param updates keep position).
 * Back/forward (POP) is left alone so the browser can restore position, and
 * #hash links are left to scroll to their target.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  const latest = useRef({ navType, hash });
  latest.current = { navType, hash };

  useLayoutEffect(() => {
    const { navType: type, hash: currentHash } = latest.current;
    if (type === "POP" || currentHash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
