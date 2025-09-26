import React, { useState } from "react";
import BasicInfoForm from "../Components/BasicInfoForm";
import RainfallStep from "../Components/RainfallStep";
import SiteConditionsStep from "../Components/SiteConditionsStep";
import groundwaterJson from "../assets/water_levels.json";

export default function Dashboard() {
  const [step, setStep] = useState(1);

  // --- Step 1 ---
  const [fullName, setFullName] = useState("");
  const [dwellers, setDwellers] = useState("");
  const [locationText, setLocationText] = useState("");
  const [mapCenter, setMapCenter] = useState(null);
  const [roofArea, setRoofArea] = useState(0);
  const [roofAreaDrawn, setRoofAreaDrawn] = useState(false);
  const [roofLatLng, setRoofLatLng] = useState(null); // ✅ store roof centroid

  // --- Step 2 ---
  const [rainfall, setRainfall] = useState(null);

  // --- Step 3 ---
  const [openSpaceArea, setOpenSpaceArea] = useState(0);
  const [openSpaceDrawn, setOpenSpaceDrawn] = useState(false);
  const [groundwaterData, setGroundwaterData] = useState({
    depthToWater: "",
    aquiferType: "",
    regionalDepth: "",
  });

  // --- District-level groundwater lookup ---
  const findDistrictWater = (districtName) => {
    return (
      groundwaterJson.find(
        (entry) => entry.DISTRICT.toLowerCase() === districtName.toLowerCase()
      ) || null
    );
  };

  return (
    <div className="container my-4">
      <h2>Rainwater Harvesting Assessment Dashboard</h2>

      {step === 1 && (
        <BasicInfoForm
          fullName={fullName}
          setFullName={setFullName}
          dwellers={dwellers}
          setDwellers={setDwellers}
          locationText={locationText}
          setLocationText={setLocationText}
          mapCenter={mapCenter}
          setMapCenter={setMapCenter}
          roofArea={roofArea}
          setRoofArea={setRoofArea}
          roofAreaDrawn={roofAreaDrawn}
          setRoofAreaDrawn={setRoofAreaDrawn}
          roofLatLng={roofLatLng}
          setRoofLatLng={setRoofLatLng} // ✅ pass to form
          setStep={setStep}
          setRainfall={setRainfall}
        />
      )}

      {step === 2 && (
        <RainfallStep roofArea={roofArea} rainfall={rainfall} setStep={setStep} />
      )}

      {step === 3 && (
        <SiteConditionsStep
          mapCenter={mapCenter}
          openSpaceArea={openSpaceArea}
          setOpenSpaceArea={setOpenSpaceArea}
          openSpaceDrawn={openSpaceDrawn}
          setOpenSpaceDrawn={setOpenSpaceDrawn}
          groundwaterJson={groundwaterJson}
          setGroundwaterData={setGroundwaterData}
          findDistrictWater={findDistrictWater}
          locationText={locationText}
          roofLatLng={roofLatLng} // ✅ use roofLatLng to detect district
          setStep={setStep}
          groundwaterData={groundwaterData}
        />
      )}
    </div>
  );
}
