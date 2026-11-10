import { useState } from "react";
import { useCopy } from "../shared.jsx";
const SLABS = [
  { upTo: 600000, rate: 0 },
  { upTo: 1200000, rate: 0.01 },
  { upTo: 2200000, rate: 0.11 },
  { upTo: 3200000, rate: 0.20 },
  { upTo: 4100000, rate: 0.25 },
  { upTo: 5600000, rate: 0.29 },
  { upTo: 7000000, rate: 0.32 },
  { upTo: Infinity, rate: 0.35 },
];
export default function PakistanSalaryTaxCalculator() {
  const [salary, setSalary] = useState("1800000");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const annual = Number(salary);
    if (!Number.isFinite(annual) || annual < 0) { setError("Enter an annual salary of zero or more."); setResult(""); return; }
    let tax = 0, lower = 0;
    const lines = [];
    for (const s of SLABS) {
      const taxable = Math.max(0, Math.min(annual, s.upTo) - lower);
      if (taxable > 0 && s.rate > 0) lines.push(`Rs ${fmt(lower)}–${s.upTo === Infinity ? "above" : "Rs " + fmt(s.upTo)} at ${s.rate * 100}%: Rs ${fmt(taxable * s.rate)}`);
      tax += taxable * s.rate;
      lower = s.upTo;
      if (annual <= s.upTo) break;
    }
    setError("");
    setResult(`Annual income tax: Rs ${fmt(tax)}\nMonthly tax: Rs ${fmt(tax / 12)}\nMonthly take-home: Rs ${fmt(annual / 12 - tax / 12)}\nAnnual take-home: Rs ${fmt(annual - tax)}\nSlab breakdown:\n${lines.length ? lines.join("\n") : "No tax — income is within the tax-free slab."}`);
  };
  return (
    <div>
      <p className="notice">Estimate only — not tax advice. Slabs are the widely published FBR salaried slabs for tax year 2026–27 under the Finance Act 2026 (no surcharge in 2026–27). Allowances, rebates and filer status can change your final liability — verify on fbr.gov.pk or with a tax practitioner.</p>
      <label htmlFor="tax-salary">Annual salary (Rs)</label>
      <input id="tax-salary" className="input" type="number" min="0" value={salary} onChange={(e) => setSalary(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Salary Tax</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: Rs 1,800,000 a year → Rs 600,000 tax-free, Rs 600,000 at 1% (Rs 6,000) and Rs 600,000 at 11% (Rs 66,000) = Rs 72,000 a year, Rs 6,000 a month, take-home Rs 144,000 a month.</p>
    </div>
  );
}
