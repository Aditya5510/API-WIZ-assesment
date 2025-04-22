# Mood Journal

A responsive personal mood journal web app built with **React**, **Vite**, and **Tailwind CSS**. Log your daily mood alongside real-time weather data, then browse, filter, and export your entries.

## Features

- **Mood Logging:** Choose from 5 emoji-based moods and add a short note.
- **Weather Integration:** Automatic geolocation and OpenWeatherMap API for current temperature and conditions.
- **Calendar & History:** View a calendar on the homepage; browse all past entries on a dedicated “All Notes” page.
- **Filtering & Export:** Filter entries by mood; export to **CSV** or **PDF**.
- **Mood Trends:** Stacked bar chart showing mood distribution over the last 7 days.
- **Dark Mode:** Toggle between light and dark themes.
- **Detail Modal:** Click any entry to view details or delete it.

## Tech Stack

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Calendar:** react-calendar
- **Charts:** Recharts
- **HTTP:** Axios
- **Export:** jsPDF + autotable

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/mood-journal.git
   cd mood-journal
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment**
   Create a `.env.local` file with:
   ```env
   VITE_API_KEY=your_openweathermap_api_key
   ```
4. **Run the app**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` in your browser.

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — bundle for production
- `npm run preview` — locally preview production build


