import { displayMarkup } from "../icons.js";

/**
 * The icons in icons.js are plain SVG strings (they were written before this
 * was React). This component just gives React a safe, official way to drop
 * that SVG string into the page: `dangerouslySetInnerHTML`. It's marked
 * "dangerous" because React normally won't let you insert raw HTML/SVG text
 * (to avoid accidentally injecting something harmful) — but since *we* wrote
 * this SVG ourselves, it's safe here.
 */
export default function Icon({ name, size = 56, className }) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: displayMarkup(name, { size }) }}
    />
  );
}
