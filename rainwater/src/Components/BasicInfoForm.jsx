import React, { useState } from "react";
import LocationPlannerMap from "./LocationPlannerMap";

export default function BasicInfoForm({
  fullName,
  setFullName,
  dwellers,
  setDwellers,
  locationText,
  setLocationText,
  mapCenter,
  setMapCenter,
  roofArea,
  setRoofArea,
  roofAreaDrawn,
  setRoofAreaDrawn,
  roofLatLng,
  setRoofLatLng,
  setStep,
  setRainfall,
}) {
  const [status, setStatus] = useState("Enter location details to view the map.");

  // Geocoding
  const handleLocationSearch = async () => {
    if (!locationText) return;
    setStatus("Searching address...");
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        locationText
      )}&format=json&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        const newCenter = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setMapCenter(newCenter);
        setStatus("Location found! Draw roof area on map.");
      } else setStatus("Location not found.");
    } catch {
      setStatus("Error fetching location.");
    }
  };

  // Use My Location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setMapCenter([lat, lon]);

        try {
          const revUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
          const res = await fetch(revUrl);
          const data = await res.json();

          if (data.address) {
            const district =
              data.address.county ||
              data.address.city_district ||
              data.address.city;
            const state = data.address.state;
            const country = data.address.country;
            const road = data.address.road || "";
            const suburb = data.address.suburb || "";

            setLocationText(`${road} ${suburb}, ${district}, ${state}, ${country}`);
          } else {
            setLocationText(data.display_name);
          }
        } catch {
          setLocationText(`${lat}, ${lon}`);
        }

        setStatus("Live location set! Draw roof area on map.");
      },
      (err) => setStatus(`Error: ${err.message}`)
    );
  };

  // Next
  const handleNext = async () => {
    if (!fullName || !dwellers) return alert("Enter name & dwellers.");
    if (!mapCenter) return alert("Set location first.");
    if (!roofAreaDrawn) return alert("Draw roof area first.");

    // Fetch rainfall
    try {
      const today = new Date().toISOString().split("T")[0];
      const start = "2020-01-01";
      const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${mapCenter[0]}&longitude=${mapCenter[1]}&start_date=${start}&end_date=${today}&daily=precipitation_sum&timezone=Asia/Kolkata`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.daily?.precipitation_sum) {
        const avg =
          data.daily.precipitation_sum.reduce((a, b) => a + b, 0) /
          data.daily.precipitation_sum.length;
        setRainfall(avg.toFixed(2));
      }
    } catch {
      setRainfall("Error");
    }

    setStep(2);
  };

  return (
    <>
      <p style={{ color: mapCenter ? "#28a745" : "#007bff" }}>{status}</p>
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h3>Basic Info</h3>

            <div className="mb-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Number of Dwellers</label>
              <input
                type="number"
                className="form-control"
                value={dwellers}
                onChange={(e) => setDwellers(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-primary" onClick={handleLocationSearch}>
                  🔍 Search
                </button>
                <button className="btn btn-success" onClick={handleUseMyLocation}>
                  📍 Use My Location
                </button>
              </div>
            </div>

            <button className="btn btn-primary w-100" onClick={handleNext}>
              Next ➡
            </button>
          </div>
        </div>

        <div className="col-md-8">
          {mapCenter ? (
            <>
              <LocationPlannerMap
                center={mapCenter}
                onAreaCalculated={(area, latLng) => {
                  setRoofArea(area);
                  setRoofAreaDrawn(true);
                  setRoofLatLng(latLng); // ✅ save centroid
                }}
              />
              <h5 className="mt-2">Roof Area: {roofArea ? roofArea.toFixed(2) : 0} sq.m</h5>
            </>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center border border-secondary"
              style={{ height: "500px" }}
            >
              Map: Set location to begin planning.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
