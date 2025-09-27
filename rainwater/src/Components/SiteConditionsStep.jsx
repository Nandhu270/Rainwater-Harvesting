
import React, { useEffect, useState } from "react";
import LocationPlannerMap from "./LocationPlannerMap";

export default function SiteConditionsStep({
  mapCenter,
  openSpaceArea,
  setOpenSpaceArea,
  openSpaceDrawn,
  setOpenSpaceDrawn,
  groundwaterData,
  setGroundwaterData,
  groundwaterJson,
  locationText,
  roofLatLng,
  setStep,
  soilType,
  setSoilType,
  findDistrictWater,
}) {
  const [localMessage, setLocalMessage] = useState("");

  // Try to auto-populate groundwater info from roofLatLng if available
  useEffect(() => {
    if (roofLatLng && groundwaterJson) {
      // simple nearest-by-latitude lookup (fallback)
      const water = groundwaterJson.find(
        (entry) =>
          entry.LATITUDE &&
          Math.abs(Number(entry.LATITUDE) - Number(roofLatLng[0])) < 0.05
      );
      if (water) {
        setGroundwaterData({
          depthToWater: water["WL(mbgl)"] || water.WL || "N/A",
          aquiferType: water.BLOCK || "-",
          regionalDepth: water.VILLAGE || "-",
        });
      } else {
        // leave as-is if not found
        setGroundwaterData({
          ...groundwaterData,
          depthToWater: groundwaterData?.depthToWater || "N/A",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roofLatLng]);

  const handleShowConclusion = () => {
    // Validate all required inputs in SiteConditionsStep
    const missing = [];
    if (!soilType) missing.push("Soil Type");
    if (!openSpaceDrawn || !openSpaceArea || openSpaceArea <= 0)
      missing.push("Available Open Space (draw on map)");
    const depth = groundwaterData?.depthToWater;
    if (!depth || depth === "N/A" || isNaN(Number(depth))) missing.push("Depth to water table (m)");

    if (missing.length > 0) {
      const msg = `Please provide: ${missing.join(", ")}. See Hydrogeology panel for guidance.`;
      setLocalMessage(msg);
      // also make HydrogeoCard aware via groundwaterData: we'll keep as is and HydrogeoCard will display guidance
      return;
    }
    // All good
    setLocalMessage("");
    setStep(4);
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4>Site Conditions</h4>

      {localMessage && <div className="alert alert-warning">{localMessage}</div>}

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label>Available Open Space (sq.m)</label>
            <input
              type="text"
              className="form-control"
              value={openSpaceDrawn ? openSpaceArea.toFixed(2) : ""}
              readOnly
            />
            <small className="text-muted">Draw on map to set this value.</small>
          </div>

          <div className="mb-3">
            <label>Depth to Water Table (m)</label>
            <input
              type="text"
              className="form-control"
              value={groundwaterData?.depthToWater || ""}
              readOnly
            />
          </div>

          {/* Soil Type dropdown */}
          <div className="mb-3">
            <label>Soil Type</label>
            <select
              className="form-control"
              value={soilType || ""}
              onChange={(e) => setSoilType(e.target.value)}
            >
              <option value="">-- Select Soil Type --</option>
              <option value="Sandy Soil">Sandy Soil</option>
              <option value="Clay Soil">Clay Soil</option>
              <option value="Silt Soil">Silt Soil</option>
              <option value="Loamy Soil">Loamy Soil</option>
              <option value="Black Cotton Soil">Black Cotton Soil</option>
              <option value="Alluvial Soil">Alluvial Soil</option>
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>
              ⬅ Previous
            </button>
            <button className="btn btn-primary" onClick={handleShowConclusion}>
              Show Conclusion ➡
            </button>
          </div>
        </div>

        <div className="col-md-6">
          {mapCenter ? (
            <LocationPlannerMap
              center={mapCenter}
              onAreaCalculated={(area /* m2 */, latLng) => {
                setOpenSpaceArea(area);
                setOpenSpaceDrawn(true);
              }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center border border-secondary"
              style={{ height: "400px" }}
            >
              Map: Set location first
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
