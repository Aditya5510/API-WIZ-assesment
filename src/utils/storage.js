import jsPDF from "jspdf";
import "jspdf-autotable";

const STORAGE_KEY = "moodEntries";

export function saveEntry(entry) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  all.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function exportEntriesAsCSV(entries) {
  if (!entries || entries.length === 0) return;

  const header = ["Date", "Mood", "Note", "Temp (°C)", "Weather"];

  const rows = entries.map((e) => {
    const date = new Date(e.date).toLocaleDateString();
    const mood = e.mood;
    const note = (e.note || "").replace(/"/g, '""');
    const temp = e.weather?.temp ?? "";
    const weather = e.weather?.desc ?? "";
    return [date, mood, `"${note}"`, temp, weather].join(",");
  });

  const csvContent = [header.join(","), ...rows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `mood-journal-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportEntriesAsPDF(entries) {
  if (!entries.length) return;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const header = ["Date", "Mood", "Note", "Temp (°C)", "Weather"];
  const rows = entries.map((e) => [
    new Date(e.date).toLocaleDateString(),
    e.mood,
    e.note || "",
    e.weather?.temp ?? "",
    e.weather?.desc ?? "",
  ]);
  doc.setFontSize(14);
  doc.text("Mood Journal", 40, 40);
  doc.autoTable({
    startY: 60,
    head: [header],
    body: rows,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [240, 240, 240] },
  });
  doc.save(`mood-journal-${Date.now()}.pdf`);
}

export function deleteEntry(index) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  all.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function updateEntry(index, updatedEntry) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (index >= 0 && index < all.length) {
    all[index] = updatedEntry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}
