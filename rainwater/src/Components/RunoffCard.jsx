
import React, { useMemo } from "react";

function synthesizeMonthlyDistribution(annualMm) {
  const pattern = [0.02, 0.03, 0.05, 0.05, 0.10, 0.25, 0.20, 0.15, 0.08, 0.03, 0.02, 0.02];
  const sum = pattern.reduce((a, b) => a + b, 0);
  return pattern.map((p) => (p / sum) * annualMm);
}

export default function RunoffCard({ roofArea = 0, rainfall, dwellers = 0 }) {
  const annualRainfallMM = useMemo(() => {
    if (!rainfall || isNaN(Number(rainfall))) return 0;
    const r = Number(rainfall);
    if (r < 50) return r * 365;
    return r;
  }, [rainfall]);

  const runoffCoeff = 0.85;

  const annualRunoffM3 = useMemo(() => {
    const annualRainM = annualRainfallMM / 1000;
    return roofArea * annualRainM * runoffCoeff;
  }, [roofArea, annualRainfallMM]);

  const perCapitaLpd = 135;
  const annualConsumptionM3 = (dwellers * perCapitaLpd * 365) / 1000;

  const recommendedStorageM3 = useMemo(() => {
    const a = annualRunoffM3 * 0.15;
    const b = annualConsumptionM3 * 0.3;
    return Math.max(0.5, Math.min(a || b, Math.max(0.5, b)));
  }, [annualRunoffM3, annualConsumptionM3]);

  const monthlyMm = useMemo(() => synthesizeMonthlyDistribution(annualRainfallMM), [annualRainfallMM]);

  const monthlyRunoffM3 = useMemo(
    () => monthlyMm.map((mm) => (mm / 1000) * roofArea * runoffCoeff),
    [monthlyMm, roofArea]
  );

  return (
    <div className="card p-3 shadow-sm">
      <h5>Rooftop Runoff Engine</h5>
      <div className="mb-2">
        <strong>Annual potential rooftop runoff:</strong> {annualRunoffM3 ? `${annualRunoffM3.toFixed(2)} m³` : "N/A"}
      </div>
      <div className="mb-2">
        <strong>Recommended storage tank (heuristic):</strong> {recommendedStorageM3 ? `${recommendedStorageM3.toFixed(2)} m³` : "N/A"}
      </div>

      <div className="mb-3">
        <label>Monthly rooftop runoff potential (m³)</label>
        <div style={{ height: 140, padding: "8px 6px", border: "1px solid #eee", borderRadius: 6 }}>
          <svg width="100%" height="120" viewBox="0 0 600 120" preserveAspectRatio="none">
            {monthlyRunoffM3.map((val, i) => {
              const x = (i * 600) / 12 + 10;
              const w = 34;
              const max = Math.max(...monthlyRunoffM3, 0.001);
              const h = (val / max) * 100;
              const y = 110 - h;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={w} height={h} rx="3" />
                  <text x={x + w / 2} y={115} fontSize="9" textAnchor="middle">
                    {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <small className="text-muted">Bars are proportional — use exact numbers above for calculation.</small>
      </div>
    </div>
  );
}
