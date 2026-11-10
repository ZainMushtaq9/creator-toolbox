import { useState } from "react";
import { useCopy } from "../shared.jsx";
const GRADES = [
  { label: "A (4.0)", value: 4.0 },
  { label: "A− (3.7)", value: 3.7 },
  { label: "B+ (3.3)", value: 3.3 },
  { label: "B (3.0)", value: 3.0 },
  { label: "B− (2.7)", value: 2.7 },
  { label: "C+ (2.3)", value: 2.3 },
  { label: "C (2.0)", value: 2.0 },
  { label: "C− (1.7)", value: 1.7 },
  { label: "D (1.0)", value: 1.0 },
  { label: "F (0.0)", value: 0 },
];
export default function CgpaCalculator() {
  const [courses, setCourses] = useState([
    { credits: "3", grade: "4" },
    { credits: "3", grade: "3.3" },
    { credits: "4", grade: "3.7" },
  ]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { msg, copy } = useCopy();
  const update = (i, field, value) => setCourses(courses.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  const addCourse = () => setCourses([...courses, { credits: "3", grade: "4" }]);
  const removeCourse = (i) => { if (courses.length > 1) setCourses(courses.filter((_, idx) => idx !== i)); };
  const calc = () => {
    let totalCredits = 0, totalPoints = 0;
    for (const c of courses) {
      const cr = Number(c.credits), g = Number(c.grade);
      if (!Number.isFinite(cr) || cr <= 0 || cr > 10) { setError("Enter credit hours above zero (and at most 10) for every course."); setResult(""); return; }
      totalCredits += cr; totalPoints += cr * g;
    }
    setError("");
    setResult(`CGPA: ${(totalPoints / totalCredits).toFixed(2)} out of 4.00\nTotal credit hours: ${totalCredits}\nTotal grade points: ${totalPoints.toFixed(2)}\nFormula: CGPA = total grade points ÷ total credit hours, where each course contributes credit hours × grade points.`);
  };
  return (
    <div>
      <p className="notice">Uses the 4.0 scale common at Pakistani universities (NUST, FAST, COMSATS and similar) and internationally. If your university uses different grade points, the result will differ — check your university's grading policy.</p>
      {courses.map((c, i) => (
        <div key={i} className="toolbar" style={{ alignItems: "end" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor={`cgpa-credits-${i}`}>Course {i + 1} — credit hours</label>
            <input id={`cgpa-credits-${i}`} className="input" type="number" min="0" step="0.5" value={c.credits} onChange={(e) => update(i, "credits", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor={`cgpa-grade-${i}`}>Grade</label>
            <select id={`cgpa-grade-${i}`} className="input" value={c.grade} onChange={(e) => update(i, "grade", e.target.value)}>
              {GRADES.map((g) => (<option key={g.value} value={g.value}>{g.label}</option>))}
            </select>
          </div>
          <button type="button" className="btn secondary" onClick={() => removeCourse(i)} disabled={courses.length <= 1}>Remove</button>
        </div>
      ))}
      <div className="toolbar"><button type="button" className="btn secondary" onClick={addCourse}>Add course</button><button type="button" className="btn" onClick={calc}>Calculate CGPA</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <div className="output">{result}</div>}
      {result && <div className="toolbar"><button type="button" className="btn secondary" onClick={() => copy(result)}>Copy result</button></div>}
      {msg && <p className="success" role="status">{msg}</p>}
      <p>Example: 3 credit hours at A (4.0), 3 at B+ (3.3) and 4 at A− (3.7) → (12 + 9.9 + 14.8) ÷ 10 = CGPA 3.67.</p>
    </div>
  );
}
