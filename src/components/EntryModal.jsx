import React, { useState } from "react";
import { deleteEntry, updateEntry } from "../utils/storage";
import { moodMap } from "../data/moodMap";

export default function EntryModal({ entry, index, onClose, onDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(entry.note || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Date unavailable";
      }

      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return "Date unavailable";
    }
  };

  const formattedDate = formatDate(entry.date);
  const { icon, color } = moodMap[entry.mood] || {};

  function handleDelete() {
    if (isDeleting) {
      setIsDeleting(false);
      deleteEntry(index);
      onDeleted();
      onClose();
    } else {
      setIsDeleting(true);
    }
  }

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      const updatedEntry = { ...entry, note };
      updateEntry(index, updatedEntry);
      setIsSaving(false);
      setIsEditing(false);
      onDeleted();
    }, 500);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`
          relative max-w-2xl w-full max-h-[90vh] overflow-y-auto
          ${color} bg-opacity-10
          rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30
          transition-all duration-500
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-slate-700/40 transition-colors duration-300"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{icon}</span>
            <div>
              <h2 className="text-2xl font-serif font-medium capitalize">
                {entry.mood}
              </h2>
              <p className="text-sm opacity-70">{formattedDate}</p>
            </div>
          </div>

          {/* Weather */}
          {entry.weather && (
            <div className="flex items-center gap-2 mt-2 mb-6 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm py-2 px-4 rounded-full inline-flex">
              <img
                src={`https://openweathermap.org/img/wn/${entry.weather.icon}@2x.png`}
                alt={entry.weather.desc}
                className="w-8 h-8"
              />
              <div>
                <span className="font-medium">{entry.weather.temp}°C</span>
                <span className="text-sm ml-2 opacity-70 capitalize">
                  {entry.weather.desc}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 mx-8"></div>

        <div className="p-8 pt-6">
          <h3 className="text-lg font-medium mb-2">Your Note</h3>

          {isEditing ? (
            <div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600 mb-4"
                rows={6}
                placeholder="Write your thoughts here..."
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-white/20 dark:bg-slate-700/20 hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`
                    px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-300
                    flex items-center gap-2
                    ${isSaving ? "opacity-70 cursor-wait" : ""}
                  `}
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm min-h-32 mb-4 whitespace-pre-wrap">
                {entry.note ? (
                  entry.note
                ) : (
                  <em className="opacity-50 italic">
                    No note was added for this entry.
                  </em>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleDelete}
                  className={`
                    px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300
                    ${
                      isDeleting
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-white/20 dark:bg-slate-700/20 hover:bg-white/30 dark:hover:bg-slate-700/30"
                    }
                  `}
                >
                  {isDeleting ? (
                    "Confirm Delete"
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-white/20 dark:bg-slate-700/20 hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors duration-300 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit Note
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute -left-10 -bottom-10 text-8xl opacity-5">
          🌱
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-current to-transparent opacity-10"></div>
      </div>
    </div>
  );
}
