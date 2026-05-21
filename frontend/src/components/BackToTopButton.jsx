import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 md:bottom-6 right-5 z-30 w-11 h-11 rounded-full bg-brand text-white shadow-brand flex items-center justify-center"
      data-testid="back-to-top"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
