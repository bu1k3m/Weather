import Icon from "./Icon.jsx";

export default function Hero({ resolvedAddress, timezone, current, busy }) {
  const placeTime = new Date(current.epoch * 1000).toLocaleString("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });

  return (
    <section className="hero" aria-labelledby="place-name">
      <div className="hero-top">
        <div className="hero-place">
          <h1 id="place-name">{resolvedAddress}</h1>
          <p className="hero-time">{placeTime}</p>
        </div>
        <div className="hero-display">
          <Icon name={current.icon} size={56} />
        </div>
      </div>

      <div className="hero-temp-row">
        <span className={`hero-temp${busy ? " skeleton" : ""}`}>
          {Math.round(current.temp)}°
        </span>
        <div className="hero-sub">
          <span className={busy ? "skeleton" : undefined}>
            {current.conditions || "—"}
          </span>
          <span className="hero-feels">
            Feels like <b>{Math.round(current.feelslike)}°</b>
          </span>
        </div>
      </div>

      <dl className="dial-grid">
        <div className="dial">
          <dt>Wind</dt>
          <dd>{Math.round(current.windspeed)}km/h</dd>
        </div>
        <div className="dial">
          <dt>Chance of rain</dt>
          <dd>{Math.round(current.precipprob)}%</dd>
        </div>
        <div className="dial">
          <dt>Humidity</dt>
          <dd>{Math.round(current.humidity)}%</dd>
        </div>
        <div className="dial">
          <dt>UV index</dt>
          <dd>{current.uvindex != null ? current.uvindex : "—"}</dd>
        </div>
      </dl>
    </section>
  );
}
