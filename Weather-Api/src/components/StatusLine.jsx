export default function StatusLine({ message, tone }) {
  return (
    <p
      className="status"
      role="status"
      aria-live="polite"
      data-tone={tone || undefined}>
      {message}
    </p>
  );
}
