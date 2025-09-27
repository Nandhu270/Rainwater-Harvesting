import React from "react";
import SummaryCard from "./SummaryCard";
import RunoffCard from "./RunoffCard";
import GroundwaterRechargeCard from "./GroundwaterRechargeCard";
import HydrogeoCard from "./HydrogeoCard";
import SuitableStructureCard from "./SuitableStructureCard";

export default function ConclusionDashboard({
  fullName,
  dwellers,
  locationText,
  roofArea,
  rainfall,
  openSpaceArea,
  groundwaterData,
  roofLatLng,
  setStep,
}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Assessment & Recommendations</h3>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setStep(3)}
          >
            ⬅ Back
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Full-width Summary */}
        <div className="col-12">
          <SummaryCard
            fullName={fullName}
            dwellers={dwellers}
            roofArea={roofArea}
            rainfall={rainfall}
            openSpaceArea={openSpaceArea}
            groundwaterData={groundwaterData}
          />
        </div>

        {/* Half-width cards */}
        <div className="col-md-6 d-flex">
          <RunoffCard
            roofArea={roofArea}
            rainfall={rainfall}
            dwellers={dwellers}
          />
        </div>

        <div className="col-md-6 d-flex">
          <GroundwaterRechargeCard
            roofArea={roofArea}
            rainfall={rainfall}
            openSpaceArea={openSpaceArea}
            groundwaterData={groundwaterData}
          />
        </div>

        <div className="col-md-6 d-flex">
          <HydrogeoCard groundwaterData={groundwaterData} rainfall={rainfall} />
        </div>

        <div className="col-md-6 d-flex">
          <SuitableStructureCard
            roofArea={roofArea}
            rainfall={rainfall}
            openSpaceArea={openSpaceArea}
            groundwaterData={groundwaterData}
            fullName={fullName}
            dwellers={dwellers}
            locationText={locationText}
            roofLatLng={roofLatLng}
          />
        </div>
      </div>
    </div>
  );
}
