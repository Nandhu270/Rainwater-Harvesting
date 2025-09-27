// components/RecommendedStructureCard.jsx
import React from "react";
import { jsPDF } from "jspdf";

/**
 * Recommended structure info + PDF download
 * Note: jsPDF is required for PDF generation (npm i jspdf)
 */

export default function RecommendedStructureCard({
  roofArea,
  rainfall,
  openSpaceArea,
  groundwaterData,
  fullName,
  dwellers,
  locationText,
  roofLatLng,
}) {
  const annualRainfallMM = (() => {
    if (!rainfall || isNaN(Number(rainfall))) return 0;
    const r = Number(rainfall);
    return r < 50 ? r * 365 : r;
  })();

  const annualRunoffM3 = (() => {
    const runoffCoeff = 0.85;
    return (roofArea * (annualRainfallMM / 1000) * runoffCoeff) || 0;
  })();

  const generatePdf = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFontSize(14);
    doc.text("Rainwater Harvesting Assessment Report", 14, 16);
    doc.setFontSize(11);
    doc.text(`Name: ${fullName || "—"}`, 14, 28);
    doc.text(`Dwellers: ${dwellers || "—"}`, 14, 34);
    doc.text(`Location: ${locationText || "—"}`, 14, 40);
    doc.text(`Roof area: ${roofArea?.toFixed?.(2) || "—"} m²`, 14, 46);
    doc.text(`Estimated annual rooftop runoff: ${annualRunoffM3.toFixed(2)} m³`, 14, 52);
    doc.text(`Estimated open space for recharge: ${openSpaceArea?.toFixed?.(2) || "—"} m²`, 14, 58);
    doc.text(`Groundwater depth (m): ${groundwaterData?.depthToWater || "—"}`, 14, 64);

    doc.setFontSize(10);
    doc.text("Recommendations:", 14, 76);
    doc.text("- Install rooftop capture with first-flush and leaf-screening.", 18, 82);
    doc.text(`- Recommended storage tank (approx): see dashboard value.`, 18, 88);
    doc.text(`- Recharge structure suggestion: ${groundwaterData?.aquiferType || "Evaluate site soils"}.`, 18, 94);

    doc.save(`RWH_Report_${fullName || "user"}.pdf`);
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5>Recommended Structure & Report</h5>

      <div className="mb-2">
        <label>Quick recommendation</label>
        <textarea
          className="form-control"
          rows={3}
          readOnly
          value={`Install rooftop capture with a filtered storage tank sized per runoff vs demand. Consider a percolation pit / recharge trench for open space.`}
        />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={generatePdf}>
          Download Detail Report (PDF)
        </button>
      </div>
    </div>
  );
}
