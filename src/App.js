import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "718570f7d6be9193980b58759798106e";

  async function fetchWeatherByCoords(lat, lon) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Weather not found");
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherByCityName(cityName) {
    if (!cityName) return;
    setError("");
    setLoading(true);
    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          cityName
        )}&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error("City not found");
      const geo = await geoRes.json();
      if (!geo || geo.length === 0) throw new Error("City not found");

      const { lat, lon } = geo[0];
      await fetchWeatherByCoords(lat, lon);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className={`app ${weatherData ? `theme-${weatherData.weather[0].main.toLowerCase()}` : ""}`}>
      <div className="container">
        <h1 className="brand">J Weather</h1>

        <SearchBar
          onSearch={(city) => fetchWeatherByCityName(city)}
          onSelectSuggestion={(lat, lon) => fetchWeatherByCoords(lat, lon)}
        />

        {loading && <p className="info">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {weatherData && <WeatherCard weather={weatherData} />}
        {!weatherData && !loading && !error && (
          <p className="hint">Type a city name and press Enter or choose a suggestion.</p>
        )}
      </div>
    </div>
  );
}
