import React from 'react';

const Controls = ({ selectedMetric, onMetricChange, zoom, onZoomChange, onShowAnalytics }) => {
  const metrics = [
    { id: 'density', label: 'Population Density (people/km²)' },
    { id: 'pop2025', label: 'Population 2025' },
    { id: 'pop2050', label: 'Population 2050 (Projected)' },
    { id: 'growthRate', label: 'Growth Rate' },
    { id: 'worldPercentage', label: 'World Percentage' },
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

          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={onShowAnalytics}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold text-sm transition shadow-lg"
              title="View Complex Analytics Queries"
            >
              📊 Analytics
            </button>
            <div className="text-sm text-gray-400">
              <p className="text-xs text-center">
                💡 Hover over countries for details. Click to select.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
