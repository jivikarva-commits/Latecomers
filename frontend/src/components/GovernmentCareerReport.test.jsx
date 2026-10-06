import React, { act } from "react";
import { createRoot } from "react-dom/client";
import GovernmentCareerReport from "./GovernmentCareerReport";

// CRA's Jest 27 resolver cannot read React Router 7's package exports.
// Routing is outside this presentational component test.
jest.mock("react-router-dom", () => ({ Link: ({ to, children }) => <a href={to}>{children}</a> }), { virtual: true });

test("shows source scope, qualifications and basic pay without generic AI statistics", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  const career = {title: "Bank Clerk", slug: "bank-clerk", governmentProfile: {
    scope: "IBPS", summary: "Clerical entry", reviewedAt: "2026-10-06", sourceCycle: "CSA XV reference",
    notice: "Check current notification", eligibility: ["Graduation required; Class 12 alone is not sufficient."],
    selection: ["Preliminary and main examinations"], pay: "Notified bank scale", payNote: "Basic pay is not take-home salary.",
    subjects: ["Numerical ability"], caution: "SBI recruitment is separate.",
    sources: [{kind: "official", label: "IBPS notification", url: "https://www.ibps.in", scope: "Recruitment authority"},
      {kind: "institute", label: "Institute reference", url: "https://sathee.iitk.ac.in", scope: "Published cross-check"}],
  }};
  try {
    await act(async () => root.render(<GovernmentCareerReport career={career} embedded />));
    expect(container.textContent).toContain("Graduation required");
    expect(container.textContent).toContain("CSA XV reference");
    expect(container.textContent).toContain("not direct confirmations");
    expect(container.textContent).toContain("Basic pay is not take-home");
    expect(container.textContent).not.toMatch(/89%|6–12 months|coding|LPA/);
    expect([...container.querySelectorAll('a[target="_blank"]')].map((a) => a.href)).toEqual(["https://www.ibps.in/", "https://sathee.iitk.ac.in/"]);
  } finally {
    await act(async () => root.unmount());
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  }
});
