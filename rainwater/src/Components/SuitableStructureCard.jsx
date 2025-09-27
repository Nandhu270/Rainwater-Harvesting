// Components/SuitableStructureCard.jsx
import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";


export default function SuitableStructureCard({
  roofArea = 0,
  rainfall = 0,
  openSpaceArea = 0,
  groundwaterData = {},
  fullName,
  dwellers,
  locationText,
  roofLatLng,
}) {
  const [materialCostPerM3, setMaterialCostPerM3] = useState(8000); // INR per m3 of tank (rough)
  const [labourPercent, setLabourPercent] = useState(0.25); // fraction of material cost
  const [waterPricePerKL, setWaterPricePerKL] = useState(30); // INR per kL

  const annualRainMM = useMemo(() => {
    if (!rainfall || isNaN(Number(rainfall))) return 0;
    const r = Number(rainfall);
    return r < 50 ? r * 365 : r;
  }, [rainfall]);

  const annualRunoffM3 = useMemo(() => {
    const runoffCoeff = 0.85;
    return roofArea * (annualRainMM / 1000) * runoffCoeff;
  }, [roofArea, annualRainMM]);

  const recommendedStructure = useMemo(() => {
    // heuristics:
    // small roof (<30 m2) -> small storage (1-3 m3) + rain barrel
    // medium (30-150) -> 3-10 m3 tank + some recharge
    // large (>150) -> tank + recharge pit/well depending on open space
    if (roofArea <= 30) return { type: "Small rain barrel / 1–3 m³ tank", sizeM3: Math.min(3, Math.max(1, annualRunoffM3 * 0.05)) };
    if (roofArea <= 150) {
      const size = Math.min(10, Math.max(3, annualRunoffM3 * 0.1));
      return { type: "Medium storage tank + percolation pit", sizeM3: size };
    }
    // roofArea > 150
    const size = Math.min(30, Math.max(10, annualRunoffM3 * 0.15));
    const recharge = openSpaceArea > 20 ? "Recharge pit + tank" : "Large tank + engineered recharge well";
    return { type: `Large storage (${recharge})`, sizeM3: size };
  }, [roofArea, annualRunoffM3, openSpaceArea]);

  const costEstimate = useMemo(() => {
    const material = (recommendedStructure.sizeM3 || 1) * materialCostPerM3;
    const labour = material * labourPercent;
    const misc = 2000;
    const design = 3000;
    return Math.round(material + labour + misc + design);
  }, [recommendedStructure, materialCostPerM3, labourPercent]);

  const annualSavings = useMemo(() => {
    // usable fraction of annual runoff that offsets purchased water
    const usable = Math.min(annualRunoffM3 * 0.6, (dwellers * 135 * 365) / 1000);
    const savings = (usable * 1000 / 1000) * waterPricePerKL; // m3->kL
    return Math.round(savings || 0);
  }, [annualRunoffM3, dwellers, waterPricePerKL]);

  const benefitsText = `Estimated annual water savings: ~₹${annualSavings} (based on ${Math.max(0, (annualRunoffM3 * 0.6).toFixed(2))} m³ usable harvest). Non-monetary benefits: improved water security, reduced dependency on tanker water, recharge to local aquifer.`;

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
    doc.text(`Suggested RWH type: ${recommendedStructure.type}`, 14, 70);
    doc.text(`Suggested storage (approx): ${recommendedStructure.sizeM3?.toFixed?.(2) || "—"} m³`, 14, 76);
    doc.text(`Estimated implementation cost: ₹${costEstimate}`, 14, 82);
    doc.text("Benefits:", 14, 92);
    const splitBenefits = doc.splitTextToSize(benefitsText, 180);
    doc.setFontSize(10);
    doc.text(splitBenefits, 14, 98);
    // save
    const fname = `RWH_Report_${(fullName || "user").replace(/\s+/g, "_")}.pdf`;
    doc.save(fname);
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5>Suggested RWH Structure & Cost</h5>

      <div className="mb-2">
        <label>Suggested RWH Type</label>
        <input className="form-control" readOnly value={recommendedStructure.type} />
      </div>

      <div className="mb-2">
        <label>Suggested storage (m³)</label>
        <input
          className="form-control"
          readOnly
          value={recommendedStructure.sizeM3?.toFixed?.(2) || "—"}
        />
      </div>

      <div className="mb-2">
        <label>Estimated implementation cost (INR)</label>
        <input className="form-control" readOnly value={`₹${costEstimate}`} />
      </div>

      <div className="mb-2">
        <label>Estimated annual benefits</label>
        <textarea className="form-control" rows={3} readOnly value={benefitsText} />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={generatePdf}>
          Download Detail Report (PDF)
        </button>
      </div>
    </div>
  );
}
