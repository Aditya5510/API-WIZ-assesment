import React, { useEffect, useState } from "react";
import {
  loadEntries,
  exportEntriesAsCSV,
  exportEntriesAsPDF,
} from "../utils/storage";
import MoodLogCard from "../components/MoodLogCard";
import MoodTrendChart from "../components/MoodTrendCharts";
import EntryModal from "../components/EntryModal";
import { moods, moodMap } from "../data/moodMap";

export default function AllNotes() {
  const [entries, setEntries] = useState([]);
  const [filterMood, setFilterMood] = useState("all");
  const [modalInfo, setModalInfo] = useState(null);

  useEffect(() => {
    setEntries(loadEntries().reverse());
  }, []);

  function refreshEntries() {
    setEntries(loadEntries().reverse());
  }

  const filtered =
    filterMood === "all"
      ? entries
      : entries.filter((e) => e.mood === filterMood);

  return (
    <div className="space-y-8">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-serif font-semibold">
            Your Mood Journal
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="px-4 py-2 border-2 border-emerald-200 rounded-lg bg-white/80 dark:bg-emerald-900/30 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            >
              <option value="all">All moods</option>
              {moods.map((m) => (
                <option key={m} value={m}>
                  {moodMap[m].icon} {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>

            {filtered.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportEntriesAsCSV(filtered)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                >
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => exportEntriesAsPDF(filtered)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                >
                  <span>Export PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <MoodTrendChart entries={entries} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center p-12 bg-white/10 backdrop-blur-md rounded-xl">
          <div className="text-6xl mb-4">🍃</div>
          <p className="text-xl font-medium">No entries found</p>
          <p className="text-sm opacity-70 mt-2">
            Try adjusting your filter or add a new mood entry
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry, idx) => (
            <div
              key={idx}
              onClick={() =>
                setModalInfo({ entry, index: entries.length - 1 - idx })
              }
              className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl cursor-pointer"
            >
              <MoodLogCard entry={entry} />
            </div>
          ))}
        </div>
      )}

      {modalInfo && (
        <EntryModal
          entry={modalInfo.entry}
          index={modalInfo.index}
          onClose={() => setModalInfo(null)}
          onDeleted={refreshEntries}
        />
      )}
    </div>
  );
}
