// import React, { useEffect } from "react";
// import LocationPlannerMap from "./LocationPlannerMap";

// export default function SiteConditionsStep({
//   mapCenter,
//   openSpaceArea,
//   setOpenSpaceArea,
//   openSpaceDrawn,
//   setOpenSpaceDrawn,
//   groundwaterData,
//   setGroundwaterData,
//   groundwaterJson,
//   locationText,
//   roofLatLng,
//   setStep,
// }) {
//   // Find nearest district using roofLatLng
//   const findDistrictWater = (latLng) => {
//     if (!groundwaterJson || !latLng) return null;

//     // Simple match: find first district where latitude is close
//     return (
//       groundwaterJson.find(
//         (entry) => Math.abs(entry.LATITUDE - latLng[0]) < 0.05
//       ) || null
//     );
//   };

//   // Auto-calculate groundwater data when component loads or roofLatLng changes
//   useEffect(() => {
//     if (roofLatLng) {
//       const waterData = findDistrictWater(roofLatLng);

//       if (waterData) {
//         setGroundwaterData({
//           depthToWater: waterData["WL(mbgl)"],
//           aquiferType: waterData.BLOCK || "-",
//           regionalDepth: waterData.VILLAGE || "-",
//         });
//       } else {
//         setGroundwaterData({
//           depthToWater: "N/A",
//           aquiferType: "-",
//           regionalDepth: "-",
//         });
//       }
//     }
//   }, [roofLatLng, groundwaterJson, setGroundwaterData]);

//   return (
//     <div className="card p-4 shadow-sm">
//       <h4>Site Conditions</h4>
//       <div className="row">
//         <div className="col-md-6">
//           <div className="mb-3">
//             <label>Available Open Space (sq.m)</label>
//             <input
//               type="text"
//               className="form-control"
//               value={openSpaceDrawn ? openSpaceArea.toFixed(2) : ""}
//               readOnly
//             />
//           </div>

//           <div className="mb-3">
//             <label>Depth to Water Table (m)</label>
//             <input
//               type="text"
//               className="form-control"
//               value={groundwaterData?.depthToWater || ""}
//               readOnly
//             />
//           </div>

//           <div className="mb-3">
//             <label>Principal Aquifer Type</label>
//             <input
//               type="text"
//               className="form-control"
//               value={"Basaltic lava Flows(Deccan Traps)"}
//               readOnly
//             />
//           </div>

//           <div className="mb-3">
//             <label>Regional Water Depth (Pre-Monsoon)</label>
//             <input
//               type="text"
//               className="form-control"
//               value={"5-20m"}
//               readOnly
//             />
//           </div>

//           <div className="d-flex justify-content-between">
//             <button
//               className="btn btn-outline-secondary"
//               onClick={() => setStep(2)}
//             >
//               ⬅ Previous
//             </button>

//             <button className="btn btn-primary" onClick={() => setStep(4)}>
//               Show Conclusion ➡
//             </button>
//           </div>
//         </div>

//         <div className="col-md-6">
//           {mapCenter ? (
//             <LocationPlannerMap
//               center={mapCenter}
//               onAreaCalculated={(area, latLng) => {
//                 setOpenSpaceArea(area);
//                 setOpenSpaceDrawn(true);
//               }}
//             />
//           ) : (
//             <div
//               className="d-flex align-items-center justify-content-center border border-secondary"
//               style={{ height: "400px" }}
//             >
//               Map: Set location first
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
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
  soilType,
  setSoilType, // ✅ setter for soil type (controlled by parent)
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

  // Auto-calculate groundwater when component loads or roofLatLng changes
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

          {/* ✅ Soil Type dropdown */}
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
            <button
              className="btn btn-outline-secondary"
              onClick={() => setStep(2)}
            >
              ⬅ Previous
            </button>

            <button className="btn btn-primary" onClick={() => setStep(4)}>
              Show Conclusion ➡
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
