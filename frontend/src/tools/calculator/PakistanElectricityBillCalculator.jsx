import { useState } from "react";
import { useCopy } from "../shared.jsx";
// July 2025 NEPRA notified residential base rates (Rs per unit), after the
// Rs 1.14 per unit cut. All rates are editable — tariffs change, so match
// them to your latest bill. Non-protected slabs are added one by one
// (telescopic); protected users pay the two protected slabs up to 200 units
// and the unprotected slabs above that.
const DEFAULT_RATES = { p1: "10.54", p2: "13.01", u1: "22.44", u2: "28.91", u3: "33.10", u4: "37.99", u5: "40.20", u6: "41.62", u7: "42.76", u8: "47.69" };
const UNPROTECTED = [
  { key: "u1", upTo: 100, label: "1–100" },
  { key: "u2", upTo: 200, label: "101–200" },
  { key: "u3", upTo: 300, label: "201–300" },
  { key: "u4", upTo: 400, label: "301–400" },
  { key: "u5", upTo: 500, label: "401–500" },
  { key: "u6", upTo: 600, label: "501–600" },
  { key: "u7", upTo: 700, label: "601–700" },
  { key: "u8", upTo: Infinity, label: "Above 700" },
];
export default function PakistanElectricityBillCalculator() {
  const [units, setUnits] = useState("300");
  const [category, setCategory] = useState("non-protected");
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [fpa, setFpa] = useState("0");
  const [fixed, setFixed] = useState("0");
  const [gst, setGst] = useState("0");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const setRate = (key, value) => setRates({ ...rates, [key]: value });
  const calc = () => {
    const u = Number(units), fpaRate = Number(fpa), fixedCharge = Number(fixed), gstPct = Number(gst);
    const rateVals = Object.fromEntries(Object.entries(rates).map(([k, v]) => [k, Number(v)]));
    if (!Number.isFinite(u) || u < 0 || Object.values(rateVals).some((v) => !Number.isFinite(v) || v < 0) || !Number.isFinite(fpaRate) || !Number.isFinite(fixedCharge) || !Number.isFinite(gstPct) || fpaRate < 0 || fixedCharge < 0 || gstPct < 0) { setError("Enter zero or positive units, rates and charges for every field."); setResult(""); return; }
    let energy = 0, lower = 0;
    const lines = [];
    if (category === "protected" && u <= 200) {
      const slabs = [{ key: "p1", upTo: 100 }, { key: "p2", upTo: 200 }];
      for (const s of slabs) {
        const inSlab = Math.max(0, Math.min(u, s.upTo) - lower);
        if (inSlab > 0) { energy += inSlab * rateVals[s.key]; lines.push(`${inSlab} units × Rs ${fmt(rateVals[s.key])} = Rs ${fmt(inSlab * rateVals[s.key])}`); }
        lower = s.upTo;
      }
    } else {
      for (const s of UNPROTECTED) {
        const inSlab = Math.max(0, Math.min(u, s.upTo) - lower);
        if (inSlab > 0) { energy += inSlab * rateVals[s.key]; lines.push(`${inSlab} units × Rs ${fmt(rateVals[s.key])} = Rs ${fmt(inSlab * rateVals[s.key])}`); }
        lower = s.upTo;
        if (u <= s.upTo) break;
      }
    }
    const fpaAmount = u * fpaRate;
    const subtotal = energy + fpaAmount + fixedCharge;
    const gstAmount = subtotal * (gstPct / 100);
    setError("");
    setResult(`Energy charges:\n${lines.join("\n")}\nEnergy total: Rs ${fmt(energy)}\nFuel adjustment (${fmt(fpaRate)} × ${u} units): Rs ${fmt(fpaAmount)}\nFixed charges: Rs ${fmt(fixedCharge)}\nGST (${gstPct}%): Rs ${fmt(gstAmount)}\nEstimated bill: Rs ${fmt(subtotal + gstAmount)}`);
  };
  return (
    <div>
      <p className="notice">Estimate only. Default slab rates are the July 2025 NEPRA notified residential base rates — tariffs, fuel adjustment and taxes change monthly, so edit every rate to match your latest bill. Slabs are added one by one; some DISCO bills apply your highest slab rate to all units, so check your bill if the total differs.</p>
      <label htmlFor="bill-units">Units used this month</label>
      <input id="bill-units" className="input" type="number" min="0" value={units} onChange={(e) => setUnits(e.target.value)} />
      <label htmlFor="bill-category">Consumer category</label>
      <select id="bill-category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="protected">Protected — 200 units or fewer in each of the last 6 months</option>
        <option value="non-protected">Non-protected — everyone else</option>
      </select>
      <label htmlFor="bill-p1">Protected rate 1–100 units (Rs per unit)</label>
      <input id="bill-p1" className="input" type="number" min="0" step="0.01" value={rates.p1} onChange={(e) => setRate("p1", e.target.value)} />
      <label htmlFor="bill-p2">Protected rate 101–200 units (Rs per unit)</label>
      <input id="bill-p2" className="input" type="number" min="0" step="0.01" value={rates.p2} onChange={(e) => setRate("p2", e.target.value)} />
      <label htmlFor="bill-u1">Rate 1–100 units (Rs per unit)</label>
      <input id="bill-u1" className="input" type="number" min="0" step="0.01" value={rates.u1} onChange={(e) => setRate("u1", e.target.value)} />
      <label htmlFor="bill-u2">Rate 101–200 units (Rs per unit)</label>
      <input id="bill-u2" className="input" type="number" min="0" step="0.01" value={rates.u2} onChange={(e) => setRate("u2", e.target.value)} />
      <label htmlFor="bill-u3">Rate 201–300 units (Rs per unit)</label>
      <input id="bill-u3" className="input" type="number" min="0" step="0.01" value={rates.u3} onChange={(e) => setRate("u3", e.target.value)} />
      <label htmlFor="bill-u4">Rate 301–400 units (Rs per unit)</label>
      <input id="bill-u4" className="input" type="number" min="0" step="0.01" value={rates.u4} onChange={(e) => setRate("u4", e.target.value)} />
      <label htmlFor="bill-u5">Rate 401–500 units (Rs per unit)</label>
      <input id="bill-u5" className="input" type="number" min="0" step="0.01" value={rates.u5} onChange={(e) => setRate("u5", e.target.value)} />
      <label htmlFor="bill-u6">Rate 501–600 units (Rs per unit)</label>
      <input id="bill-u6" className="input" type="number" min="0" step="0.01" value={rates.u6} onChange={(e) => setRate("u6", e.target.value)} />
      <label htmlFor="bill-u7">Rate 601–700 units (Rs per unit)</label>
      <input id="bill-u7" className="input" type="number" min="0" step="0.01" value={rates.u7} onChange={(e) => setRate("u7", e.target.value)} />
      <label htmlFor="bill-u8">Rate above 700 units (Rs per unit)</label>
      <input id="bill-u8" className="input" type="number" min="0" step="0.01" value={rates.u8} onChange={(e) => setRate("u8", e.target.value)} />
      <label htmlFor="bill-fpa">Fuel price adjustment per unit (Rs) — from your bill</label>
      <input id="bill-fpa" className="input" type="number" min="0" step="0.01" value={fpa} onChange={(e) => setFpa(e.target.value)} />
      <label htmlFor="bill-fixed">Fixed charges (Rs) — from your bill</label>
      <input id="bill-fixed" className="input" type="number" min="0" step="0.01" value={fixed} onChange={(e) => setFixed(e.target.value)} />
      <label htmlFor="bill-gst">GST (%) — from your bill</label>
      <input id="bill-gst" className="input" type="number" min="0" step="0.1" value={gst} onChange={(e) => setGst(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Electricity Bill</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 300 units, non-protected, at the July 2025 rates → 100 × 22.44 + 100 × 28.91 + 100 × 33.10 = Rs 8,445 energy charges, before fuel adjustment, fixed charges and taxes.</p>
    </div>
  );
}
