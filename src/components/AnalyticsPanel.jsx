import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatPopulation } from '../utils/formatPopulation';

const AnalyticsPanel = ({ isOpen, onClose }) => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queries = [
    {
      id: 'high-growth-with-economics',
      name: 'High Growth Countries with Economics',
      description: 'Countries with above-average growth rates joined with economic indicators',
      endpoint: '/api/analytics/high-growth-with-economics',
    },
    {
      id: 'regional-analysis',
      name: 'Regional Analysis',
      description: 'Population and economic metrics aggregated by geographic regions',
      endpoint: '/api/analytics/regional-analysis',
    },
    {
      id: 'overcrowding-analysis',
      name: 'Overcrowding Analysis',
      description: 'Countries with high density but low economic indicators',
      endpoint: '/api/analytics/overcrowding-analysis',
    },
    {
      id: 'projection-by-development',
      name: 'Projection by Development Level',
      description: 'Population trends categorized by Human Development Index',
      endpoint: '/api/analytics/projection-by-development',
    },
    {
      id: 'economic-population-correlation',
      name: 'Economic-Population Correlation',
      description: 'Statistical analysis of relationships between economics and population',
      endpoint: '/api/analytics/economic-population-correlation',
    },
    {
      id: 'regional-comparison',
      name: 'Regional Comparison',
      description: 'Multi-dimensional analysis of regions with economic data',
      endpoint: '/api/analytics/regional-comparison',
    },
  ];

  const fetchQuery = async (query) => {
    setLoading(true);
    setError(null);
    setSelectedQuery(query);
    
    try {
      const response = await axios.get(query.endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderData = () => {
    if (!data) return null;

    // Query 1: High Growth with Economics
    if (selectedQuery?.id === 'high-growth-with-economics') {
      return (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm text-gray-300 mb-2">Average Growth Rate:</p>
            <p className="text-xl font-bold text-blue-400">
              {(data.avgGrowthRate * 100).toFixed(2)}%
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">High Growth Countries:</h4>
            <div className="space-y-2">
              {data.highGrowthCountries?.slice(0, 10).map((country, idx) => (
                <div key={idx} className="bg-gray-700 p-3 rounded text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-white">{country.country}</span>
                    <span className="text-green-400">{(country.growthRate * 100).toFixed(2)}%</span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>Pop 2025: {formatPopulation(country.pop2025)}</p>
                    {country.economicData && (
                      <>
                        <p>GDP/Capita: ${country.economicData.gdpPerCapita?.toLocaleString() || 'N/A'}</p>
                        <p>HDI: {country.economicData.humanDevelopmentIndex?.toFixed(3) || 'N/A'}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Query 2: Regional Analysis
    if (selectedQuery?.id === 'regional-analysis') {
      return (
        <div className="space-y-3">
          {data.slice(0, 10).map((region, idx) => (
            <div key={idx} className="bg-gray-700 p-4 rounded">
              <h4 className="text-lg font-bold text-white mb-2">{region.name}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-400">Countries</p>
                  <p className="text-white font-semibold">{region.countryCount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Pop 2025</p>
                  <p className="text-blue-400 font-semibold">{formatPopulation(region.totalPopulation2025)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Pop 2050</p>
                  <p className="text-green-400 font-semibold">{formatPopulation(region.totalPopulation2050)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Density</p>
                  <p className="text-yellow-400 font-semibold">{region.avgDensity?.toFixed(1)} /km²</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg GDP/Capita</p>
                  <p className="text-purple-400 font-semibold">${region.avgGDPPerCapita?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg HDI</p>
                  <p className="text-pink-400 font-semibold">{region.avgHDI?.toFixed(3) || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Query 3: Overcrowding Analysis
    if (selectedQuery?.id === 'overcrowding-analysis') {
      return (
        <div className="space-y-3">
          {data.slice(0, 10).map((country, idx) => (
            <div key={idx} className="bg-gray-700 p-4 rounded">
              <h4 className="text-lg font-bold text-white mb-2">{country.country}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-400">Density</p>
                  <p className="text-red-400 font-semibold">{country.density?.toFixed(1)} /km²</p>
                </div>
                <div>
                  <p className="text-gray-400">GDP/Capita</p>
                  <p className="text-yellow-400 font-semibold">${country.gdpPerCapita?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">HDI</p>
                  <p className="text-orange-400 font-semibold">{country.hdi || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Life Expectancy</p>
                  <p className="text-blue-400 font-semibold">{country.lifeExpectancy || 'N/A'} years</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Query 4: Projection by Development
    if (selectedQuery?.id === 'projection-by-development') {
      return (
        <div className="space-y-4">
          {data.map((level, idx) => (
            <div key={idx} className="bg-gray-700 p-4 rounded">
              <h4 className="text-lg font-bold text-white mb-3">{level.developmentLevel}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-gray-400">Countries</p>
                  <p className="text-white font-semibold">{level.countryCount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Growth</p>
                  <p className="text-green-400 font-semibold">{(level.avgGrowthRate * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Pop 2025</p>
                  <p className="text-blue-400 font-semibold">{formatPopulation(level.totalPop2025)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Pop 2050</p>
                  <p className="text-purple-400 font-semibold">{formatPopulation(level.totalPop2050)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Projected Change</p>
                  <p className="text-yellow-400 font-semibold">
                    {formatPopulation(level.projectedChange)} ({level.avgPercentChange?.toFixed(1)}%)
                  </p>
                </div>
              </div>
              {level.topCountries && level.topCountries.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400 mb-2">Top Countries by Growth:</p>
                  <div className="space-y-1">
                    {level.topCountries.map((c, i) => (
                      <div key={i} className="text-xs text-gray-300">
                        {c.name}: {c.change?.toFixed(1)}% growth
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Query 5: Economic-Population Correlation
    if (selectedQuery?.id === 'economic-population-correlation') {
      return (
        <div className="space-y-4">
          {data.summary && (
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-lg font-bold text-white mb-3">Summary Statistics</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Avg Density</p>
                  <p className="text-white font-semibold">{data.summary.avgDensity} /km²</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg GDP/Capita</p>
                  <p className="text-blue-400 font-semibold">${data.summary.avgGDPPerCapita?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg HDI</p>
                  <p className="text-green-400 font-semibold">{data.summary.avgHDI}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Growth Rate</p>
                  <p className="text-yellow-400 font-semibold">{(data.summary.avgGrowthRate * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}
          {data.insights && (
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-lg font-bold text-white mb-3">Insights</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  High GDP + High Density: <span className="text-green-400 font-semibold">{data.insights.highGDPHighDensity}</span> countries
                </p>
                <p className="text-gray-300">
                  Low GDP + High Density: <span className="text-red-400 font-semibold">{data.insights.lowGDPHighDensity}</span> countries
                </p>
                <p className="text-gray-300">
                  High HDI + Low Growth: <span className="text-yellow-400 font-semibold">{data.insights.highHDILowGrowth}</span> countries
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Query 6: Regional Comparison
    if (selectedQuery?.id === 'regional-comparison') {
      return (
        <div className="space-y-4">
          {data.topRegions && (
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Top Regions by Population</h4>
              <div className="space-y-2">
                {data.topRegions.slice(0, 10).map((region, idx) => (
                  <div key={idx} className="bg-gray-700 p-3 rounded text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">{region.name}</span>
                      <span className="text-blue-400">{formatPopulation(region.totalPop2025)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <p>Growth: {(region.growthRate * 100).toFixed(2)}%</p>
                      <p>GDP/Cap: ${region.avgGDP?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default: Show raw JSON
    return (
      <pre className="bg-gray-800 p-4 rounded text-xs overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      style={{ zIndex: 10000 }}
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative ml-80 max-lg:ml-0 max-lg:mx-4"
        style={{ zIndex: 10001 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Complex Analytics Queries</h2>
            <p className="text-xs text-blue-100">Demonstrating MongoDB aggregations with joins</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Query Selector */}
        <div className="p-4 border-b border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            {queries.map((query) => (
              <button
                key={query.id}
                onClick={() => fetchQuery(query)}
                className={`p-3 rounded text-left text-sm transition ${
                  selectedQuery?.id === query.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold mb-1">{query.name}</div>
                <div className="text-xs opacity-75">{query.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading query results...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded p-4 text-red-200">
              <p className="font-semibold mb-2">Error loading query:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && selectedQuery && data && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">{selectedQuery.name}</h3>
              {renderData()}
            </div>
          )}

          {!loading && !error && !selectedQuery && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg mb-2">Select a query to view results</p>
              <p className="text-sm">These queries demonstrate complex MongoDB aggregations with joins</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;

