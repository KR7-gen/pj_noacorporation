"use client"

export function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="rounded-full border-2 border-white w-12 h-12 flex items-center justify-center hover:bg-white hover:text-[#333] transition-colors"
      aria-label="トップへ戻る"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
    </button>
  );
} 