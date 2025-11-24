import React, { useEffect, useRef, useState } from "react";

export default function SearchBar({ onSearch, onSelectSuggestion }) {
  const API_KEY = "718570f7d6be9193980b58759798106e";
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            query
          )}&limit=6&appid=${API_KEY}`
        );
        if (!res.ok) throw new Error("Failed to fetch suggestions");
        const data = await res.json();
        setSuggestions(data || []);
        setOpen(true);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      setOpen(false);
      if (query.trim()) onSearch(query.trim());
    }
  }

  function handleSelect(s) {
    setQuery(`${s.name}${s.state ? ", " + s.state : ""}, ${s.country}`);
    setOpen(false);
    setSuggestions([]);
    if (onSelectSuggestion) onSelectSuggestion(s.lat, s.lon);
  }

  return (
    <div className="search-wrapper" ref={boxRef}>
      <div className="search-large">
        <input
          className="search-input"
          value={query}
          placeholder="Search city (e.g. Damascus, London)"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && suggestions.length > 0 && setOpen(true)}
        />
        <button
          className="search-btn"
          onClick={() => {
            setOpen(false);
            if (query.trim()) onSearch(query.trim());
          }}
        >
          Search
        </button>
      </div>

      <div className={`suggestions ${open ? "open" : ""}`}>
        {loadingSuggestions && <div className="suggest-item">Searching...</div>}
        {!loadingSuggestions && suggestions.length === 0 && query && (
          <div className="suggest-item disabled">No suggestions</div>
        )}
        {!loadingSuggestions &&
          suggestions.map((s, i) => (
            <button
              key={`${s.lat}-${s.lon}-${i}`}
              className="suggest-item"
              onClick={() => handleSelect(s)}
            >
              <div className="s-left">
                <strong>{s.name}</strong>
                <small>
                  {s.state ? s.state + " • " : ""}
                  {s.country}
                </small>
              </div>
              <div className="s-right">
                <small>Lat: {s.lat.toFixed(2)}, Lon: {s.lon.toFixed(2)}</small>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
