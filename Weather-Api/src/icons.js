// Minimal line-displays matching Visual Crossing's icon set, drawn in the same
// stroke style as the rest of the UI (no emoji, no stock icon packs).

const DISPLAYS = {
  "clear-day": `<circle cx="12" cy="12" r="4.6"/><path d="M12 2.4v2.4M12 19.2v2.4M21.6 12h-2.4M4.8 12H2.4M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"/>`,
  "clear-night": `<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"/>`,
  "partly-cloudy-day": `<circle cx="9" cy="9.5" r="3.6"/><path d="M9 3.2v1.8M15.2 9.5h1.8M4 9.5H2.2M13.2 5.3l-1.3 1.3M5.9 12.7l-1.3 1.3M13.2 13.7l-1.3-1.3" opacity=".85"/><path d="M8.6 20.4h8.6a3.6 3.6 0 0 0 .5-7.2 4.6 4.6 0 0 0-8.9-1.6 3.8 3.8 0 0 0-3.4 3.8 3.8 3.8 0 0 0 3.2 5Z"/>`,
  "partly-cloudy-night": `<path d="M9.5 12A6.2 6.2 0 0 1 15.8 6a5 5 0 1 0 0 .2" opacity=".85"/><path d="M7.6 20.4h8.6a3.6 3.6 0 0 0 .5-7.2 4.6 4.6 0 0 0-8.9-1.6 3.8 3.8 0 0 0-3.4 3.8 3.8 3.8 0 0 0 3.2 5Z"/>`,
  cloudy: `<path d="M6.6 19.4h10.8a4 4 0 0 0 .5-8 5.2 5.2 0 0 0-10-1.8 4.3 4.3 0 0 0-3.9 4.3 4.3 4.3 0 0 0 2.6 3.9Z"/>`,
  fog: `<path d="M4 8.5h13M4 12.2h16M4 15.9h13" /><path d="M8 19.4h9" opacity=".7"/>`,
  wind: `<path d="M3 8h11a2.6 2.6 0 1 0-2.4-3.6"/><path d="M3 12.3h15.4a2.7 2.7 0 1 1-2.5 3.8"/><path d="M3 16.6h9.4"/>`,
  rain: `<path d="M6.6 14.6h10.8a4 4 0 0 0 .5-8 5.2 5.2 0 0 0-10-1.8 4.3 4.3 0 0 0-3.9 4.3 4.3 4.3 0 0 0 2.6 3.9Z"/><path d="M8 17.4l-1.4 3M12.5 17.4l-1.4 3M17 17.4l-1.4 3"/>`,
  showers: `<path d="M6.6 13.6h10.8a4 4 0 0 0 .5-8 5.2 5.2 0 0 0-10-1.8 4.3 4.3 0 0 0-3.9 4.3 4.3 4.3 0 0 0 2.6 3.9Z"/><path d="M9 16.4l-1.6 4M15 16.4l-1.6 4"/>`,
  snow: `<path d="M6.6 13.6h10.8a4 4 0 0 0 .5-8 5.2 5.2 0 0 0-10-1.8 4.3 4.3 0 0 0-3.9 4.3 4.3 4.3 0 0 0 2.6 3.9Z"/><path d="M9 17v4M7 18.4l4 1.2M11 18.4l-4 1.2M15 17v4M13 18.4l4 1.2M17 18.4l-4 1.2"/>`,
  "thunder-rain": `<path d="M6.6 12.6h10.8a4 4 0 0 0 .5-8 5.2 5.2 0 0 0-10-1.8 4.3 4.3 0 0 0-3.9 4.3 4.3 4.3 0 0 0 2.6 3.9Z"/><path d="m13 15-2.6 4.2h2.4L10.4 23"/>`,
  "thunder-showers-day": `<circle cx="7" cy="6.5" r="2.6" opacity=".7"/><path d="M6.6 12.6h10.8a4 4 0 0 0 .5-8 5.2 5.2 0 0 0-10-1.8 4.3 4.3 0 0 0-3.9 4.3 4.3 4.3 0 0 0 2.6 3.9Z"/><path d="m13 15-2.6 4.2h2.4L10.4 23"/>`,
  default: `<path d="M6.6 19.4h10.8a4 4 0 0 0 .5-8 5.2 5.2 0 0 0-10-1.8 4.3 4.3 0 0 0-3.9 4.3 4.3 4.3 0 0 0 2.6 3.9Z"/>`,
};

export function displayMarkup(icon, { size = 56 } = {}) {
  const inner = DISPLAYS[icon] || DISPLAYS.default;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

export function miniDisplayMarkup(icon) {
  return displayMarkup(icon, { size: 16 });
}
