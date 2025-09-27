
import React, { useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import * as L from "leaflet";
import * as turf from "@turf/turf";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeView({ center }) {
  const map = useMap();
  if (center && center.length === 2 && map) {
    map.setView(center, map.getZoom() || 15);
  }
  return null;
}

function MapControls({ onAreaCalculated }) {
  const onCreated = (e) => {
    const layer = e.layer;
    if (e.layerType === "polygon" || e.layerType === "rectangle") {
      const geoJsonData = layer.toGeoJSON();
      const areaSqMeters = turf.area(geoJsonData);
      const centroid = turf.centroid(geoJsonData).geometry.coordinates; // [lng, lat]
      const [lng, lat] = centroid;
      onAreaCalculated(areaSqMeters, [lat, lng]);
    }
  };

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={onCreated}
        edit={{ featureGroup: new L.FeatureGroup() }}
        draw={{
          polygon: { showArea: true },
          rectangle: true,
          polyline: false,
          circlemarker: false,
          circle: false,
          marker: false,
        }}
      />
    </FeatureGroup>
  );
}

export default function LocationPlannerMap({ center, onAreaCalculated }) {
  const memoizedCenter = useMemo(() => center, [center]);
  const mapRef = useRef(null);
  const setRef = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <MapContainer
        center={memoizedCenter}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "500px", width: "100%", border: "1px solid #007bff" }}
        ref={setRef}
      >
        <ChangeView center={memoizedCenter} />
        <TileLayer
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker position={memoizedCenter} />
        <MapControls onAreaCalculated={onAreaCalculated} />
      </MapContainer>
    </div>
  );
}
