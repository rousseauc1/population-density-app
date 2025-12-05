import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('density');
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    fetchCountriesData();
  }, []);

  const fetchCountriesData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/countries');
      console.log(`Successfully fetched ${response.data.length} countries`);
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries data:', error);
      console.error('API request failed - make sure backend is running on port 5000');
      setCountries(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  const getDemoData = () => {
    // Demo data - will be replaced by API data
    // If API fails, this ensures we still have data to display
    console.warn('Using demo data - API fetch failed');
    return [];
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar
        selectedCountry={selectedCountry}
        selectedMetric={selectedMetric}
        countries={countries}
      />

      <div className="flex-1 flex flex-col">
        <Controls
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
          zoom={zoom}
          onZoomChange={setZoom}
        />

        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p>Loading population data...</p>
              </div>
            </div>
          ) : (
            <MapComponent
              countries={countries}
              selectedMetric={selectedMetric}
              onCountrySelect={setSelectedCountry}
              zoom={zoom}
              onZoomChange={setZoom}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
