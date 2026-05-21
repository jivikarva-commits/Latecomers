import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CareerTestResults() {
  const { state } = useLocation();
  const [data, setData] = useState(state?.result || null);

  useEffect(() => {
    if (!data) {
      api.get("/ai/career-test/latest").then(({ data: d }) => setData(d));
    }
  }, [data]);

  if (!data || !data.summary) {
    return <div className="p-6 text-center text-muted2">Loading results…</div>;
  }

  const scores = data.scores || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto" data-testid="career-test-results">
      <div className="bg-white rounded-3xl border border-line shadow-soft p-6 sm:p-10 text-center">
        <div className="w-16 h-16 rounded-2xl cc-logo-gradient mx-auto flex items-center justify-center text-white mb-4">
          <Sparkles size={26} />
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink">Your AI Results</h1>
        <p className="font-heading font-extrabold text-6xl text-brand mt-3">{data.overall}%</p>
        <p className="text-sm text-muted2 mt-2 max-w-xl mx-auto">{data.summary}</p>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(scores).map(([k, v]) => (
          <div key={k} className="bg-white rounded-2xl border border-line p-4">
            <p className="text-xs text-muted2 uppercase tracking-wider">{k}</p>
            <p className="text-2xl font-heading font-bold text-ink mt-1">{v}%</p>
            <div className="mt-2 h-2 bg-brand-50 rounded-full overflow-hidden">
              <div className="h-full bg-brand" style={{ width: `${v}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <h2 className="font-heading font-bold text-xl text-ink mb-3">Top 5 career matches</h2>
        <div className="space-y-3" data-testid="results-top-matches">
          {(data.topMatches || []).map((m, i) => (
            <Link
              to={`/careers/${m.careerSlug}`}
              key={m.careerSlug + i}
              className="flex items-center justify-between bg-white border border-line rounded-2xl p-4 hover:shadow-soft transition"
              data-testid={`match-${m.careerSlug}`}
            >
              <div>
                <p className="font-heading font-bold text-ink capitalize">{m.careerSlug.replace(/-/g, " ")}</p>
                <p className="text-xs text-muted2 mt-1">{(m.reasons || []).slice(0, 2).join(" · ")}</p>
              </div>
              <div className="text-right">
                <p className="text-brand font-bold">{m.matchPercent}%</p>
                <p className="text-xs text-muted2">match</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-7 text-center">
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-6 py-3.5 rounded-full shadow-brand"
          data-testid="results-explore-careers"
        >
          Explore careers <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
