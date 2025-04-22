import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { moods, moodMap } from "../data/moodMap";

export default function MoodTrendChart({ entries }) {
  const today = new Date();
  const last7Dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const counts = moods.reduce((acc, m) => {
    acc[m] = last7Dates.map((dateObj) => ({ dateObj, count: 0 }));
    return acc;
  }, {});

  entries.forEach((e) => {
    const entryDate = new Date(e.date).setHours(0, 0, 0, 0);
    last7Dates.forEach((dateObj, idx) => {
      if (dateObj.setHours(0, 0, 0, 0) === entryDate) {
        counts[e.mood][idx].count++;
      }
    });
  });

  const data = last7Dates.map((dateObj, idx) => {
    const label = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const obj = { label };
    moods.forEach((m) => {
      obj[m] = counts[m][idx]?.count || 0;
    });
    return obj;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-emerald-100 dark:border-emerald-800">
          <p className="font-medium mb-2">{label}</p>
          {payload.map(
            (entry, index) =>
              entry.value > 0 && (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <span className="text-lg">
                    {moodMap[entry.name]?.icon || "😊"}
                  </span>
                  <span className="font-medium" style={{ color: entry.color }}>
                    {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}:
                  </span>
                  <span>{entry.value}</span>
                </div>
              )
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-48 md:h-72 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-800">
      <h3 className="text-xl font-serif font-medium mb-4">Your Mood Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis
            allowDecimals={false}
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {moods.map((m) => (
            <Bar
              key={m}
              dataKey={m}
              stackId="a"
              fill={moodMap[m].color.replace("bg-", "").replace("-300", "")}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
