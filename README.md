Buikem's — Weather Station App

A weather app that shows the current conditions for any location, along with a 48-hour temperature trace covering the previous and next 24 hours. Built as a solution to the roadmap.sh Weather App project.

Rather than a generic forecast card, the app is styled like a weather instrument panel — a dark, brass-and-glow color scheme with an oscilloscope-style line chart as its centerpiece.

Features
Search for weather by city, zip/postal code, or place name
Displays current temperature, "feels like" temperature, condition (e.g. Sunny, Cloudy, Rain), wind speed, chance of rain, humidity, and UV index
Shows the previous 24 hours and next 24 hours of temperature on an interactive trace chart, with a marker for the current hour — hover or tap any point for that hour's exact reading
One-tap refresh of the current location's weather
Defaults to the user's current location on first load (via browser geolocation), falling back to manual search if location access is denied
Responsive layout, tuned for phones, tablets, laptops, and large monitors
Fully keyboard accessible, with visible focus states and support for prefers-reduced-motion
Tech stack
React for the UI
Vite for the dev server and build
Plain CSS (no framework) for styling
Visual Crossing Weather API for weather data
No charting library — the 48-hour trace is a hand-built SVG chart
Getting started

1. Install dependencies
   bash
   npm install
2. Get a free API key

Sign up at visualcrossing.com/weather-api — the free tier is enough to run this app.

3. Add your key

Copy .env.example to a new file named .env:

bash
cp .env.example .env

Then open .env and paste your key in:

VITE_VISUAL_CROSSING_KEY=your_api_key_here 4. Run the app
bash
npm run dev

Open the URL Vite prints in the terminal (usually http://localhost:5173).

5. Build for production
   bash
   npm run build
   npm run preview # serves the production build locally, to test it
   Project structure
   index.html Page shell — mounts the React app into #root
   src/main.jsx Entry point — renders <App /> into the page
   src/App.jsx Top-level component — holds app state and data fetching
   src/components/Rail.jsx Search bar, locate button, refresh button
   src/components/Hero.jsx Current conditions display
   src/components/TraceChart.jsx 48-hour temperature trace chart
   src/components/Icon.jsx Wrapper for the hand-drawn weather condition icons
   src/weather.js Visual Crossing API client (fetch + normalize data)
   src/icons.js SVG line-icon definitions for weather conditions
   src/trace.js Builds and draws the SVG trace chart
   src/style.css All styling, including responsive breakpoints
   Notes
   Temperatures are in °C and wind speed in km/h. Change unitGroup=metric to unitGroup=us in src/weather.js for imperial units.
   The app requests a 3-day weather window (yesterday through tomorrow) and slices out the ±24 hours around the current time on the client side, so the trace stays accurate no matter what time of day the app is loaded.
   Credit
   Project brief: roadmap.sh — Weather App
   Weather data: Visual Crossing Weather API
