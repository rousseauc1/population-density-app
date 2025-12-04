import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getHeatColor } from '../utils/colorScale';

const MapComponent = ({
  countries,
  selectedMetric,
  onCountrySelect,
  zoom,
  onZoomChange,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const geoJsonLayer = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([20, 0], 2);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map.current);

      map.current.on('zoomend', () => {
        onZoomChange(map.current.getZoom());
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (!map.current || countries.length === 0) return;

    // Remove existing layer
    if (geoJsonLayer.current) {
      map.current.removeLayer(geoJsonLayer.current);
    }

    // Create country data map for quick lookup
    const countryMap = new Map(countries.map((c) => [c.cca3, c]));

    // Add GeoJSON layer
    fetch('/src/utils/countries.geojson')
      .then((res) => res.json())
      .then((geoJSONData) => {
        geoJsonLayer.current = L.geoJSON(geoJSONData, {
          style: (feature) => {
            const country = countryMap.get(feature.properties.iso_a3);
            const value = country ? country[selectedMetric] : null;
            const color = getHeatColor(value, selectedMetric, countries);

            return {
              fillColor: color,
              weight: 1,
              opacity: 0.8,
              color: '#1a1a1a',
              fillOpacity: 0.85,
            };
          },
          onEachFeature: (feature, layer) => {
            const country = countryMap.get(feature.properties.iso_a3);

            if (country) {
              const popupContent = `
                <div class="bg-gray-800 text-white p-3 rounded shadow-lg">
                  <h3 class="font-bold text-lg mb-2">${country.country}</h3>
                  <p><strong>Population 2025:</strong> ${(country.pop2025 / 1000000).toFixed(2)}M</p>
                  <p><strong>Population 2050:</strong> ${(country.pop2050 / 1000000).toFixed(2)}M</p>
                  <p><strong>Density:</strong> ${country.density.toFixed(2)} /km²</p>
                  <p><strong>Area:</strong> ${(country.landAreaKm / 1000).toFixed(0)}K km²</p>
                  <p><strong>Growth Rate:</strong> ${(country.growthRate * 100).toFixed(2)}%</p>
                  <p><strong>World Share:</strong> ${(country.worldPercentage * 100).toFixed(2)}%</p>
                </div>
              `;

              layer.bindPopup(popupContent);
              layer.on('click', () => {
                onCountrySelect(country);
              });

              layer.on('mouseover', function () {
                this.setStyle({
                  weight: 2,
                  color: '#4ade80',
                  fillOpacity: 0.95,
                });
                this.bringToFront();
              });

              layer.on('mouseout', function () {
                this.setStyle({
                  weight: 1,
                  color: '#1a1a1a',
                  fillOpacity: 0.85,
                });
              });
            }
          },
        }).addTo(map.current);
      })
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, [countries, selectedMetric]);

  useEffect(() => {
    if (map.current && zoom !== map.current.getZoom()) {
      map.current.setZoom(zoom);
    }
  }, [zoom]);

  const handleZoomIn = () => {
    map.current.zoomIn();
  };

  const handleZoomOut = () => {
    map.current.zoomOut();
  };

  const handleReset = () => {
    map.current.setView([20, 0], 2);
    onZoomChange(2);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Custom Controls */}
      <div className="absolute bottom-6 left-6 bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-700">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold mb-2 transition"
          title="Zoom In"
        >
          +
        </button>
        <div className="text-center text-sm text-gray-300 my-1">Zoom: {zoom}</div>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold mb-2 transition"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold transition text-xs"
          title="Reset View"
        >
          ⟲
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-6 right-6 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 max-w-xs">
        <h3 className="text-white font-bold mb-3">Heat Scale</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-900 rounded"></div>
            <span className="text-xs text-gray-300">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-300">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-300">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
