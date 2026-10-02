import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Accordion state that keeps the clicked header pinned on screen.
 *
 * When one section opens and another (above it) collapses, the content above
 * the clicked header shrinks and the page visibly jumps. We remember where the
 * header was before the change and, after layout, scroll by the difference so
 * it stays exactly where the user tapped it.
 *
 * Usage: const [open, toggle] = useAnchoredToggle(0);
 *        <button onClick={(e) => toggle(isOpen ? -1 : idx, e.currentTarget)} />
 */
export default function useAnchoredToggle(initial) {
  const [value, setValue] = useState(initial);
  const anchor = useRef(null);

  useLayoutEffect(() => {
    const pending = anchor.current;
    anchor.current = null;
    if (!pending || !pending.el.isConnected) return;
    const delta = pending.el.getBoundingClientRect().top - pending.top;
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, left: 0, behavior: "instant" });
  }, [value]);

  const toggle = useCallback((next, el) => {
    if (el) anchor.current = { el, top: el.getBoundingClientRect().top };
    setValue(next);
  }, []);

  return [value, toggle, setValue];
}
