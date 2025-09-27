
import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

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
  const [materialCostPerM3] = useState(8000);
  const [labourPercent] = useState(0.25);
  const [waterPricePerKL] = useState(30);

  // --- Calculations ---
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
    if (roofArea <= 30)
      return { type: "Small rain barrel / 1–3 m³ tank", sizeM3: Math.min(3, Math.max(1, annualRunoffM3 * 0.05)) };
    if (roofArea <= 150) {
      const size = Math.min(10, Math.max(3, annualRunoffM3 * 0.1));
      return { type: "Medium storage tank + percolation pit", sizeM3: size };
    }
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
    const usable = Math.min(annualRunoffM3 * 0.6, (dwellers * 135 * 365) / 1000);
    const savings = usable * waterPricePerKL;
    return Math.round(savings || 0);
  }, [annualRunoffM3, dwellers, waterPricePerKL]);

  const usableHarvestM3 = (annualRunoffM3 * 0.6).toFixed(2);
  const benefitsText = `Estimated annual water savings: ~₹${annualSavings.toLocaleString("en-IN")} (based on ${usableHarvestM3} m³ usable harvest). Non-monetary benefits: improved water security, reduced dependency on tanker water, recharge to local aquifer.`;

  // --- PDF Generation ---
  const generatePdf = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 16;
    const lineSpacing = 7;

    // --- Title ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Rainwater Harvesting Assessment Report", pageWidth / 2, y, { align: "center" });
    y += lineSpacing * 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // --- Personal Details ---
    const personalDetails = [
      `Name: ${fullName || "—"}`,
      `Dwellers: ${dwellers || "—"}`,
      `Location: ${locationText || "—"}`
    ];
    personalDetails.forEach(line => { doc.text(line, margin, y); y += lineSpacing; });
    y += 3;

    // --- Property Details ---
    doc.setFont("helvetica", "bold");
    doc.text("Property Details:", margin, y); y += lineSpacing;
    doc.setFont("helvetica", "normal");
    const propertyDetails = [
      `Roof area: ${roofArea?.toFixed(2) || "—"} m²`,
      `Estimated annual rooftop runoff: ${annualRunoffM3.toFixed(2)} m³`,
      `Estimated open space for recharge: ${openSpaceArea?.toFixed(2) || "—"} m²`,
      `Groundwater depth (m): ${groundwaterData?.depthToWater || "—"}`
    ];
    propertyDetails.forEach(line => { doc.text(line, margin, y); y += lineSpacing; });
    y += 3;

    // --- Recommended Structure ---
    doc.setFont("helvetica", "bold");
    doc.text("Recommended RWH Structure:", margin, y); y += lineSpacing;
    doc.setFont("helvetica", "normal");
    const formattedCost = costEstimate.toLocaleString("en-IN");
    const recommendation = [
      `Type: ${recommendedStructure.type}`,
      `Suggested storage (approx): ${recommendedStructure.sizeM3?.toFixed(2) || "—"} m³`,
      `Estimated implementation cost: ₹${formattedCost}`
    ];
    recommendation.forEach(line => { doc.text(line, margin, y); y += lineSpacing; });
    y += 3;

    // --- Benefits ---
    doc.setFont("helvetica", "bold");
    doc.text("Estimated Benefits:", margin, y); y += lineSpacing;
    doc.setFont("helvetica", "normal");
    const splitBenefits = doc.splitTextToSize(benefitsText, pageWidth - margin * 2);
    splitBenefits.forEach(line => { doc.text(line, margin, y); y += lineSpacing; });
    y += 5;

    // --- Annual Rainfall Chart ---
    const canvas = document.createElement("canvas");
    canvas.width = 500; canvas.height = 250;
    const ctx = canvas.getContext("2d");

    // Monthly rainfall
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyRainfall = Array(12).fill(rainfall / 12);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [{
          label: "Monthly Rainfall (mm)",
          data: monthlyRainfall,
          backgroundColor: "rgba(33, 150, 243, 0.7)",
          borderColor: "rgba(33, 150, 243, 1)",
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { grid: { display: false }, title: { display: true, text: "Months" } },
          y: { beginAtZero: true, title: { display: true, text: "Rainfall (mm)" } }
        }
      }
    });

    await new Promise(res => setTimeout(res, 100));
    const imgData = canvas.toDataURL("image/png");
    doc.setFont("helvetica", "bold");
    doc.text("Annual Rainfall Overview:", margin, y); y += lineSpacing;
    doc.addImage(imgData, "PNG", margin, y, pageWidth - margin * 2, 65);
    y += 70;

    // --- Save PDF ---
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
        <input className="form-control" readOnly value={recommendedStructure.sizeM3?.toFixed(2) || "—"} />
      </div>
      <div className="mb-2">
        <label>Estimated implementation cost (INR)</label>
        <input className="form-control" readOnly value={`₹${costEstimate.toLocaleString("en-IN")}`} />
      </div>
      <div className="mb-2">
        <label>Estimated annual benefits</label>
        <textarea className="form-control" rows={3} readOnly value={benefitsText} />
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={generatePdf}>Download Detail Report (PDF)</button>
      </div>
    </div>
  );
}
