import React from 'react';

const Sidebar = ({ selectedCountry, selectedMetric, countries }) => {
  const metricLabels = {
    population_density: 'Population Density',
    life_expectancy: 'Life Expectancy',
    population: 'Total Population',
    area: 'Land Area',
  };

  const formatValue = (value, metric) => {
    if (!value && value !== 0) return 'N/A';

    if (metric === 'population') {
      return (value / 1000000).toFixed(2) + 'M';
    }
    if (metric === 'area') {
      return (value / 1000).toFixed(0) + 'K km²';
    }
    if (metric === 'population_density') {
      return value.toFixed(2) + ' /km²';
    }
    if (metric === 'life_expectancy') {
      return value.toFixed(1) + ' years';
    }
    return value;
  };

  const getTopCountries = () => {
    return countries
      .sort((a, b) => {
        const valA = a[selectedMetric] || 0;
        const valB = b[selectedMetric] || 0;
        return valB - valA;
      })
      .slice(0, 10);
  };

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-800">
        <h1 className="text-xl font-bold text-white">Population Density</h1>
        <p className="text-xs text-blue-100 mt-1">World Map Visualizer</p>
      </div>

      {/* Selected Country Info */}
      {selectedCountry ? (
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-750">
          <h2 className="text-lg font-bold text-white mb-3">{selectedCountry.name}</h2>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Population</p>
              <p className="text-blue-400 font-semibold">
                {formatValue(selectedCountry.population, 'population')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Density</p>
              <p className="text-green-400 font-semibold">
                {formatValue(selectedCountry.population_density, 'population_density')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Life Expectancy</p>
              <p className="text-yellow-400 font-semibold">
                {formatValue(selectedCountry.life_expectancy, 'life_expectancy')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Area</p>
              <p className="text-purple-400 font-semibold">
                {formatValue(selectedCountry.area, 'area')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 border-b border-gray-700 text-gray-400 text-sm">
          <p>Select a country to view details</p>
        </div>
      )}

      {/* Top Countries List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4">
          <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">
            Top 10 by {metricLabels[selectedMetric]}
          </h3>
          <div className="space-y-2">
            {getTopCountries().map((country, index) => (
              <div
                key={country.id}
                className="bg-gray-700 hover:bg-gray-600 cursor-pointer p-3 rounded transition text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">
                    {index + 1}. {country.name}
                  </span>
                  <span className="text-gray-300">{index + 1}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{
                      width: `${(
                        ((country[selectedMetric] || 0) /
                          Math.max(...countries.map((c) => c[selectedMetric] || 0))) *
                        100
                      ).toFixed(0)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-gray-300 mt-1">
                  {formatValue(country[selectedMetric], selectedMetric)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-750 border-t border-gray-700 px-6 py-3 text-xs text-gray-400">
        <p>Total Countries: <span className="text-blue-400 font-semibold">{countries.length}</span></p>
      </div>
    </div>
  );
};

export default Sidebar;
