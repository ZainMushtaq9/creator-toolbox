import { useState } from "react";
import { useCopy } from "../shared.jsx";
export default function ZakatCalculator() {
  const [cash, setCash] = useState("500000");
  const [savings, setSavings] = useState("100000");
  const [gold, setGold] = useState("200000");
  const [silver, setSilver] = useState("0");
  const [investments, setInvestments] = useState("0");
  const [stock, setStock] = useState("0");
  const [debts, setDebts] = useState("50000");
  const [silverRate, setSilverRate] = useState("450");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const vals = [cash, savings, gold, silver, investments, stock, debts, silverRate].map(Number);
    if (vals.some((v) => !Number.isFinite(v) || v < 0)) { setError("Enter zero or positive amounts for every field."); setResult(""); return; }
    const [c, s, g, sil, inv, st, d, rate] = vals;
    const net = c + s + g + sil + inv + st - d;
    const nisab = 612.36 * rate;
    if (net < nisab) {
      setError("");
      setResult(`Net zakatable wealth: Rs ${fmt(net)}\nNisab (value of 612.36 g silver at Rs ${fmt(rate)} per gram): Rs ${fmt(nisab)}\nYour wealth is below the nisab, so no zakat is due on this calculation. Zakat is 2.5% of net wealth held for a full lunar year, payable when wealth reaches the nisab.`);
      return;
    }
    setError("");
    setResult(`Net zakatable wealth: Rs ${fmt(net)}\nNisab (value of 612.36 g silver at Rs ${fmt(rate)} per gram): Rs ${fmt(nisab)}\nZakat due (2.5%): Rs ${fmt(net * 0.025)}\nFormula: zakat = 2.5% × (cash + savings + gold + silver + investments + business stock − debts).`);
  };
  return (
    <div>
      <p className="notice">Religious estimate only — not a fatwa. Enter today's silver rate per gram yourself (no live price is built in); the nisab is the value of 52.5 tola (612.36 g) of silver. Confirm your zakat with a scholar if you are unsure.</p>
      <label htmlFor="zakat-cash">Cash in hand (Rs)</label>
      <input id="zakat-cash" className="input" type="number" min="0" value={cash} onChange={(e) => setCash(e.target.value)} />
      <label htmlFor="zakat-savings">Bank savings (Rs)</label>
      <input id="zakat-savings" className="input" type="number" min="0" value={savings} onChange={(e) => setSavings(e.target.value)} />
      <label htmlFor="zakat-gold">Gold — market value (Rs)</label>
      <input id="zakat-gold" className="input" type="number" min="0" value={gold} onChange={(e) => setGold(e.target.value)} />
      <label htmlFor="zakat-silver">Silver — market value (Rs)</label>
      <input id="zakat-silver" className="input" type="number" min="0" value={silver} onChange={(e) => setSilver(e.target.value)} />
      <label htmlFor="zakat-investments">Investments (Rs)</label>
      <input id="zakat-investments" className="input" type="number" min="0" value={investments} onChange={(e) => setInvestments(e.target.value)} />
      <label htmlFor="zakat-stock">Business stock (Rs)</label>
      <input id="zakat-stock" className="input" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
      <label htmlFor="zakat-debts">Debts you owe (Rs)</label>
      <input id="zakat-debts" className="input" type="number" min="0" value={debts} onChange={(e) => setDebts(e.target.value)} />
      <label htmlFor="zakat-silver-rate">Today's silver rate per gram (Rs) — for the nisab</label>
      <input id="zakat-silver-rate" className="input" type="number" min="0" step="0.01" value={silverRate} onChange={(e) => setSilverRate(e.target.value)} />
      <div className="toolbar"><button type="button" className="btn" onClick={calc}>Calculate Zakat</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: cash 500,000 + savings 100,000 + gold 200,000 − debts 50,000 = net wealth 750,000. At a silver rate of Rs 450 per gram the nisab is 612.36 × 450 = Rs 275,562, so zakat is 2.5% × 750,000 = Rs 18,750.</p>
    </div>
  );
}
