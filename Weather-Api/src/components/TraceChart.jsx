import { useEffect, useRef } from "react";
import { renderTrace } from "../trace.js";

/**
 * The trace chart draws itself by directly writing SVG markup (it was
 * written before this was React, and hand-building 48 chart points as JSX
 * elements would be a lot more code for no real benefit). Rather than
 * rewrite all that drawing logic, we let React give us a handle to the real
 * <svg> and tooltip <div> DOM nodes (that's what `useRef` does), and then
 * call the existing `renderTrace` function ourselves whenever the weather
 * data changes (that's what `useEffect` does — it "runs some code after
 * React updates the page").
 */
export default function TraceChart({ hours, nowEpoch, timezone }) {
  const svgRef = useRef(null);
  const tipRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !tipRef.current || !hours?.length) return;
    renderTrace({
      svgEl: svgRef.current,
      tipEl: tipRef.current,
      hours,
      nowEpoch,
      timezone,
    });
  }, [hours, nowEpoch, timezone]);

  return (
    <section
      className="trace-section"
      aria-label="Hourly temperature, past and next 24 hours">
      <div className="trace-heading">
        <h2>48-hour trace</h2>
        <p>
          Yesterday through tomorrow{" "}
          <span className="glow-dot" aria-hidden="true" />
        </p>
      </div>
      <div className="trace-wrap">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
          role="img"
          aria-label="Temperature trace"
        />
        <div ref={tipRef} className="trace-tip" />
      </div>
      <div className="trace-legend">
        <span>
          <i className="lg lg-past" /> Past 24h
        </span>
        <span>
          <i className="lg lg-now" /> Now
        </span>
        <span>
          <i className="lg lg-future" /> Next 24h
        </span>
      </div>
    </section>
  );
}
