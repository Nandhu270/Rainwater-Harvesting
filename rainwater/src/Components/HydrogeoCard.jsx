// components/HydrogeoCard.jsx
import React from "react";

export default function HydrogeoCard({ groundwaterData }) {
  const principal = groundwaterData?.aquiferType || "—";
  const pre = groundwaterData?.regionalDepth || groundwaterData?.preMonsoon || "—";
  const post = groundwaterData?.postMonsoon || "—";
  const depth = groundwaterData?.depthToWater || "—";

  // simple suitability short text
  const suitability = (() => {
    if (!depth || depth === "N/A" || isNaN(Number(depth))) return "Unknown - field check recommended";
    const d = Number(depth);
    if (d < 5) return "High (shallow water table)";
    if (d < 15) return "Moderate";
    return "Low (deep water table) — suitable for storage but recharge may need deeper wells";
  })();

  return (
    <div className="card p-3 shadow-sm">
      <h5>Hydrogeological Information</h5>

      <div className="mb-2">
        <label>Principal aquifer / rock type</label>
        <input className="form-control" readOnly value={principal} />
      </div>

      <div className="mb-2">
        <label>Depth to water table (m)</label>
        <input className="form-control" readOnly value={depth} />
      </div>

      <div className="mb-2">
        <label>Regional pre-monsoon / post-monsoon</label>
        <input className="form-control" readOnly value={`Pre: ${pre}, Post: ${post}`} />
      </div>

      <div className="text-muted">Recharge suitability: <strong>{suitability}</strong></div>
    </div>
  );
}
