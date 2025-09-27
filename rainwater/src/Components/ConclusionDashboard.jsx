// components/ConclusionDashboard.jsx
import React from "react";
import SummaryCard from "./SummaryCard";
import RunoffCard from "./RunoffCard";
import GroundwaterRechargeCard from "./GroundwaterRechargeCard";
import HydrogeoCard from "./HydrogeoCard";
import RecommendedStructureCard from "./RecommendedStructureCard";
import CostBenefitCard from "./CostBenefitCard";

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
          <button className="btn btn-outline-secondary me-2" onClick={() => setStep(3)}>
            ⬅ Back
          </button>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-12">
          <SummaryCard
            fullName={fullName}
            dwellers={dwellers}
            roofArea={roofArea}
            rainfall={rainfall}
            openSpaceArea={openSpaceArea}
            groundwaterData={groundwaterData}
          />
        </div>

        <div className="col-md-6">
          <RunoffCard
            roofArea={roofArea}
            rainfall={rainfall}
            dwellers={dwellers}
          />
        </div>

        <div className="col-md-6">
          <GroundwaterRechargeCard
            roofArea={roofArea}
            rainfall={rainfall}
            openSpaceArea={openSpaceArea}
            groundwaterData={groundwaterData}
          />
        </div>

        <div className="col-md-6">
          <HydrogeoCard groundwaterData={groundwaterData} />
        </div>

        <div className="col-md-6">
          <RecommendedStructureCard
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

        <div className="col-md-12">
          <CostBenefitCard
            roofArea={roofArea}
            rainfall={rainfall}
            dwellers={dwellers}
          />
        </div>
      </div>
    </div>
  );
}
