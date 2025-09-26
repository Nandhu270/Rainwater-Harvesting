import React, { useState } from 'react';

export default function BasicInfoForm({ onLocationSearch, onUseMyLocation }) {
    const [fullName, setFullName] = useState('');
    const [locationText, setLocationText] = useState('');
    const [dwellers, setDwellers] = useState('');

    const styles = {
        container: {
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            maxWidth: '400px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' },
        input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
        buttonContainer: { display: 'flex', gap: '10px', marginTop: '10px' },
        button: { padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', flexGrow: 1, fontWeight: 'bold' },
        searchButton: { backgroundColor: '#007bff', color: 'white' },
        locationButton: { backgroundColor: '#28a745', color: 'white', flexGrow: 2 }
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        if (onLocationSearch) onLocationSearch(locationText);
    };
    
    const handleLocationClick = (e) => {
        e.preventDefault();
        if (onUseMyLocation) onUseMyLocation();
    };

    return (
        <div style={styles.container}>
            <h3>Basic Info & Map</h3>
            
            {/* Full Name Input */}
            <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={styles.input}
                />
            </div>

            {/* Location Search Input and Buttons */}
            <div style={styles.inputGroup}>
                <label style={styles.label}>Location</label>
                <input 
                    type="text" 
                    placeholder="Enter your location (e.g., Pune, 410005)" 
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    style={styles.input}
                />
                
                <div style={styles.buttonContainer}>
                    <button 
                        style={{...styles.button, ...styles.searchButton}}
                        onClick={handleSearchClick}
                    >
                        🔍 Search
                    </button>

                    <button 
                        style={{...styles.button, ...styles.locationButton}}
                        onClick={handleLocationClick}
                    >
                        📍 Use My Location & Draw
                    </button>
                </div>
            </div>

            {/* Number of Dwellers Input */}
            <div style={styles.inputGroup}>
                <label style={styles.label}>Number of Dwellers</label>
                <input 
                    type="number" 
                    placeholder="Enter number of people" 
                    value={dwellers}
                    onChange={(e) => setDwellers(e.target.value)}
                    style={styles.input}
                />
            </div>

            <button style={{ ...styles.button, ...styles.searchButton, width: '100%', marginTop: '10px' }}>
                Next
            </button>
        </div>
    );
}