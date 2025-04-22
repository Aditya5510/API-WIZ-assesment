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
        min-width: 280px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 1.25rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        font-family: 'Inter', sans-serif;
        border: none;
        overflow: hidden;
      }
      
      .dark .react-calendar {
        background: rgba(30, 41, 59, 0.9);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      }
      
    
      .react-calendar__navigation {
        background: linear-gradient(135deg, #10b981, #059669);
        border-top-left-radius: 1.25rem;
        border-top-right-radius: 1.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        margin-bottom: 0;
      }
      
      .react-calendar__navigation button {
        color: white;
        font-weight: 600;
        min-width: 2.5rem;
        padding: 0.5rem;
        background: transparent;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
      }
      
      .react-calendar__navigation button:enabled:hover,
      .react-calendar__navigation button:enabled:focus {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .react-calendar__navigation button:disabled {
        opacity: 0.5;
      }
      
      .react-calendar__navigation__label {
        font-size: 1.1rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
    
      .react-calendar__month-view__weekdays {
        background: rgba(209, 250, 229, 0.8);
        text-transform: uppercase;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        padding: 0.75rem 0;
        color: #065f46;
        border-bottom: 1px solid rgba(16, 185, 129, 0.2);
      }
      
      .dark .react-calendar__month-view__weekdays {
        background: rgba(20, 83, 45, 0.3);
        color: #34d399;
        border-bottom: 1px solid rgba(16, 185, 129, 0.2);
      }
      
      .react-calendar__month-view__weekdays__weekday {
        padding: 0.5rem;
      }
      
      .react-calendar__month-view__weekdays__weekday abbr {
        text-decoration: none;
      }
      
     
      .react-calendar__month-view__days {
        display: grid !important;
        grid-template-columns: repeat(7, 1fr);
        padding: 0.5rem;
        gap: 0.15rem;
      }
      
     
      .react-calendar__tile {
        aspect-ratio: 1;
        max-width: none !important;
        padding: 0;
        background: none;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 500;
        color: #1f2937;
        transition: all 0.2s ease;
        position: relative;
        margin: 0.15rem;
      }
      
      .dark .react-calendar__tile {
        color: #f3f4f6;
      }
      
      .react-calendar__tile:enabled:hover,
      .react-calendar__tile:enabled:focus {
        background: rgba(16, 185, 129, 0.15);
      }
      
    
      .react-calendar__tile--active {
        background: #10b981 !important;
        color: white !important;
        box-shadow: 0 3px 10px rgba(16, 185, 129, 0.4);
        transform: scale(1.05);
        z-index: 2;
      }
      
      
      .react-calendar__tile--now {
        background: rgba(16, 185, 129, 0.2);
        font-weight: 700;
        position: relative;
      }
      
      .react-calendar__tile--now:before {
        content: '';
        position: absolute;
        bottom: 0.2rem;
        left: 50%;
        transform: translateX(-50%);
        width: 0.35rem;
        height: 0.35rem;
        background: #10b981;
        border-radius: 50%;
      }
      
      .react-calendar__tile--now.react-calendar__tile--active:before {
        background: white;
      }
      
      /* Neighbor Month Days */
      .react-calendar__month-view__days__day--neighboringMonth {
        opacity: 0.4;
      }
      
      /* Responsive Adjustments */
      @media (max-width: 480px) {
        .react-calendar {
          font-size: 0.875rem;
        }
        
        .react-calendar__navigation {
          padding: 0.5rem;
        }
        
        .react-calendar__navigation__label {
          font-size: 0.9rem;
        }
        
        .react-calendar__month-view__weekdays {
          font-size: 0.65rem;
          padding: 0.5rem 0;
        }
        
        .react-calendar__month-view__days {
          padding: 0.3rem;
          gap: 0.1rem;
        }
        
        .react-calendar__tile {
          margin: 0.1rem;
        }
      }
      
      /* Transition Effects */
      .react-calendar,
      .react-calendar * {
        transition: all 0.3s ease;
      }
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

  const bgColor = selectedMood
    ? `${moodMap[selectedMood].color} bg-opacity-20`
    : "bg-white/70 dark:bg-slate-800/50";

  return (
    <div className="w-full mx-0 px-0 mt-4">
      <div
        className={`relative p-4 sm:p-6 lg:p-10 rounded-3xl shadow-lg ${bgColor} backdrop-blur-md border border-white/30 dark:border-slate-700/50 transition-all duration-500`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-serif">{fd(date)}</h2>
          <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-white/40 dark:bg-slate-700/40 py-1 px-3 rounded-full shadow-sm backdrop-blur-md">
            {locError ? (
              <span className="text-sm italic">📍 Location unavailable</span>
            ) : weather ? (
              <>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.desc}
                  className="w-6 h-6"
                />
                <span className="text-sm font-medium">{weather.temp}°C</span>
              </>
            ) : (
              <span className="text-sm">Loading…</span>
            )}
          </div>
        </div>
        <h3 className="text-center text-lg font-medium mb-4">
          How are you feeling today?
        </h3>
        <div
          id="mood-section"
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 p-2"
        >
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMood(m)}
              className={`text-2xl sm:text-3xl md:text-4xl p-2 sm:p-3 rounded-full ${
                selectedMood === m
                  ? "transform scale-125 drop-shadow-xl bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm"
                  : "opacity-70 hover:opacity-100 hover:scale-110"
              } transition-all duration-300`}
            >
              {moodMap[m].icon}
            </button>
          ))}
        </div>
        <div className="relative mb-6">
          <textarea
            rows={3}
            className="w-full p-3 sm:p-4 border border-emerald-200 dark:border-emerald-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-300 resize-none"
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="absolute bottom-2 right-3 text-xs opacity-50">
            {note.length} chars
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 mb-6 rounded-xl text-white font-medium transition-all duration-300 transform ${
            saving
              ? "bg-emerald-500 cursor-wait opacity-80"
              : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30"
          }`}
        >
          {saving ? "Saving…" : showSavedMessage ? "✓ Saved!" : "Save Entry"}
        </button>

        <div className="relative">
          <div className="calendar-container rounded-2xl overflow-hidden shadow-inner">
            <Calendar
              value={date}
              className="w-full"
              tileClassName="calendar-tile"
              showNeighboringMonth={false}
              prevLabel="←"
              nextLabel="→"
              prev2Label="«"
              next2Label="»"
            />
          </div>

          <div className="absolute -right-2 -top-2 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-xl opacity-50 pointer-events-none"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-xl opacity-50 pointer-events-none"></div>
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
