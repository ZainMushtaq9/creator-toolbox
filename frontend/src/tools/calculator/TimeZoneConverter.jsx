import { useState } from "react";
import { useCopy } from "../shared.jsx";
const ZONES = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Karachi", label: "Karachi (Pakistan)" },
  { value: "Asia/Dubai", label: "Dubai (UAE)" },
  { value: "Asia/Kolkata", label: "Kolkata (India)" },
  { value: "Asia/Dhaka", label: "Dhaka (Bangladesh)" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo (Japan)" },
  { value: "Australia/Sydney", label: "Sydney (Australia)" },
  { value: "Europe/London", label: "London (UK)" },
  { value: "Europe/Berlin", label: "Berlin (Germany)" },
  { value: "America/New_York", label: "New York (USA, Eastern)" },
  { value: "America/Chicago", label: "Chicago (USA, Central)" },
  { value: "America/Los_Angeles", label: "Los Angeles (USA, Pacific)" },
  { value: "America/Toronto", label: "Toronto (Canada)" },
];
// Offset of a time zone at an instant, in ms (asUTC − instant), via Intl.
function zoneOffsetMs(instant, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", { timeZone, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const parts = dtf.formatToParts(instant);
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  let hour = get("hour"); if (hour === 24) hour = 0;
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute"), get("second"));
  return asUTC - Math.floor(instant.getTime() / 1000) * 1000;
}
function formatInZone(instant, timeZone) {
  return new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(instant);
}
export default function TimeZoneConverter() {
  const [date, setDate] = useState("2026-01-15");
  const [time, setTime] = useState("12:00");
  const [fromZone, setFromZone] = useState("Asia/Karachi");
  const [toZone, setToZone] = useState("UTC");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const calc = () => {
    if (!date || !time) { setError("Pick a date and a time."); setResult(""); return; }
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    if ([y, m, d, hh, mm].some((v) => !Number.isFinite(v))) { setError("Pick a valid date and time."); setResult(""); return; }
    try {
      const wallAsUTC = Date.UTC(y, m - 1, d, hh, mm);
      // Wall time in the from-zone corresponds to an instant one offset away;
      // refine once so daylight-saving changes near the date are handled.
      const first = new Date(wallAsUTC - zoneOffsetMs(new Date(wallAsUTC), fromZone));
      const instant = new Date(wallAsUTC - zoneOffsetMs(first, fromZone));
      setError("");
      setResult(`${formatInZone(instant, fromZone)} (${fromZone})\nis the same moment as\n${formatInZone(instant, toZone)} (${toZone})\nand ${formatInZone(instant, "UTC")} (UTC).\nOffsets come from your browser's built-in time-zone data (IANA zones), including daylight saving — no offset is typed in by hand.`);
    } catch {
      setError("That time zone is not supported by this browser."); setResult("");
    }
  };
  return (
    <div>
      <p className="notice">Converted with your browser's built-in time-zone data, so daylight saving is handled for the date you enter. No offsets are typed in by hand.</p>
      <label htmlFor="tz-date">Date</label>
      <input id="tz-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <label htmlFor="tz-time">Time</label>
      <input id="tz-time" className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <label htmlFor="tz-from">From time zone</label>
      <select id="tz-from" className="input" value={fromZone} onChange={(e) => setFromZone(e.target.value)}>
        {ZONES.map((z) => (<option key={z.value} value={z.value}>{z.label}</option>))}
      </select>
      <label htmlFor="tz-to">To time zone</label>
      <select id="tz-to" className="input" value={toZone} onChange={(e) => setToZone(e.target.value)}>
        {ZONES.map((z) => (<option key={z.value} value={z.value}>{z.label}</option>))}
      </select>
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Convert Time Zone</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 15 January 2026, 12:00 in Karachi → 07:00 UTC, and 02:00 the same day in New York.</p>
    </div>
  );
}
