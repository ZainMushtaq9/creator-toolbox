// Shared dev-mock responses for AI tasks.
// Used when NO provider key is configured. Deterministic template text,
// clearly labelled — never presented as live AI output.
export function mockResponse(task, input) {
  const topic = String(input?.topic || input?.keyword || input?.url || input?.prompt || "this page").slice(0, 120);
  const lines = {
    seoAnalysis: [
      "DEV MOCK — not a live AI result. No AI provider key is configured.",
      `For "${topic}": check the title, meta description and one H1 first, then the audit findings.`,
      "Run the deterministic page audit for evidence before acting on any recommendation.",
    ],
    competitorAnalysis: [
      "DEV MOCK — not a live AI result. No AI provider key is configured.",
      `For "${topic}": compare the public title, description, headings and word count with the competitor page.`,
    ],
    contentGeneration: [
      "DEV MOCK — not a live AI result. No AI provider key is configured.",
      `Outline for "${topic}": (1) direct answer, (2) how it works, (3) example, (4) limitations, (5) FAQ.`,
    ],
  };
  return (lines[task] || lines.seoAnalysis).join("\n");
}
