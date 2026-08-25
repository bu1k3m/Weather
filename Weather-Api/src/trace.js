import { miniDisplayMarkup } from "./icons.js";

const VB_W = 1000;
const VB_H = 260;
const PAD_L = 36;
const PAD_R = 16;
const PAD_T = 22;
const PAD_B = 34;

function fmtHour(epoch, timezone) {
  return new Date(epoch * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: timezone,
  });
}

function fmtFullTime(epoch, timezone) {
  return new Date(epoch * 1000).toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
}

/**
 * Render the -24h..+24h temperature trace into #trace-svg, and wire up
 * a floating tooltip for hover/tap on each hour.
 */
export function renderTrace({ svgEl, tipEl, hours, nowEpoch, timezone }) {
  if (!hours.length) {
    svgEl.innerHTML = "";
    return;
  }

  const temps = hours.map((h) => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const span = Math.max(maxTemp - minTemp, 4);
  const yFor = (t) =>
    PAD_T +
    (VB_H - PAD_T - PAD_B) *
      (1 - (t - minTemp + (span - (maxTemp - minTemp)) / 2) / span);

  const n = hours.length;
  const xFor = (i) => PAD_L + ((VB_W - PAD_L - PAD_R) * i) / (n - 1);

  // Find split index: last hour at/before "now"
  let splitIdx = 0;
  hours.forEach((h, i) => {
    if (h.epoch <= nowEpoch) splitIdx = i;
  });

  const pastPts = hours
    .slice(0, splitIdx + 1)
    .map((h, i) => [xFor(i), yFor(h.temp)]);
  const futurePts = hours
    .slice(splitIdx)
    .map((h, i) => [xFor(splitIdx + i), yFor(h.temp)]);

  const toPath = (pts) =>
    pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`,
      )
      .join(" ");
  const toArea = (pts) => {
    if (!pts.length) return "";
    const base = VB_H - PAD_B;
    return (
      `M${pts[0][0].toFixed(1)},${base} ` +
      pts.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") +
      ` L${pts[pts.length - 1][0].toFixed(1)},${base} Z`
    );
  };

  const nowX = xFor(splitIdx);

  // Grid lines (every ~6 hours) + hour labels
  const gridStep = Math.max(1, Math.round(n / 8));
  let gridSvg = "";
  let labelSvg = "";
  hours.forEach((h, i) => {
    if (i % gridStep !== 0 && i !== n - 1) return;
    const x = xFor(i);
    gridSvg += `<line class="trace-grid-line" x1="${x}" y1="${PAD_T}" x2="${x}" y2="${VB_H - PAD_B}" />`;
    labelSvg += `<text class="trace-hour-label" x="${x}" y="${VB_H - 12}" text-anchor="middle">${fmtHour(h.epoch, timezone)}</text>`;
  });

  // Points + hit areas (every 2 hours to avoid clutter, always include split/now)
  const pointStep = n > 30 ? 2 : 1;
  let pointsSvg = "";
  hours.forEach((h, i) => {
    const isNow = i === splitIdx;
    if (i % pointStep !== 0 && !isNow) return;
    const x = xFor(i);
    const y = yFor(h.temp);
    const cls = isNow ? "now" : i > splitIdx ? "future" : "";
    pointsSvg += `<circle class="trace-point ${cls}" cx="${x}" cy="${y}" r="${isNow ? 4.5 : 3}" />`;
    if (isNow) {
      pointsSvg += `<text class="trace-temp-label now" x="${x}" y="${y - 12}" text-anchor="middle">${Math.round(h.temp)}°</text>`;
    }
    pointsSvg += `<circle class="trace-hit" data-i="${i}" cx="${x}" cy="${y}" r="12" />`;
  });

  svgEl.innerHTML = `
    <defs>
      <linearGradient id="gradPast" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--paper-dim)" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="var(--paper-dim)" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="gradFuture" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--brass)" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="var(--brass)" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${gridSvg}
    <path class="trace-fill-past" d="${toArea(pastPts)}" />
    <path class="trace-fill-future" d="${toArea(futurePts)}" />
    <line class="trace-now-line" x1="${nowX}" y1="${PAD_T}" x2="${nowX}" y2="${VB_H - PAD_B}" />
    <path class="trace-path-past" d="${toPath(pastPts)}" stroke-dasharray="600" stroke-dashoffset="600">
      <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.8s" fill="freeze" />
    </path>
    <path class="trace-path-future" d="${toPath(futurePts)}" stroke-dasharray="600" stroke-dashoffset="600">
      <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.8s" begin="0.1s" fill="freeze" />
    </path>
    ${pointsSvg}
    ${labelSvg}
  `;

  // Tooltip interaction
  const hits = svgEl.querySelectorAll(".trace-hit");
  const showTip = (element, hour) => {
    const rect = svgEl.getBoundingClientRect();
    const wrapRect = svgEl.parentElement.getBoundingClientRect();
    const x =
      (parseFloat(element.getAttribute("cx")) / VB_W) * rect.width +
      (rect.left - wrapRect.left);
    const y =
      (parseFloat(element.getAttribute("cy")) / VB_H) * rect.height +
      (rect.top - wrapRect.top);
    tipEl.style.left = `${x}px`;
    tipEl.style.top = `${y - 10}px`;
    tipEl.innerHTML = `${miniDisplayMarkup(hour.icon)} <b>${Math.round(hour.temp)}°</b> · ${fmtFullTime(hour.epoch, timezone)}`;
    tipEl.classList.add("visible");
  };
  hits.forEach((hit) => {
    const hour = hours[Number(hit.dataset.i)];
    hit.addEventListener("mouseenter", () => showTip(hit, hour));
    hit.addEventListener("mouseleave", () => tipEl.classList.remove("visible"));
    hit.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        showTip(hit, hour);
      },
      { passive: false },
    );
  });

  // Scroll to "now" on first render so the split is in view
  requestAnimationFrame(() => {
    const wrap = svgEl.parentElement;
    const target = (nowX / VB_W) * svgEl.scrollWidth;
    wrap.scrollLeft = Math.max(0, target - wrap.clientWidth / 2);
  });
}
