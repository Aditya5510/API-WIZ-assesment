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
      .react-calendar { width:100%; background:rgba(255,255,255,0.9); border-radius:1rem; box-shadow:0 4px 8px rgba(0,0,0,0.1) }
      .react-calendar__navigation { background:#10b981; border-top-left-radius:1rem; border-top-right-radius:1rem }
      .react-calendar__navigation button { color:white; font-weight:600; min-width:2.5rem }
      .react-calendar__navigation button:disabled { opacity:0.5 }
      .react-calendar__navigation button:hover:not(:disabled) { background:rgba(255,255,255,0.2) }
      .react-calendar__month-view__weekdays { background:#d1fae5; text-transform:uppercase; font-size:0.75rem }
      .react-calendar__tile { border-radius:0.5rem; margin:0.15rem; height:2.5rem; line-height:2.5rem }
      .react-calendar__tile:hover { background:rgba(16,185,129,0.2) }
      .react-calendar__tile--active { background:#10b981; color:white }
      .react-calendar__tile--now { background:rgba(16,185,129,0.3); font-weight:600 }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSave = () => {
    if (!selectedMood) {
      const ms = document.getElementById("mood-section");
      ms.classList.add("animate-pulse");
      setTimeout(() => ms.classList.remove("animate-pulse"), 1000);
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

  const fd = (d) => {
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

  const bg = selectedMood
    ? `${moodMap[selectedMood].color} bg-opacity-20`
    : "bg-white/70 dark:bg-slate-800/50";

  return (
    <div className="w-full max-w-full md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div
        className={`relative p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg ${bg} backdrop-blur-md border border-white/30 dark:border-slate-700/50 transition-all duration-500`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif">
            {fd(date)}
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
              <span className="text-sm flex items-center gap-1">Loading…</span>
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
              className={`text-3xl sm:text-4xl p-2 sm:p-3 rounded-full ${
                selectedMood === m
                  ? "transform scale-125 shadow-lg bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm"
                  : "opacity-70 hover:opacity-100 hover:scale-110"
              } transition-all duration-300`}
              title={m.charAt(0).toUpperCase() + m.slice(1)}
            >
              {moodMap[m].icon}
            </button>
          ))}
        </div>
        <div className="relative mb-6">
          <textarea
            rows={3}
            className="w-full p-3 sm:p-4 border border-emerald-100 dark:border-emerald-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 placeholder-emerald-800/40 dark:placeholder-emerald-100/40 resize-none"
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
          className={`w-full py-2 sm:py-3 mb-6 rounded-xl font-medium text-white transition-all duration-300 transform flex items-center justify-center gap-2 ${
            saving
              ? "bg-emerald-500 cursor-wait opacity-80"
              : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
          }`}
        >
          {saving ? "Saving…" : showSavedMessage ? "✓ Saved!" : "Save Entry"}
        </button>
        <div className="mt-6 bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl shadow-inner">
          <Calendar
            value={date}
            className="rounded-lg"
            tileClassName="p-2"
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
