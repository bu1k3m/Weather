const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_KEY;
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Fetch a 3-day window (yesterday, today, tomorrow) of weather for a location
 * so we can always slice out a full [-24h, +24h] hourly trace around "now",
 * regardless of what time it currently is.
 *
 * @param {string} location - free-text place, zip/postal code, or "lat,lon"
 */
export async function fetchWeatherWindow(location) {
  if (!API_KEY) {
    throw new Error(
      "Missing API key. Add VITE_VISUAL_CROSSING_KEY to a .env file (see .env.example).",
    );
  }
  if (!location || !location.trim()) {
    throw new Error("Enter a location first.");
  }

  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 1);
  const end = new Date(today);
  end.setDate(end.getDate() + 1);

  const url = new URL(
    `${BASE_URL}/${encodeURIComponent(location.trim())}/${toISODate(start)}/${toISODate(end)}`,
  );
  url.searchParams.set("unitGroup", "metric");
  url.searchParams.set("include", "hours,current,days");
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("contentType", "json");

  let response;
  try {
    response = await fetch(url.toString());
  } catch (err) {
    throw new Error(
      "Could not reach the weather service. Check your connection.",
      { cause: err },
    );
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "That API key was rejected. Check VITE_VISUAL_CROSSING_KEY.",
      );
    }
    if (response.status === 400 || response.status === 404) {
      throw new Error(
        `Could not find "${location}". Try a different spelling.`,
      );
    }
    throw new Error(`Weather service error (status ${response.status}).`);
  }

  const data = await response.json();
  return normalize(data);
}

function normalize(data) {
  const hours = (data.days || []).flatMap((day) =>
    (day.hours || []).map((hour) => ({
      epoch: hour.datetimeEpoch,
      temp: hour.temp,
      feelslike: hour.feelslike,
      conditions: hour.conditions,
      icon: hour.icon,
      precipprob: hour.precipprob ?? 0,
      windspeed: hour.windspeed,
      humidity: hour.humidity,
    })),
  );

  const current = data.currentConditions || {};

  return {
    resolvedAddress: data.resolvedAddress,
    timezone: data.timezone,
    current: {
      epoch: current.datetimeEpoch ?? Math.floor(Date.now() / 1000),
      temp: current.temp,
      feelslike: current.feelslike,
      conditions: current.conditions,
      icon: current.icon,
      windspeed: current.windspeed,
      humidity: current.humidity,
      uvindex: current.uvindex,
      precipprob:
        current.precipprob ??
        findNearestPrecipProb(hours, current.datetimeEpoch),
    },
    hours,
  };
}

function findNearestPrecipProb(hours, epoch) {
  if (!hours.length) return 0;
  let closest = hours[0];
  let bestDiff = Infinity;
  for (const h of hours) {
    const diff = Math.abs(h.epoch - epoch);
    if (diff < bestDiff) {
      bestDiff = diff;
      closest = h;
    }
  }
  return closest.precipprob ?? 0;
}

/**
 * Resolve the user's current position to a "lat,lon" string via the
 * browser's Geolocation API.
 */
export function locateUser() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => reject(new Error("Location access was denied.")),
      { timeout: 8000 },
    );
  });
}
