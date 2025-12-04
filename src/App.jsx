import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('population_density');
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
        id: 'USA',
        name: 'United States',
        population: 331900000,
        area: 9834000,
        population_density: 33.7,
        life_expectancy: 78.9,
      },
      {
        id: 'CHN',
        name: 'China',
        population: 1411750000,
        area: 9596961,
        population_density: 147.1,
        life_expectancy: 77.4,
      },
      {
        id: 'IND',
        name: 'India',
        population: 1380004000,
        area: 3287590,
        population_density: 420.0,
        life_expectancy: 71.4,
      },
      {
        id: 'BRA',
        name: 'Brazil',
        population: 215313498,
        area: 8514877,
        population_density: 25.3,
        life_expectancy: 76.0,
      },
      {
        id: 'RUS',
        name: 'Russia',
        population: 144444359,
        area: 17098246,
        population_density: 8.4,
        life_expectancy: 72.6,
      },
      {
        id: 'JPN',
        name: 'Japan',
        population: 125124989,
        area: 377975,
        population_density: 331.0,
        life_expectancy: 84.6,
      },
      {
        id: 'DEU',
        name: 'Germany',
        population: 84339002,
        area: 357022,
        population_density: 236.0,
        life_expectancy: 81.9,
      },
      {
        id: 'GBR',
        name: 'United Kingdom',
        population: 67330000,
        area: 242495,
        population_density: 277.0,
        life_expectancy: 81.3,
      },
      {
        id: 'FRA',
        name: 'France',
        population: 68014000,
        area: 643801,
        population_density: 105.6,
        life_expectancy: 82.9,
      },
      {
        id: 'AUS',
        name: 'Australia',
        population: 26469000,
        area: 7692024,
        population_density: 3.4,
        life_expectancy: 83.5,
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
