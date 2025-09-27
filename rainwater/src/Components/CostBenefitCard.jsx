// components/CostBenefitCard.jsx
import React, { useState, useMemo } from "react";

/**
 * Cost-benefit:
 * - Let user input material, labour, misc prices
 * - compute total initial investment
 * - estimate annual savings:
 *    - reduced municipal water: use stored volume * price_per_kL
 *    - reduced tanker cost: a fixed assumed saving
 * - compute payback = initial / annualSavings
 *
 * All numbers are editable. Defaults are assumptions; adjust to local prices.
 */

export default function CostBenefitCard({ roofArea, rainfall, dwellers }) {
  // defaults (INR) - change as needed
  const [materialPrice, setMaterialPrice] = useState(30000); // materials for tank & fittings
  const [labourPrice, setLabourPrice] = useState(8000);
  const [miscPrice, setMiscPrice] = useState(2000);
  const [waterPricePerKL, setWaterPricePerKL] = useState(30); // INR per 1000 L
  const [tankerSavingAnnual, setTankerSavingAnnual] = useState(0); // if user pays tankers, enter expected saving

  // derive runoff and recommended storage as in RunoffCard
  const annualRainfallMM = useMemo(() => {
    if (!rainfall || isNaN(Number(rainfall))) return 0;
    const r = Number(rainfall);
    return r < 50 ? r * 365 : r;
  }, [rainfall]);

  const runoffCoeff = 0.85;
  const annualRunoffM3 = useMemo(() => {
    return (roofArea * (annualRainfallMM / 1000) * runoffCoeff) || 0;
  }, [roofArea, annualRainfallMM]);

  // storage we'll suppose recommended as 15% of annual runoff
  const recommendedStorageM3 = Math.max(0.5, annualRunoffM3 * 0.15);

  const initialInvestment = materialPrice + labourPrice + miscPrice;

  // annual savings: estimate how much of storage can offset paid water use
  const perCapitaLpd = 135;
  const annualConsumptionM3 = (dwellers * perCapitaLpd * 365) / 1000;
  // assume usable harvested volume per year equals annual runoff but only a fraction is usable for supply
  const usableFromHarvestM3 = Math.min(annualRunoffM3, annualConsumptionM3) * 0.6; // 60% usable
  const reducedMunicipalCost = (usableFromHarvestM3 * 1000 / 1000) * waterPricePerKL; // m3->kL * price
  const annualSavings = reducedMunicipalCost + Number(tankerSavingAnnual || 0);

  const paybackYears = annualSavings > 0 ? (initialInvestment / annualSavings) : null;

  return (
    <div className="card p-3 shadow-sm">
      <h5>Cost–Benefit Analysis</h5>

      <div className="row">
        <div className="col-md-4">
          <label>Materials (INR)</label>
          <input className="form-control" type="number" value={materialPrice} onChange={(e) => setMaterialPrice(Number(e.target.value))} />
        </div>

        <div className="col-md-4">
          <label>Labour (INR)</label>
          <input className="form-control" type="number" value={labourPrice} onChange={(e) => setLabourPrice(Number(e.target.value))} />
        </div>

        <div className="col-md-4">
          <label>Misc (INR)</label>
          <input className="form-control" type="number" value={miscPrice} onChange={(e) => setMiscPrice(Number(e.target.value))} />
        </div>
      </div>

      <hr />

      <div className="mb-2">
        <strong>Initial investment:</strong> ₹{initialInvestment.toLocaleString()}
      </div>

      <div className="mb-2">
        <label>Water price (INR / kL)</label>
        <input className="form-control" type="number" value={waterPricePerKL} onChange={(e) => setWaterPricePerKL(Number(e.target.value))} />
      </div>

      <div className="mb-2">
        <label>Expected annual tanker-savings (INR)</label>
        <input className="form-control" type="number" value={tankerSavingAnnual} onChange={(e) => setTankerSavingAnnual(Number(e.target.value))} />
      </div>

      <hr />

      <div className="mb-2">
        <strong>Estimated annual harvest usable:</strong> {usableFromHarvestM3 ? `${usableFromHarvestM3.toFixed(2)} m³` : "0 m³"}
      </div>

      <div className="mb-2">
        <strong>Estimated annual savings:</strong> ₹{annualSavings ? annualSavings.toFixed(0) : "0"}
      </div>

      <div className="mb-2">
        <strong>Payback period:</strong>{" "}
        {paybackYears ? `${paybackYears.toFixed(1)} years` : "Infinite / no savings entered"}
      </div>

      <small className="text-muted">
        Notes: All numbers are estimates. Adjust material/labour/misc prices and water prices for a realistic
        local estimate. Tanks, first-flush devices, and maintenance are not fully itemised here.
      </small>
    </div>
  );
}
