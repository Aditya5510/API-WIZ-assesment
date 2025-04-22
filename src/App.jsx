import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDarkMode } from "./hooks/useDarkMode";
import MoodEntryCard from "./components/MoodEntryCard";
import AllNotes from "./pages/AllNotes";

function App() {
  const [dark, setDark] = useDarkMode();

  return (
    <Router>
      <div
        className={`min-h-screen transition-colors duration-500 ease-in-out
          ${
            dark
              ? "from-emerald-950 via-teal-900 to-slate-900 text-emerald-50"
              : "from-emerald-50 via-teal-50 to-lime-100 text-emerald-900"
          } bg-gradient-to-br`}
      >
        <nav className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl">🌿</span>
            <span className="text-2xl font-serif tracking-wide font-bold group-hover:text-emerald-500 transition-colors duration-300">
              MoodMate
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/notes"
              className={`text-base font-medium relative overflow-hidden group
                ${dark ? "hover:text-emerald-300" : "hover:text-emerald-700"}
              `}
            >
              All Notes
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>

            <button
              onClick={() => setDark((d) => !d)}
              className={`p-2 rounded-full transform hover:scale-110 transition-all duration-300
                ${
                  dark
                    ? "bg-slate-800 text-yellow-300 shadow-inner shadow-slate-700"
                    : "bg-amber-100 text-amber-600 shadow-md shadow-amber-200"
                }`}
              aria-label="Toggle dark mode"
            >
              {dark ? "🌙" : "☀️"}
            </button>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<MoodEntryCard />} />
            <Route path="/notes" element={<AllNotes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
