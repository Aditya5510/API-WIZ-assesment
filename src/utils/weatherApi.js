import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

console.log(API_KEY);

export async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather`;
  const { data } = await axios.get(url, {
    params: { lat, lon, units: "metric", appid: API_KEY },
  });
  return {
    temp: Math.round(data.main.temp),
    icon: data.weather[0].icon,
    desc: data.weather[0].main,
  };
}
