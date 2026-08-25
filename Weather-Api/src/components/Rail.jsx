export default function Rail({
  inputValue,
  onInputChange,
  onSubmit,
  onLocate,
  onRefresh,
  busy,
}) {
  return (
    <header className="rail">
      <div className="rail-brand">
        <span className="rail-mark" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6">
            <circle cx="12" cy="12" r="8.4" />
            <path d="M12 7.2V12l3 2.2" />
          </svg>
        </span>
        <span className="rail-title">Buikem</span>
      </div>

      <form className="rail-search" onSubmit={onSubmit} autoComplete="off">
        <label htmlFor="location-input" className="sr-only">
          Location
        </label>
        <input
          id="location-input"
          name="location"
          type="text"
          placeholder="Enter a city, zip, or place…"
          aria-label="Location"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          required
        />
        <button
          type="submit"
          className="btn btn-primary"
          aria-label="Search"
          disabled={busy}>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <span>Read</span>
        </button>
      </form>

      <div className="rail-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onLocate}
          disabled={busy}
          title="Use my location">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
          <span className="btn-label">Locate</span>
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onRefresh}
          disabled={busy}
          title="Refresh reading">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 3v6h-6" />
          </svg>
          <span className="btn-label">Refresh</span>
        </button>
      </div>
    </header>
  );
}
