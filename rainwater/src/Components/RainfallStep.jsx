
import React from "react";

export default function RainfallStep({ roofArea, rainfall, setStep }) {
  return (
    <div className="card p-4 shadow-sm">
      <h4>Results</h4>

      <div className="mb-3">
        <label>Roof Area (sq.m)</label>
        <input
          type="text"
          className="form-control"
          value={roofArea?.toFixed?.(2) ?? "0.00"}
          readOnly
        />
      </div>

      <div className="mb-3">
        <label>Average Annual Rainfall (mm)</label>
        <input type="text" className="form-control" value={rainfall || ""} readOnly />
        <small className="text-muted">
          If rainfall is missing the next step will still allow manual entry.
        </small>
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
          ⬅ Previous
        </button>
        <button className="btn btn-primary" onClick={() => setStep(3)}>
          Next ➡
        </button>
      </div>
    </div>
  );
}
