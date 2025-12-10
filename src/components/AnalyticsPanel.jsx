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
      name: 'Population Projection Movers',
      description: 'Top projected population gainers, decliners, and fastest growth',
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
                  <p className="text-yellow-400 font-semibold">{region.avgDensity?.toFixed(1) || 'N/A'} /km²</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Growth Rate</p>
                  <p className="text-cyan-400 font-semibold">{(region.avgGrowthRate * 100)?.toFixed(2) || 'N/A'}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg GDP/Capita</p>
                  <p className="text-purple-400 font-semibold">${region.avgGDPPerCapita?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Life Expectancy</p>
                  <p className="text-orange-400 font-semibold">{region.avgLifeExpectancy?.toFixed(1) || 'N/A'} years</p>
                </div>
                <div>
                  <p className="text-gray-400">Total GDP</p>
                  <p className="text-indigo-400 font-semibold">${region.totalGDP?.toFixed(2) || 'N/A'}B</p>
                </div>
                <div>
                  <p className="text-gray-400">Projected Growth</p>
                  <p className="text-emerald-400 font-semibold">{formatPopulation(region.projectedGrowth || 0)}</p>
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
          {data.slice(0, 15).map((country, idx) => {
            // Check if primary metrics are mostly missing (small territory indicator)
            const hasPrimaryMetrics = country.gdpPerCapita !== null || country.lifeExpectancy !== null;
            const showFallback = !hasPrimaryMetrics || (country.gdpPerCapita === null && country.lifeExpectancy === null);
            
            return (
              <div key={idx} className="bg-gray-700 p-4 rounded">
                <h4 className="text-lg font-bold text-white mb-2">{country.country}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Density</p>
                    <p className="text-red-400 font-semibold">{country.density?.toFixed(1)} /km²</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Population 2025</p>
                    <p className="text-blue-400 font-semibold">{formatPopulation(country.pop2025)}</p>
                  </div>
                  
                  {/* Primary Economic Indicators */}
                  {country.gdpPerCapita !== null && (
                    <div>
                      <p className="text-gray-400">GDP/Capita</p>
                      <p className="text-yellow-400 font-semibold">${country.gdpPerCapita?.toLocaleString()}</p>
                    </div>
                  )}
                  {country.lifeExpectancy !== null && (
                    <div>
                      <p className="text-gray-400">Life Expectancy</p>
                      <p className="text-purple-400 font-semibold">{country.lifeExpectancy?.toFixed(1)} years</p>
                    </div>
                  )}
                  
                  {/* Fallback metrics for small territories */}
                  {showFallback && (
                    <>
                      {country.pop2050 !== null && (
                        <div>
                          <p className="text-gray-400">Population 2050</p>
                          <p className="text-green-400 font-semibold">{formatPopulation(country.pop2050)}</p>
                        </div>
                      )}
                      {country.growthRate !== null && (
                        <div>
                          <p className="text-gray-400">Growth Rate</p>
                          <p className="text-cyan-400 font-semibold">{(country.growthRate * 100)?.toFixed(2)}%</p>
                        </div>
                      )}
                      {country.worldPercentage !== null && (
                        <div>
                          <p className="text-gray-400">World %</p>
                          <p className="text-indigo-400 font-semibold">{country.worldPercentage?.toFixed(3)}%</p>
                        </div>
                      )}
                      {country.area !== null && (
                        <div>
                          <p className="text-gray-400">Area</p>
                          <p className="text-pink-400 font-semibold">{country.area?.toLocaleString()} km²</p>
                        </div>
                      )}
                      {country.landAreaKm !== null && (
                        <div>
                          <p className="text-gray-400">Land Area</p>
                          <p className="text-emerald-400 font-semibold">{country.landAreaKm?.toLocaleString()} km²</p>
                        </div>
                      )}
                      {country.gdpTotal !== null && (
                        <div>
                          <p className="text-gray-400">Total GDP</p>
                          <p className="text-yellow-400 font-semibold">${country.gdpTotal?.toFixed(2)}B</p>
                        </div>
                      )}
                      {country.urbanizationRate !== null && (
                        <div>
                          <p className="text-gray-400">Urbanization</p>
                          <p className="text-teal-400 font-semibold">{country.urbanizationRate?.toFixed(1)}%</p>
                        </div>
                      )}
                      {country.literacyRate !== null && (
                        <div>
                          <p className="text-gray-400">Literacy Rate</p>
                          <p className="text-violet-400 font-semibold">{country.literacyRate?.toFixed(1)}%</p>
                        </div>
                      )}
                      {country.unemploymentRate !== null && (
                        <div>
                          <p className="text-gray-400">Unemployment</p>
                          <p className="text-rose-400 font-semibold">{country.unemploymentRate?.toFixed(1)}%</p>
                        </div>
                      )}
                      {country.giniCoefficient !== null && (
                        <div>
                          <p className="text-gray-400">Gini Coefficient</p>
                          <p className="text-amber-400 font-semibold">{country.giniCoefficient?.toFixed(3)}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Show additional metrics even if primary ones exist */}
                  {!showFallback && country.gdpTotal !== null && (
                    <div>
                      <p className="text-gray-400">Total GDP</p>
                      <p className="text-indigo-400 font-semibold">${country.gdpTotal?.toFixed(2)}B</p>
                    </div>
                  )}
                  {!showFallback && country.urbanizationRate !== null && (
                    <div>
                      <p className="text-gray-400">Urbanization</p>
                      <p className="text-teal-400 font-semibold">{country.urbanizationRate?.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Query 4: Projection movers (gainers/decliners)
    if (selectedQuery?.id === 'projection-by-development') {
      if (!data || Object.keys(data).length === 0) {
        return (
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400">No data available</p>
          </div>
        );
      }

      const summary = data.summary || {};
      const topGainers = data.topGainers || [];
      const topDecliners = data.topDecliners || [];

      const renderList = (title, list, showPercent = false) => (
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-sm font-semibold text-gray-300 mb-2">{title}</p>
          <div className="space-y-1">
            {list.map((c, i) => (
              <div key={i} className="text-xs text-gray-300">
                <span className="font-semibold text-white">{c.country}</span>
                {c.pop2025 !== undefined && (
                  <span className="text-gray-400"> · {formatPopulation(c.pop2025)} → {formatPopulation(c.pop2050)}</span>
                )}
                {c.change !== undefined && (
                  <span className="text-blue-400 ml-2">
                    {c.change >= 0 ? '+' : ''}
                    {formatPopulation(c.change)}
                  </span>
                )}
                {showPercent && c.percentChange !== undefined && (
                  <span className="text-green-400 ml-2">
                    ({c.percentChange?.toFixed(1)}%)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      );

      return (
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded">
            <h4 className="text-lg font-bold text-white mb-3">Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Avg Growth</p>
                <p className="text-green-400 font-semibold">
                  {summary.avgGrowthRate !== undefined ? `${(summary.avgGrowthRate * 100).toFixed(2)}%` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Avg % Change</p>
                <p className="text-yellow-400 font-semibold">
                  {summary.avgPercentChange !== undefined ? `${summary.avgPercentChange?.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Total Pop 2025</p>
                <p className="text-blue-400 font-semibold">{formatPopulation(summary.totalPop2025 || 0)}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Pop 2050</p>
                <p className="text-purple-400 font-semibold">{formatPopulation(summary.totalPop2050 || 0)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Projected Change</p>
                <p className="text-emerald-400 font-semibold">
                  {formatPopulation(summary.projectedChange || 0)}
                </p>
              </div>
            </div>
          </div>

          {topGainers.length > 0 && renderList('Top Population Gainers (absolute)', topGainers, true)}
          {topDecliners.length > 0 && renderList('Top Population Decliners (absolute)', topDecliners, true)}
        </div>
      );
    }

    // Query 5: Economic-Population Correlation
    if (selectedQuery?.id === 'economic-population-correlation') {
      if (!data || Object.keys(data).length === 0) {
        return (
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400">No data available</p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {data.summary && (
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-lg font-bold text-white mb-3">Summary Statistics</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Avg Density</p>
                  <p className="text-white font-semibold">{data.summary.avgDensity?.toFixed(2) || 'N/A'} /km²</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg GDP/Capita</p>
                  <p className="text-blue-400 font-semibold">${data.summary.avgGDPPerCapita?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Growth Rate</p>
                  <p className="text-yellow-400 font-semibold">{(data.summary.avgGrowthRate * 100)?.toFixed(2) || 'N/A'}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Life Expectancy</p>
                  <p className="text-purple-400 font-semibold">{data.summary.avgLifeExpectancy?.toFixed(1) || 'N/A'} years</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Urbanization</p>
                  <p className="text-cyan-400 font-semibold">{data.summary.avgUrbanization?.toFixed(1) || 'N/A'}%</p>
                </div>
              </div>
            </div>
          )}
          {data.insights && (
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="text-lg font-bold text-white mb-3">Insights</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  High GDP + High Density: <span className="text-green-400 font-semibold">{data.insights.highGDPHighDensity || 0}</span> countries
                </p>
                <p className="text-gray-300">
                  Low GDP + High Density: <span className="text-red-400 font-semibold">{data.insights.lowGDPHighDensity || 0}</span> countries
                </p>
              </div>
            </div>
          )}
          {data.topPerformers && (
            <div className="bg-gray-700 p-4 rounded mt-4">
              <h4 className="text-lg font-bold text-white mb-3">Top Performers</h4>
              <div className="space-y-4">
                {data.topPerformers.highGDP && data.topPerformers.highGDP.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-300 mb-2">Highest GDP/Capita:</p>
                    <div className="space-y-1">
                      {data.topPerformers.highGDP.map((country, i) => (
                        <div key={i} className="text-xs text-gray-400">
                          {country.country}: ${country.gdpPerCapita?.toLocaleString() || 'N/A'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.topPerformers.highDensity && data.topPerformers.highDensity.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-300 mb-2">Highest Density:</p>
                    <div className="space-y-1">
                      {data.topPerformers.highDensity.map((country, i) => (
                        <div key={i} className="text-xs text-gray-400">
                          {country.country}: {country.density?.toFixed(1) || 'N/A'} /km²
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.topPerformers.bestBalance && data.topPerformers.bestBalance.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-300 mb-2">Best Balance (GDP / Density):</p>
                    <div className="space-y-1">
                      {data.topPerformers.bestBalance.map((country, i) => (
                        <div key={i} className="text-xs text-gray-400">
                          {country.country}: ${country.gdpPerCapita?.toLocaleString() || 'N/A'} · {country.density?.toFixed(1) || 'N/A'} /km²
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              <h4 className="text-lg font-bold text-white mb-3">Top Subregions by Population (2025)</h4>
              {(() => {
                const regions = data.topRegions.slice(0, 10);
                const maxPop = Math.max(...regions.map(r => r.totalPop2025 || 0), 1);
                return (
                  <div className="space-y-3">
                    {regions.map((region, idx) => {
                      const pct = Math.max(2, Math.min(100, ((region.totalPop2025 || 0) / maxPop) * 100));
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-300">
                            <span className="font-semibold text-white">{region.name}</span>
                            <span className="text-blue-400">{formatPopulation(region.totalPop2025)}</span>
                          </div>
                          <div className="h-3 bg-gray-700 rounded">
                            <div
                              className="h-3 bg-blue-500 rounded"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
          {data.economicLeaders && (
            <div className="mt-6">
              <h4 className="text-lg font-bold text-white mb-3">Economic Leaders</h4>
              <div className="space-y-2">
                {data.economicLeaders.slice(0, 10).map((region, idx) => (
                  <div key={idx} className="bg-gray-700 p-4 rounded text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">{region.name}</span>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">GDP/Capita</p>
                        <span className="text-purple-400">${region.avgGDP?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-400">Life Expectancy</p>
                        <p className="text-orange-400 font-semibold">{region.avgLifeExpectancy?.toFixed(1) || 'N/A'} years</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Countries</p>
                        <p className="text-white font-semibold">{region.countryCount}</p>
                      </div>
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

