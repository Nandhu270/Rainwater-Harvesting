import React, { useMemo } from "react";

export default function SummaryCard({
  fullName,
  dwellers,
  roofArea,
  rainfall,
  openSpaceArea,
  groundwaterData,
}) {
  const annualRainfallMM = useMemo(() => {
    if (!rainfall || isNaN(Number(rainfall))) return 0;
    const r = Number(rainfall);
    if (r < 50) return r * 365;
    return r;
  }, [rainfall]);

  const suitability = useMemo(() => {
    const roofScore = Math.min(1, roofArea / 100); // 100 m2 ideal
    const rainScore = Math.min(1, annualRainfallMM / 1200);
    const spaceScore = Math.min(1, openSpaceArea / 200);
    const gwScore =
      groundwaterData?.depthToWater && !isNaN(Number(groundwaterData.depthToWater))
        ? Math.max(0, 1 - Number(groundwaterData.depthToWater) / 50)
        : 0.5;
    const score = 0.45 * roofScore + 0.35 * rainScore + 0.1 * spaceScore + 0.1 * gwScore;
    return Math.round(score * 100);
  }, [roofArea, annualRainfallMM, openSpaceArea, groundwaterData]);

  return (
    <div className="card p-3 shadow-sm">
      <h4>Summary & Suitability</h4>
      <p>
        <strong>Applicant:</strong> {fullName || "—"} <br />
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
        This score is an estimate based on roof area, annual rainfall, available open space, and groundwater depth.
      </small>
    </div>
  );
}
