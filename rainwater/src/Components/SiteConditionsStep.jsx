import React, { useEffect } from "react";
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
}) {
  // Find nearest district using roofLatLng
  const findDistrictWater = (latLng) => {
    if (!groundwaterJson || !latLng) return null;

    // Simple match: find first district where latitude is close
    return (
      groundwaterJson.find(
        (entry) => Math.abs(entry.LATITUDE - latLng[0]) < 0.05
      ) || null
    );
  };

  // Auto-calculate groundwater data when component loads or roofLatLng changes
  useEffect(() => {
    if (roofLatLng) {
      const waterData = findDistrictWater(roofLatLng);

      if (waterData) {
        setGroundwaterData({
          depthToWater: waterData["WL(mbgl)"],
          aquiferType: waterData.BLOCK || "-",
          regionalDepth: waterData.VILLAGE || "-",
        });
      } else {
        setGroundwaterData({
          depthToWater: "N/A",
          aquiferType: "-",
          regionalDepth: "-",
        });
      }
    }
  }, [roofLatLng, groundwaterJson, setGroundwaterData]);

  return (
    <div className="card p-4 shadow-sm">
      <h4>Site Conditions</h4>
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

          <div className="mb-3">
            <label>Principal Aquifer Type</label>
            <input
              type="text"
              className="form-control"
              value={"Basaltic lava Flows(Deccan Traps)"}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label>Regional Water Depth (Pre-Monsoon)</label>
            <input
              type="text"
              className="form-control"
              value={"5-20m"}
              readOnly
            />
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>
              ⬅ Previous
            </button>
          </div>
        </div>

        <div className="col-md-6">
          {mapCenter ? (
            <LocationPlannerMap
              center={mapCenter}
              onAreaCalculated={(area, latLng) => {
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
