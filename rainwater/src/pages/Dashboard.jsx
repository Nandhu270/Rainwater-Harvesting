import React, { useState } from "react";
import BasicInfoForm from "../Components/BasicInfoForm";
import RainfallStep from "../Components/RainfallStep";
import SiteConditionsStep from "../Components/SiteConditionsStep";
import ConclusionDashboard from "../Components/ConclusionDashboard";
import groundwaterJson from "../assets/water_levels.json";

export default function Dashboard() {
  const [step, setStep] = useState(1);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [dwellers, setDwellers] = useState(0);
  const [locationText, setLocationText] = useState("");
  const [mapCenter, setMapCenter] = useState(null);
  const [roofArea, setRoofArea] = useState(0);
  const [roofAreaDrawn, setRoofAreaDrawn] = useState(false);
  const [roofLatLng, setRoofLatLng] = useState(null);

  // Step 2
  const [rainfall, setRainfall] = useState(null);
  const [soilType, setSoilType] = useState("");

  // Step 3
  const [openSpaceArea, setOpenSpaceArea] = useState(0);
  const [openSpaceDrawn, setOpenSpaceDrawn] = useState(false);
  const [groundwaterData, setGroundwaterData] = useState({
    depthToWater: "",
    aquiferType: "",
    regionalDepth: "",
  });

  const findDistrictWater = (districtName) => {
    return (
      groundwaterJson.find(
        (entry) =>
          entry.DISTRICT &&
          entry.DISTRICT.toLowerCase() === districtName.toLowerCase()
      ) || null
    );
  };

  const steps = ["Basic Info", "Rainfall", "Site Conditions", "Conclusion"];

  return (
    <div className="dashboard-wrapper">
      <style>{`
        body { margin: 0; padding: 0; }
        .dashboard-wrapper { min-height: 100vh; background: linear-gradient(to bottom, #3b82f6, #60a5fa); display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; position: relative; overflow: hidden; }
        .raindrop { position: absolute; top: -20px; width: 6px; height: 16px; background: rgba(255, 255, 255, 0.7); border-radius: 50%; animation: fall 2s linear infinite; }
        .raindrop:nth-child(1) { left: 10%; animation-delay: 0s; }
        .raindrop:nth-child(2) { left: 30%; animation-delay: 0.5s; }
        .raindrop:nth-child(3) { left: 50%; animation-delay: 1s; }
        .raindrop:nth-child(4) { left: 70%; animation-delay: 1.2s; }
        .raindrop:nth-child(5) { left: 90%; animation-delay: 0.8s; }
        @keyframes fall { 0% { top: -20px; opacity: 0.5; } 50% { opacity: 1; } 100% { top: 100vh; opacity: 0; } }
        .leaf { position: absolute; width: 40px; height: 80px; background: #22c55e; border-radius: 50% 50% 0 0; transform: rotate(-45deg); opacity: 0.5; }
        .leaf::after { content: ''; position: absolute; width: 40px; height: 80px; background: #4ade80; border-radius: 50% 50% 0 0; transform: rotate(45deg); top: 0; left: 0; }
        .leaf1 { top: 50px; left: 10%; transform: rotate(-20deg) scale(1); }
        .leaf2 { top: 200px; right: 15%; transform: rotate(15deg) scale(1.2); }
        .leaf3 { bottom: 80px; left: 20%; transform: rotate(-10deg) scale(0.8); }
        .leaf4 { bottom: 150px; right: 25%; transform: rotate(25deg) scale(1.1); }
        .dashboard-container { max-width: 900px; width: 100%; font-family: 'Arial', sans-serif; position: relative; z-index: 2; }

        .dashboard-title { text-align: center; font-size: 26px; font-weight: bold; color: #ffffff; margin-bottom: 30px; background: rgba(0,0,0,0.2); padding: 12px 20px; border-radius: 10px; display: inline-block; }

        /* New Progress Indicator */
        .progress-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; position: relative; }
        .progress-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
        .progress-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; color: #fff; z-index: 2; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.3s ease; background: #93c5fd; }
        .circle-done { background: linear-gradient(135deg, #16a34a, #4ade80); }
        .circle-current { background: linear-gradient(135deg, #2563eb, #60a5fa); transform: scale(1.2); box-shadow: 0 0 15px #60a5fa; }
        .circle-upcoming { background: #93c5fd; opacity: 0.5; }
        .progress-line { position: absolute; top: 18px; left: 50%; width: 100%; height: 4px; z-index: 1; }
        .line-done { background: linear-gradient(90deg, #16a34a, #4ade80); }
        .line-upcoming { background: #cbd5e1; }
        .progress-label { margin-top: 8px; font-size: 12px; color: #e0f2fe; text-align: center; width: max-content; }
        .progress-label.active { color: #ffffff; font-weight: bold; }

        .step-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); border-radius: 15px; padding: 25px; box-shadow: 0 10px 25px rgba(34,197,94,0.2); transition: all 0.3s ease; animation: floatUpDown 4s ease-in-out infinite; display: flex; flex-direction: column; gap: 20px; }
        .step-card:hover { box-shadow: 0 15px 30px rgba(34,197,94,0.3); transform: translateY(-12px); }
        @keyframes floatUpDown { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .button-row { display: flex; justify-content: space-between; margin-top: 20px; }
        .btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s ease, transform 0.2s ease; }
        .btn-back { background: #e0f2fe; color: #1e40af; }
        .btn-back:hover { background: #bae6fd; transform: scale(1.05); }
      `}</style>

      {/* Raindrops */}
      <div className="raindrop"></div>
      <div className="raindrop"></div>
      <div className="raindrop"></div>
      <div className="raindrop"></div>
      <div className="raindrop"></div>

      {/* Leaves */}
      <div className="leaf leaf1"></div>
      <div className="leaf leaf2"></div>
      <div className="leaf leaf3"></div>
      <div className="leaf leaf4"></div>

      <div className="dashboard-container">
        <h2 className="dashboard-title">Rainwater Harvesting Assessment Dashboard</h2>

        {/* Progress Indicator */}
        <div className="progress-container">
          {steps.map((label, index) => (
            <div key={index} className="progress-step">
              <div className={`progress-circle ${
                step > index + 1 ? "circle-done" : step === index + 1 ? "circle-current" : "circle-upcoming"
              }`}>{index + 1}</div>

              {index < steps.length - 1 && (
                <div className={`progress-line ${
                  step > index + 1 ? "line-done" : "line-upcoming"
                }`}></div>
              )}

              <p className={`progress-label ${step === index + 1 ? "active" : ""}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Step Card */}
        <div className="step-card">
          {step === 1 && <BasicInfoForm fullName={fullName} setFullName={setFullName} dwellers={dwellers} setDwellers={setDwellers} locationText={locationText} setLocationText={setLocationText} mapCenter={mapCenter} setMapCenter={setMapCenter} roofArea={roofArea} setRoofArea={setRoofArea} roofAreaDrawn={roofAreaDrawn} setRoofAreaDrawn={setRoofAreaDrawn} roofLatLng={roofLatLng} setRoofLatLng={setRoofLatLng} setStep={setStep} setRainfall={setRainfall} />}
          {step === 2 && <RainfallStep roofArea={roofArea} rainfall={rainfall} setStep={setStep} />}
          {step === 3 && <SiteConditionsStep mapCenter={mapCenter} openSpaceArea={openSpaceArea} setOpenSpaceArea={setOpenSpaceArea} openSpaceDrawn={openSpaceDrawn} setOpenSpaceDrawn={setOpenSpaceDrawn} groundwaterData={groundwaterData} setGroundwaterData={setGroundwaterData} groundwaterJson={groundwaterJson} setStep={setStep} locationText={locationText} roofLatLng={roofLatLng} soilType={soilType} setSoilType={setSoilType} findDistrictWater={findDistrictWater} />}
          {step === 4 && <ConclusionDashboard fullName={fullName} dwellers={Number(dwellers)} locationText={locationText} roofArea={Number(roofArea)} rainfall={rainfall} openSpaceArea={Number(openSpaceArea)} groundwaterData={groundwaterData} roofLatLng={roofLatLng} setStep={setStep} />}
        </div>
      </div>
    </div>
  );
}
