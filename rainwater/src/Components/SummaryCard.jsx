// components/SummaryCard.jsx
import React, { useMemo } from "react";

/**
 * Summary card - shows name and an overall suitability percentage
 * Assumptions (editable):
 *  - runoff coefficient: 0.85
 *  - more roof area, higher rainfall, and available open space increase suitability
 *  - shallow water table and permeable aquifer increase recharge suitability (separate)
 */
export default function SummaryCard({
  fullName,
  dwellers,
  roofArea,
  rainfall,
  openSpaceArea,
  groundwaterData,
}) {
  // compute approximate annual rainfall mm:
  // if rainfall looks like daily average (small number), convert to annual
  const annualRainfallMM = useMemo(() => {
    if (!rainfall || isNaN(Number(rainfall))) return 0;
    const r = Number(rainfall);
    // heuristic: if r < 50 assume it's daily mm -> convert to annual
    if (r < 50) return r * 365;
    return r;
  }, [rainfall]);

  const suitability = useMemo(() => {
    // score components 0..1
    const roofScore = Math.min(1, roofArea / 100); // 100 m2 or more is ideal
    const rainScore = Math.min(1, annualRainfallMM / 1200); // 1200 mm = very good
    const spaceScore = Math.min(1, openSpaceArea / 200);
    // groundwater doesn't majorly affect rooftop collection suitability, but shallow depth increases recharge suitability
    const gwScore =
      groundwaterData?.depthToWater && !isNaN(Number(groundwaterData.depthToWater))
        ? Math.max(0, 1 - Number(groundwaterData.depthToWater) / 50) // shallower => higher
        : 0.5;

    // weighted sum
    const score = 0.45 * roofScore + 0.35 * rainScore + 0.1 * spaceScore + 0.1 * gwScore;
    return Math.round(score * 100);
  }, [roofArea, annualRainfallMM, openSpaceArea, groundwaterData]);

  return (
    <div className="card p-3 shadow-sm">
      <h4>Summary & Suitability</h4>
      <p>
        <strong>Applicant:</strong> {fullName || "—"}
        <br />
        <strong>Dwellers:</strong> {dwellers || "—"}
      </p>

      <div className="mb-2">
        <label>Overall Rainwater Harvesting Suitability</label>
        <div className="progress" style={{ height: "26px" }}>
          <div
            className={`progress-bar ${suitability > 66 ? "bg-success" : suitability > 33 ? "bg-warning" : "bg-danger"}`}
            role="progressbar"
            style={{ width: `${suitability}%` }}
            aria-valuenow={suitability}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {suitability}%
          </div>
        </div>
      </div>

      <small className="text-muted">
        This score is an estimate based on roof area, annual rainfall, available open
        space, and groundwater depth. You can tune assumptions in the code for
        different locales.
      </small>
    </div>
  );
}
