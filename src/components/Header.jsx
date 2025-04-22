import React from "react";

export default function Header({ title = "MoodMate" }) {
  return (
    <header className="relative overflow-hidden flex items-center justify-between p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md shadow-lg rounded-xl border border-emerald-100 dark:border-emerald-900">
      <div className="absolute -left-4 -top-4 opacity-5 text-8xl">🌱</div>
      <div className="absolute -right-4 -bottom-4 opacity-5 text-8xl rotate-45">
        🍃
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl">🌿</span>
        <h1 className="text-2xl font-serif font-bold tracking-wide">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-4 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-sm font-medium">
          Mood Journal
        </div>
      </div>
    </header>
  );
}
