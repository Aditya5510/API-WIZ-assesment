import React, { useEffect, useState } from "react";
import { moods, moodMap } from "../data/moodMap";
import { fetchWeather } from "../utils/weatherApi";
import { saveEntry } from "../utils/storage";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MoodEntryCard() {
  const [date] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [locError, setLocError] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        fetchWeather(coords.latitude, coords.longitude)
          .then(setWeather)
          .catch(() => setLocError(true)),
      () => setLocError(true)
    );

    const style = document.createElement("style");
    style.innerHTML = `
      .react-calendar {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 0.75rem;
        border: 1px solid rgba(16, 185, 129, 0.2);
        font-family: inherit;
        line-height: 1.5;
        overflow: hidden;
      }
      .dark .react-calendar {
        background-color: rgba(30, 41, 59, 0.7);
        border-color: rgba(16, 185, 129, 0.1);
        color: #f3f4f6;
      }
      .react-calendar__navigation {
        background-color: rgba(16, 185, 129, 0.1);
        margin-bottom: 0;
        padding: 0.5rem;
      }
      .dark .react-calendar__navigation {
        background-color: rgba(16, 185, 129, 0.2);
      }
      .react-calendar__navigation button {
        color: #10b981;
        font-weight: 600;
        border-radius: 0.375rem;
        margin: 0 0.25rem;
      }
      .dark .react-calendar__navigation button {
        color: #6ee7b7;
      }
      .react-calendar__navigation button:enabled:hover,
      .react-calendar__navigation button:enabled:focus {
        background-color: rgba(16, 185, 129, 0.15);
      }
      .react-calendar__month-view__weekdays {
        font-weight: 600;
        font-size: 0.85rem;
        padding: 0.5rem 0;
        background-color: rgba(16, 185, 129, 0.05);
      }
      .dark .react-calendar__month-view__weekdays {
        background-color: rgba(16, 185, 129, 0.1);
        color: #d1fae5;
      }
      .react-calendar__month-view__days__day {
        padding: 0.6rem 0;
        font-weight: 500;
      }
      .dark .react-calendar__month-view__days__day {
        color: #f3f4f6;
      }
      .react-calendar__tile--now {
        background-color: rgba(16, 185, 129, 0.15);
        font-weight: 700;
      }
      .dark .react-calendar__tile--now {
        background-color: rgba(16, 185, 129, 0.3);
      }
      .react-calendar__tile--now:enabled:hover,
      .react-calendar__tile--now:enabled:focus {
        background-color: rgba(16, 185, 129, 0.25);
      }
      .react-calendar__tile:enabled:hover,
      .react-calendar__tile:enabled:focus {
        background-color: rgba(16, 185, 129, 0.1);
        border-radius: 0.25rem;
      }
      .react-calendar__tile--active {
        background-color: #10b981;
        color: white;
        border-radius: 0.25rem;
      }
      .react-calendar__tile--active:enabled:hover,
      .react-calendar__tile--active:enabled:focus {
        background-color: #059669;
      }
      .react-calendar__month-view__days__day--weekend {
        color: #ec4899;
      }
      .dark .react-calendar__month-view__days__day--weekend {
        color: #f9a8d4;
      }
      .react-calendar__month-view__days__day--neighboringMonth {
        color: #9ca3af;
      }
      .dark .react-calendar__month-view__days__day--neighboringMonth {
        color: #64748b;
      }
      .react-calendar__tile:disabled {
        background-color: transparent;
        color: rgba(156, 163, 175, 0.6);
      }
      .dark .react-calendar__tile:disabled {
        color: rgba(148, 163, 184, 0.4);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSave = () => {
    if (!selectedMood) {
      const moodSection = document.getElementById("mood-section");
      moodSection.classList.add("animate-pulse");
      setTimeout(() => moodSection.classList.remove("animate-pulse"), 1000);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      saveEntry({
        date: date.toISOString(),
        mood: selectedMood,
        note,
        weather,
      });
      setSaving(false);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
      setNote("");
      setSelectedMood(null);
    }, 600);
  };

  const formatDate = (d) => {
    try {
      if (!d || isNaN(d.getTime())) return "Today";
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      return "Today";
    }
  };

  const bgColor = selectedMood
    ? `${moodMap[selectedMood].color} bg-opacity-20`
    : "bg-white/70 dark:bg-slate-800/50";

  return (
    <div className="w-full sm:max-w-lg md:max-w-xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div
        className={`
          relative p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg
          ${bgColor} backdrop-blur-md border border-white/30 dark:border-slate-700/50
          transition-all duration-500
        `}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif">
            {formatDate(date)}
          </h2>
          <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-white/40 dark:bg-slate-700/40 py-1 px-3 rounded-full shadow-sm backdrop-blur-md">
            {locError ? (
              <span className="text-sm italic">📍 Location unavailable</span>
            ) : weather ? (
              <>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.desc}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-sm sm:text-base font-medium">
                  {weather.temp}°C
                </span>
              </>
            ) : (
              <span className="text-sm flex items-center gap-1">
                <svg
                  className="animate-spin h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading…
              </span>
            )}
          </div>
        </div>

        <h3 className="text-center text-lg sm:text-xl font-medium mb-4">
          How are you feeling today?
        </h3>

        <div
          id="mood-section"
          className="grid grid-cols-5 gap-2 sm:flex sm:justify-around mb-8 p-2"
        >
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMood(m)}
              className={`
                text-3xl sm:text-4xl p-2 sm:p-3 rounded-full
                ${
                  selectedMood === m
                    ? "transform scale-125 shadow-lg bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm"
                    : "opacity-70 hover:opacity-100 hover:scale-110"
                }
                transition-all duration-300
              `}
              title={m.charAt(0).toUpperCase() + m.slice(1)}
            >
              {moodMap[m].icon}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <textarea
            rows={3}
            className="
              w-full p-3 sm:p-4 border border-emerald-100 dark:border-emerald-800/30
              rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600
              bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm
              transition-all duration-300 placeholder-emerald-800/40 dark:placeholder-emerald-100/40
              resize-none
            "
            placeholder="Add a note about how you're feeling..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="absolute bottom-2 right-3 text-xs opacity-50 font-medium">
            {note.length} chars
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            w-full py-2 sm:py-3 mb-6 rounded-xl font-medium text-white
            transition-all duration-300 transform flex items-center justify-center gap-2
            ${
              saving
                ? "bg-emerald-500 cursor-wait opacity-80"
                : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
            }
          `}
        >
          {saving ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : showSavedMessage ? (
            "✓ Saved!"
          ) : (
            "Save Entry"
          )}
        </button>

        <div className="custom-calendar-wrapper">
          <Calendar
            value={date}
            className="
              w-full rounded-xl overflow-hidden shadow-md
              border border-emerald-100 dark:border-emerald-800/30
            "
            tileClassName="hover:bg-emerald-100 dark:hover:bg-emerald-800/20"
            showNeighboringMonth={false}
          />
        </div>

        <div className="hidden lg:block absolute -right-10 -bottom-10 text-8xl opacity-5 rotate-12">
          🌿
        </div>
      </div>
      <p className="text-center mt-4 text-sm opacity-60">
        Your mood entries are stored locally on your device
      </p>
    </div>
  );
}
