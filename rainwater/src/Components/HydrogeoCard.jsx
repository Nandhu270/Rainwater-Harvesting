
import React from "react";

export default function HydrogeoCard({ groundwaterData, rainfall }) {
  const depth = groundwaterData?.depthToWater;
  const avgRainfall = (() => {
    if (!rainfall || isNaN(Number(rainfall))) return "Unknown";
    const r = Number(rainfall);
    return r < 50 ? `${(r * 365).toFixed(0)} mm (annual est.)` : `${r.toFixed(0)} mm (annual)`;
  })();

  const suitabilityText = (() => {
    if (!depth || depth === "N/A" || isNaN(Number(depth))) return "Unknown — please provide depth to water table in Site Conditions.";
    const d = Number(depth);
    if (d < 5) return "High (shallow water table) — good for percolation pits & shallow recharge";
    if (d < 15) return "Moderate — consider engineered recharge pits or medium-depth wells";
    return "Low (deep water table) — recharge wells may be required; storage recommended";
  })();

  const missingDepth = !depth || depth === "N/A" || isNaN(Number(depth));

  return (
    <div className="card p-3 shadow-sm">
      <h5>Hydrogeological Information</h5>

      <div className="mb-2">
        <label>Average Annual Rainfall</label>
        <input className="form-control" readOnly value={avgRainfall} />
      </div>

      <div className="mb-2">
        <label>Depth to water table (m)</label>
        <input className="form-control" readOnly value={depth || ""} />
      </div>

      <div className="mb-2">
        <label>Recharge suitability</label>
        <input className="form-control" readOnly value={suitabilityText} />
      </div>

      {missingDepth && (
        <div className="alert alert-warning mt-2">
          Depth to water table is missing or invalid. Draw open-space on the map, or enter groundwater data in Site Conditions. Field measurement (bore/handpump reading) recommended.
        </div>
      )}
      <small className="text-muted">This is a guidance panel — local investigations and infiltration tests recommended before building recharge structures.</small>
    </div>
  );
}
