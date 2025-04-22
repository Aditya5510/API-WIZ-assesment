import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STORAGE_KEY = "moodEntries";

export function saveEntry(e) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  all.push(e);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function exportEntriesAsCSV(entries) {
  if (!entries.length) return;
  const header = ["Date", "Mood", "Note", "Temp", "Weather"];
  const rows = entries.map((e) => [
    new Date(e.date).toLocaleDateString(),
    e.mood,
    e.note || "",
    e.weather?.temp ?? "",
    e.weather?.desc ?? "",
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\r\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mood-journal-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportEntriesAsPDF(entries) {
  if (!entries.length) return;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  doc.setFontSize(16);
  doc.text("Mood Journal", 40, 40);
  const head = [["Date", "Mood", "Note", "Temp (°C)", "Weather"]];
  const body = entries.map((e) => [
    new Date(e.date).toLocaleDateString(),
    e.mood,
    e.note || "",
    e.weather?.temp ?? "",
    e.weather?.desc ?? "",
  ]);
  autoTable(doc, {
    startY: 60,
    head,
    body,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [16, 185, 129] },
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
