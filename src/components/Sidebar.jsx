import React from 'react';
import { formatPopulation } from '../utils/formatPopulation';

const Sidebar = ({ selectedCountry, selectedMetric, countries }) => {
  const metricLabels = {
    density: 'Population Density',
    pop2025: 'Population 2025',
    pop2050: 'Population 2050',
    growthRate: 'Growth Rate',
    worldPercentage: 'World Percentage',
  };

  const formatValue = (value, metric) => {
    if (!value && value !== 0) return 'N/A';

    if (metric === 'pop2025' || metric === 'pop2050') {
      return formatPopulation(value);
    }
    if (metric === 'density') {
      return value.toFixed(2) + ' /km²';
    }
    if (metric === 'growthRate') {
      return (value * 100).toFixed(2) + '%';
    }
    if (metric === 'worldPercentage') {
      return (value * 100).toFixed(2) + '%';
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
          <h2 className="text-lg font-bold text-white mb-3">{selectedCountry.country}</h2>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">2025 Population</p>
              <p className="text-blue-400 font-semibold">
                {formatValue(selectedCountry.pop2025, 'pop2025')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">2050 Projection</p>
              <p className="text-green-400 font-semibold">
                {formatValue(selectedCountry.pop2050, 'pop2050')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Density</p>
              <p className="text-yellow-400 font-semibold">
                {formatValue(selectedCountry.density, 'density')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Growth Rate</p>
              <p className="text-purple-400 font-semibold">
                {formatValue(selectedCountry.growthRate, 'growthRate')}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">World %</p>
              <p className="text-red-400 font-semibold">
                {formatValue(selectedCountry.worldPercentage, 'worldPercentage')}
              </p>
            </div>
            {selectedCountry.rank && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Rank</p>
                <p className="text-orange-400 font-semibold">#{selectedCountry.rank}</p>
              </div>
            )}
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
                key={country.cca3}
                className="bg-gray-700 hover:bg-gray-600 cursor-pointer p-3 rounded transition text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">
                    {index + 1}. {country.country}
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
