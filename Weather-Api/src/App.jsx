import { useEffect, useRef, useState } from "react";
import { fetchWeatherWindow, locateUser } from "./weather.js";
import Rail from "./components/Rail.jsx";
import StatusLine from "./components/StatusLine.jsx";
import Hero from "./components/Hero.jsx";
import TraceChart from "./components/TraceChart.jsx";

export default function App() {
  // "useState" gives us a piece of memory the app can look at AND change.
  // Every time we call the "setter" (e.g. setWeather), React redraws the
  // screen using the new value automatically
  const [inputValue, setInputValue] = useState("");
  const [weather, setWeather] = useState(null); // null = nothing loaded yet
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState(undefined);

  // "lastLocation" doesn't need to redraw the screen when it changes, so it
  // doesn't need to be state — a plain useRef box is enough. It just needs
  // to be remembered between renders so the Refresh button knows what to re-fetch.
  const lastLocationRef = useRef(null);

  async function loadWeather(location, label) {
    setBusy(true);
    setStatus(label ? `Reading ${label}…` : "Reading…");
    setStatusTone(undefined);
    try {
      const data = await fetchWeatherWindow(location);
      lastLocationRef.current = location;
      setWeather(data);
      setStatus(
        `Last read ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
      );
      setStatusTone("ok");
    } catch (err) {
      setStatus(err.message || "Something went wrong.");
      setStatusTone("error");
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const value = inputValue.trim();
    if (!value) return;
    loadWeather(value, value);
  }

  async function handleLocate() {
    setBusy(true);
    setStatus("Finding your location…");
    setStatusTone(undefined);
    try {
      const coords = await locateUser();
      setInputValue("");
      await loadWeather(coords, "your location");
    } catch (err) {
      setStatus(err.message || "Could not get your location.");
      setStatusTone("error");
      setBusy(false);
    }
  }

  function handleRefresh() {
    if (!lastLocationRef.current) return;
    loadWeather(lastLocationRef.current, "again");
  }

  // "useEffect" with an empty [] means "run this once, right after the app
  // first appears on screen" — this replaces the old `init()` function that
  // ran automatically at the bottom of main.js.
  useEffect(() => {
    (async () => {
      setStatus("Finding your location…");
      try {
        const coords = await locateUser();
        await loadWeather(coords, "your location");
      } catch {
        setStatus(
          "Enter a location to get a reading, or allow location access.",
        );
      }
    })();
  }, []);

  return (
    <div className="station">
      <Rail
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        onLocate={handleLocate}
        onRefresh={handleRefresh}
        busy={busy}
      />

      <StatusLine message={status} tone={statusTone} />

      {weather && (
        <main className="readout">
          <Hero
            resolvedAddress={weather.resolvedAddress}
            timezone={weather.timezone}
            current={weather.current}
            busy={busy}
          />
          <TraceChart
            hours={weather.hours}
            nowEpoch={weather.current.epoch}
            timezone={weather.timezone}
          />
        </main>
      )}

      <footer className="foot">
        <p>
          Readings from Visual Crossing Weather. Times shown in the location's
          local time.
        </p>
      </footer>
    </div>
  );
}
