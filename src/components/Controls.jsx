import React from 'react';

const Controls = ({ selectedMetric, onMetricChange, zoom, onZoomChange }) => {
  const metrics = [
    { id: 'population_density', label: 'Population Density' },
    { id: 'life_expectancy', label: 'Life Expectancy' },
    { id: 'population', label: 'Total Population' },
    { id: 'area', label: 'Land Area' },
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Metric to Display:
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => onMetricChange(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 hover:border-blue-500 focus:outline-none focus:border-blue-500 transition"
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-400">
            <p className="text-xs">Current Metric: <span className="text-blue-400 font-semibold">{metrics.find(m => m.id === selectedMetric)?.label}</span></p>
          </div>

          <div className="ml-auto text-sm text-gray-400">
            <p className="text-xs text-center">
              💡 Hover over countries for details. Click to select.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
