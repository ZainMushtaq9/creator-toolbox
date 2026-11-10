import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function SalaryToHourlyCalculator() {
  const [mode, setMode] = useState("salary-to-hourly");
  const [salary, setSalary] = useState("1200000");
  const [hourly, setHourly] = useState("500");
  const [hours, setHours] = useState("40");
  const [weeks, setWeeks] = useState("52");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const h = Number(hours), w = Number(weeks);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || h > 168 || w <= 0 || w > 52) { setError("Enter hours per week between 1 and 168, and weeks per year between 1 and 52."); setResult(""); return; }
    if (mode === "salary-to-hourly") {
      const annual = Number(salary);
      if (!Number.isFinite(annual) || annual < 0) { setError("Enter an annual salary of zero or more."); setResult(""); return; }
      const rate = annual / (h * w);
      setError("");
      setResult(`Hourly rate: ${fmt(rate)}\nMonthly salary: ${fmt(annual / 12)}\nWeekly salary: ${fmt(annual / w)}\nFormula: hourly rate = annual salary ÷ (hours per week × weeks per year).`);
    } else {
      const rate = Number(hourly);
      if (!Number.isFinite(rate) || rate < 0) { setError("Enter an hourly rate of zero or more."); setResult(""); return; }
      const annual = rate * h * w;
      setError("");
      setResult(`Annual salary: ${fmt(annual)}\nMonthly salary: ${fmt(annual / 12)}\nWeekly salary: ${fmt(annual / w)}\nFormula: annual salary = hourly rate × hours per week × weeks per year.`);
    }
  };
  return (
    <div>
      <p className="notice">Estimate only. The result is gross pay before tax and deductions, and it assumes the same hours every week.</p>
      <label htmlFor="sth-mode">Direction</label>
      <select id="sth-mode" className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="salary-to-hourly">Annual salary → hourly rate</option>
        <option value="hourly-to-salary">Hourly rate → annual salary</option>
      </select>
      {mode === "salary-to-hourly" ? (
        <div>
          <label htmlFor="sth-salary">Annual salary</label>
          <input id="sth-salary" className="input" type="number" min="0" value={salary} onChange={(e) => setSalary(e.target.value)} />
        </div>
      ) : (
        <div>
          <label htmlFor="sth-hourly">Hourly rate</label>
          <input id="sth-hourly" className="input" type="number" min="0" step="0.01" value={hourly} onChange={(e) => setHourly(e.target.value)} />
        </div>
      )}
      <label htmlFor="sth-hours">Hours per week</label>
      <input id="sth-hours" className="input" type="number" min="0" value={hours} onChange={(e) => setHours(e.target.value)} />
      <label htmlFor="sth-weeks">Weeks per year</label>
      <input id="sth-weeks" className="input" type="number" min="0" value={weeks} onChange={(e) => setWeeks(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 1,200,000 a year at 40 hours a week for 52 weeks → 1,200,000 ÷ 2,080 = 576.92 an hour. The other way: 500 an hour at 40 hours a week → 1,040,000 a year.</p>
    </div>
  );
}
