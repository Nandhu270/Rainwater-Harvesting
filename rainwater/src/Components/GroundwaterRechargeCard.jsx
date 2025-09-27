// components/GroundwaterRechargeCard.jsx
import React, { useMemo } from "react";

/**
 * Groundwater recharge engine:
 * - Uses available open space area (m2) to estimate infiltration recharge
 * - rechargeEfficiency accounts for infiltration & design; default 0.5 (50% of rainfall over recharge area ends up recharging)
 */

export default function GroundwaterRechargeCard({
  roofArea = 0,
  rainfall,
  openSpaceArea = 0,
  groundwaterData,
}) {
  const annualRainfallMM = useMemo(() => {
    if (!rainfall || isNaN(Number(rainfall))) return 0;
    const r = Number(rainfall);
    if (r < 50) return r * 365;
    return r;
  }, [rainfall]);

  const rechargeEfficiency = 0.5; // assumption

  const annualRechargeM3 = useMemo(() => {
    const mm = annualRainfallMM;
    const m = mm / 1000;
    return openSpaceArea * m * rechargeEfficiency;
  }, [openSpaceArea, annualRainfallMM]);

  const recommendedRechargeStructure = useMemo(() => {
    // If depth to water is shallow (<10 m) prefer recharge pits; else recharge wells
    const d = Number(groundwaterData?.depthToWater);
    if (!isFinite(d)) return "Percolation pit / recharge trench (local evaluation recommended)";
    if (d <= 10) return "Percolation pit / shallow recharge trench";
    return "Recharge well (engineered) with filter media";
  }, [groundwaterData]);

  return (
    <div className="card p-3 shadow-sm">
      <h5>Groundwater Recharge Engine</h5>

      <div className="mb-2">
        <strong>Annual potential recharge (from open space):</strong>{" "}
        {annualRechargeM3 ? `${annualRechargeM3.toFixed(2)} m³` : "N/A"}
      </div>

      <div className="mb-2">
        <strong>Recommended recharge structure:</strong> {recommendedRechargeStructure}
      </div>

      <div className="mb-2 text-muted">
        Assumptions: {rechargeEfficiency * 100}% effective infiltration on open space. Local site soils and
        geology will affect real recharge — carry out infiltration tests before final design.
      </div>
    </div>
  );
}
