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
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries data:', error);
      // Fallback data for demonstration
      setCountries(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  const getDemoData = () => {
    // Demo data for testing without backend
    return [
      {
        cca3: 'IND',
        country: 'India',
        pop2025: 1463870000,
        pop2050: 1679590000,
        landAreaKm: 2973190,
        density: 492.3567,
        growthRate: 0.0089,
        worldPercentage: 0.1829,
        rank: 1,
      },
      {
        cca3: 'CHN',
        country: 'China',
        pop2025: 1425887000,
        pop2050: 1382000000,
        landAreaKm: 9326400,
        density: 152.8922,
        growthRate: -0.0027,
        worldPercentage: 0.1784,
        rank: 2,
      },
      {
        cca3: 'USA',
        country: 'United States',
        pop2025: 346570000,
        pop2050: 371621000,
        landAreaKm: 9148220,
        density: 37.8946,
        growthRate: 0.0054,
        worldPercentage: 0.0434,
        rank: 3,
      },
      {
        cca3: 'IDN',
        country: 'Indonesia',
        pop2025: 277534000,
        pop2050: 319866000,
        landAreaKm: 1812221,
        density: 153.1198,
        growthRate: 0.0071,
        worldPercentage: 0.0347,
        rank: 4,
      },
      {
        cca3: 'PAK',
        country: 'Pakistan',
        pop2025: 240485000,
        pop2050: 308745000,
        landAreaKm: 770875,
        density: 311.8876,
        growthRate: 0.0196,
        worldPercentage: 0.0301,
        rank: 5,
      },
      {
        cca3: 'BRA',
        country: 'Brazil',
        pop2025: 215313000,
        pop2050: 228033000,
        landAreaKm: 8358140,
        density: 25.7480,
        growthRate: 0.0062,
        worldPercentage: 0.0270,
        rank: 6,
      },
      {
        cca3: 'NGA',
        country: 'Nigeria',
        pop2025: 223804000,
        pop2050: 401315000,
        landAreaKm: 910768,
        density: 245.8762,
        growthRate: 0.0254,
        worldPercentage: 0.0280,
        rank: 7,
      },
      {
        cca3: 'BGD',
        country: 'Bangladesh',
        pop2025: 172953000,
        pop2050: 184347000,
        landAreaKm: 130170,
        density: 1330.6234,
        growthRate: 0.0099,
        worldPercentage: 0.0217,
        rank: 8,
      },
      {
        cca3: 'RUS',
        country: 'Russia',
        pop2025: 144444000,
        pop2050: 137663000,
        landAreaKm: 16995800,
        density: 8.4943,
        growthRate: -0.0004,
        worldPercentage: 0.0181,
        rank: 9,
      },
      {
        cca3: 'MEX',
        country: 'Mexico',
        pop2025: 128932000,
        pop2050: 135355000,
        landAreaKm: 1943945,
        density: 66.3497,
        growthRate: 0.0047,
        worldPercentage: 0.0162,
        rank: 10,
      },
    ];
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
