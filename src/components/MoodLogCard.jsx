import React from "react";
import { moodMap } from "../data/moodMap";

export default function MoodLogCard({ entry }) {
  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "Date unavailable";
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(d);
    } catch {
      return "Date unavailable";
    }
  };

  const formattedDate = formatDate(entry.date);
  const { icon, color } = moodMap[entry.mood] || {};

  return (
    <div
      className={`
        relative
        p-4 sm:p-6 md:p-8
        rounded-3xl
        bg-white/80 dark:bg-slate-800/80
        backdrop-blur-sm
        border border-gray-200 dark:border-slate-700
        shadow-lg
        transition-transform duration-300
        hover:scale-105 hover:shadow-2xl
      `}
    >
      <div className="hidden lg:block absolute -top-6 -right-6 text-7xl opacity-10 rotate-45">
        🍃
      </div>

      <div
        className={`
          absolute -top-4 left-4
          bg-white dark:bg-slate-800/70
          border-2 border-white/50 dark:border-slate-700/50
          p-2 sm:p-3
          rounded-full
          shadow-md
        `}
      >
        <span className="text-2xl sm:text-3xl">{icon}</span>
      </div>

      <div className="mt-8 mb-2">
        <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
          {formattedDate}
        </span>
      </div>

      <div className="relative mb-4">
        <p className="text-sm sm:text-base line-clamp-3 pr-2 sm:pr-4">
          {entry.note || (
            <em className="italic text-gray-500 dark:text-gray-400">
              No note added.
            </em>
          )}
        </p>
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-6
            pointer-events-none
            bg-gradient-to-t from-current via-transparent
            ${color.replace("bg-", "").replace("-300", "")}
            opacity-20
          `}
        />
      </div>

      {entry.weather && (
        <div
          className="
            absolute bottom-4 right-4
            flex items-center gap-1
            bg-white/60 dark:bg-slate-800/60
            backdrop-blur-sm
            py-1 px-3
            rounded-full
            shadow-sm
            text-xs sm:text-sm
          "
        >
          <img
            src={`https://openweathermap.org/img/wn/${entry.weather.icon}@2x.png`}
            alt={entry.weather.desc}
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {entry.weather.temp}°C
          </span>
        </div>
      )}

      <div className="absolute bottom-4 left-4 text-xs text-gray-600 dark:text-gray-400">
        Tap to view details
      </div>
    </div>
  );
}
