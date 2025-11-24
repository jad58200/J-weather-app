import React from "react";

function localTimeString(timezoneSeconds) {
  const now = Date.now();
  const utc = now + new Date().getTimezoneOffset() * 60000;
  const local = new Date(utc + timezoneSeconds * 1000);
  return local.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function healthTip(weather) {
  const main = weather.weather[0].main.toLowerCase();
  const desc = weather.weather[0].description.toLowerCase();
  const temp = weather.main.temp; 
  if (main.includes("smoke") || desc.includes("smoke") || desc.includes("haze")) {
    return "Air quality might be poor — stay indoors if you have respiratory issues.";
  }
  if (main.includes("snow") || temp <= 0) {
    return "It's freezing outside — dress warmly and avoid long exposure.";
  }
  if (main.includes("rain") || main.includes("drizzle")) {
    return "Carry an umbrella and be careful with slippery roads.";
  }
  if (main.includes("thunderstorm")) {
    return "Thunderstorms are dangerous — avoid open areas and unplug electronics.";
  }
  if (main.includes("clear") && temp >= 30) {
    return "Hot and sunny — wear sunscreen and stay hydrated.";
  }
  if (temp < 10) {
    return "Chilly weather — wear a jacket and limit outdoor time if you're ill.";
  }
  return "Weather looks okay. If you feel unwell, limit outdoor activities and rest.";
}

export default function WeatherCard({ weather }) {
  const icon = weather.weather[0].icon;
  const temp = Math.round(weather.main.temp);
  const desc = weather.weather[0].description;
  const localTime = localTimeString(weather.timezone);

  return (
    <div className="weather-card">
      <div className="wc-top">
        <div className="location">
          <h2>{weather.name}{weather.sys.country ? `, ${weather.sys.country}` : ""}</h2>
          <div className="local-time">🕒 {localTime}</div>
        </div>

        <div className="main-info">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
            alt={desc}
            className="big-icon"
          />
          <div className="temp-block">
            <div className="temp">{temp}°C</div>
            <div className="desc">{desc}</div>
          </div>
        </div>
      </div>

      <div className="wc-grid">
        <div className="grid-item">
          <span className="g-title">Humidity</span>
          <span className="g-value">{weather.main.humidity}%</span>
        </div>
        <div className="grid-item">
          <span className="g-title">Wind</span>
          <span className="g-value">{weather.wind.speed} m/s</span>
        </div>
        <div className="grid-item">
          <span className="g-title">Pressure</span>
          <span className="g-value">{weather.main.pressure} hPa</span>
        </div>
        <div className="grid-item">
          <span className="g-title">Visibility</span>
          <span className="g-value">{(weather.visibility / 1000) || 0} km</span>
        </div>
      </div>

      <div className="tip">
        <strong>💡 Tip:</strong> {healthTip(weather)}
      </div>
    </div>
  );
}
