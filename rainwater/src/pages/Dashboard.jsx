import React, { useState } from 'react';
import BasicInfoForm from '../Components/BasicInfoForm';
import LocationPlannerMap
 from '../Components/LocationPlannerMap';
// --- Dashboard Component (The Main Controller/Container) ---
export default function Dashboard() {
    // State to manage map visibility and centering
    const [mapCenter, setMapCenter] = useState(null); 
    const [calculatedArea, setCalculatedArea] = useState(0);
    const [status, setStatus] = useState('Enter location details to view the map.');

    // --- Geocoding Function (Forward Geocoding: Address to Lat/Lon) ---
    const handleLocationSearch = async (locationText) => {
        if (!locationText) return;
        setStatus('Searching for address...');
        // ... (rest of search logic remains the same)

        const encodedAddress = encodeURIComponent(locationText);
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

        try {
            const response = await fetch(nominatimUrl);
            const data = await response.json();

            if (data && data.length > 0) {
                const newCenter = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                setMapCenter(newCenter);
                setStatus(`Location found: ${data[0].display_name}. Use the map tool to draw your area.`);
            } else {
                setMapCenter(null);
                setStatus('Location not found. Please try a more specific search.');
            }
        } catch (error) {
            setMapCenter(null);
            setStatus('Error connecting to the search service.');
        }
    };

    // --- Geolocation Function (Browser GPS to Lat/Lon) ---
    const handleUseMyLocation = () => {
        setStatus('Getting live location...');
        
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newCenter = [pos.coords.latitude, pos.coords.longitude];
                
                // 🚀 CONSOLE LOG FOR CHECKING
                console.log('✅ Geolocation Successful!');
                console.log('Latitude:', newCenter[0]);
                console.log('Longitude:', newCenter[1]);
                console.log('Accuracy (meters):', pos.coords.accuracy);
                // --------------------------

                setMapCenter(newCenter);
                setStatus('Live location set! Draw your area on the map using the top-right tool.');
            },
            (err) => {
                console.error('❌ Geolocation Error:', err); // Log the error if it fails
                setMapCenter(null);
                setStatus(`Error: ${err.message}. Please allow location access in your browser.`);
            }
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '20px auto', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2>Rainwater Harvesting Assessment Dashboard</h2>
            
            <p style={{ fontWeight: 'bold', color: mapCenter ? '#28a745' : '#007bff' }}>
                {status}
            </p>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                
                {/* LEFT SIDE: The Form */}
                <BasicInfoForm 
                    onLocationSearch={handleLocationSearch} 
                    onUseMyLocation={handleUseMyLocation} 
                />

                {/* RIGHT SIDE: The Map View and Results */}
                <div style={{ flexGrow: 1, minWidth: '550px' }}>
                    {mapCenter ? (
                        <>
                            <LocationPlannerMap 
                                center={mapCenter} 
                                onAreaCalculated={setCalculatedArea} 
                            />
                            <h3 style={{ marginTop: '10px' }}>
                                Calculated Area (Roof Area): 
                                <span style={{ color: 'darkred' }}> 
                                    {calculatedArea.toFixed(2)} sq. meters
                                </span>
                            </h3>
                        </>
                    ) : (
                        <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #ccc' }}>
                            Map Area: Search a location or use GPS to begin planning.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}