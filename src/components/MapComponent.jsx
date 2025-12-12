import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getHeatColor } from '../utils/colorScale';
import { formatPopulation } from '../utils/formatPopulation';

const MapComponent = ({
  countries,
  selectedMetric,
  onCountrySelect,
  zoom,
  onZoomChange,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tooltipRef = useRef(null);
  const countryMarkers = useRef(new Map());
  const countryLayers = useRef(new Map());

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current, {
        minZoom: 2,
        maxZoom: 20,
        // Limit horizontal scrolling to 5 maps total (2 left, center, 2 right)
        // Each map is 360 degrees, so bounds are -720 to +720 (2 maps each direction from center)
        maxBounds: [[-85, -720], [85, 720]],
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      }).setView([20, 0], 2);

      // Use a tile layer that shows country boundaries with labels
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

  // Create clickable country boundaries and markers
  useEffect(() => {
    if (!map.current || countries.length === 0) return;

    // Clear existing markers and layers
    countryMarkers.current.forEach((marker) => map.current.removeLayer(marker));
    countryMarkers.current.clear();
    countryLayers.current.forEach((layer) => map.current.removeLayer(layer));
    countryLayers.current.clear();

    // Create a lookup map for quick country data access
    const countryDataMap = new Map();
    countries.forEach((country) => {
      countryDataMap.set(country.cca3, country);
    });

    // Country centroids (approximate lat/lng for each country code)
    const countryCentroids = {
      'IND': [20.5937, 78.9629],
      'CHN': [35.8617, 104.1954],
      'USA': [37.0902, -95.7129],
      'CAN': [56.1304, -106.3468],
      'IDN': [-0.7893, 113.9213],
      'PAK': [30.3753, 69.3451],
      'BRA': [-14.2350, -51.9253],
      'NGA': [9.0820, 8.6753],
      'BGD': [23.6850, 90.3563],
      'RUS': [61.5240, 105.3188],
      'MEX': [23.6345, -102.5528],
      'JPN': [36.2048, 138.2529],
      'ETH': [9.1450, 40.4897],
      'PHL': [12.8797, 121.7740],
      'EGY': [26.8206, 30.8025],
      'COD': [-4.0383, 21.7587],
      'VNM': [14.0583, 108.2772],
      'TUR': [38.9637, 35.2433],
      'IRN': [32.4279, 53.6880],
      'DEU': [51.1657, 10.4515],
      'THA': [15.8700, 100.9925],
      'GBR': [55.3781, -3.4360],
      'TZA': [-6.3690, 34.8888],
      'FRA': [46.2276, 2.2137],
      'ZAF': [-30.5595, 22.9375],
      'KEN': [-0.0236, 37.9062],
      'MYS': [4.2105, 101.6964],
      'UKR': [48.3794, 31.1656],
      'DZA': [28.0339, 1.6596],
      'IRQ': [33.2232, 43.6793],
      'AGO': [-11.2027, 17.8739],
      'SDN': [12.8628, 30.8025],
      'AFG': [33.9391, 67.0099],
      'PER': [-9.1900, -75.0152],
      'MAR': [31.7917, -7.0926],
      'UZB': [41.3775, 64.5853],
      'SAU': [23.8859, 45.0792],
      'YEM': [15.5527, 48.5164],
      'NOR': [60.4720, 8.4689],
      'POL': [51.9194, 19.1451],
      'COL': [4.5709, -74.2973],
      'ARG': [-38.4161, -63.6167],
      'ZMB': [-13.1339, 27.8493],
      'SOM': [5.1521, 46.1996],
      'PRK': [40.3399, 127.5101],
      'KOR': [35.9078, 127.7669],
      'SYR': [34.8021, 38.9968],
      'CIV': [7.5400, -5.5471],
      'CAF': [6.6111, 20.9394],
      'KAZ': [48.0196, 66.9237],
      'CMR': [3.8480, 11.5021],
      'AUS': [-25.2744, 133.7751],
      'NER': [17.6078, 8.6753],
      'BFA': [12.2381, -1.5616],
      'MWI': [-13.2543, 34.3015],
      'CHE': [46.8182, 8.2275],
      'AUT': [47.5162, 14.5501],
      'ISR': [31.0461, 34.8516],
      'TUN': [33.8869, 9.5375],
      'RWA': [-1.9536, 29.8739],
      'GIN': [9.9456, -9.6966],
      'TCD': [15.4542, 18.7322],
      'XKX': [42.6026, 21.1787],
      'ZWE': [-19.0154, 29.1549],
      'SEN': [14.4974, -14.4524],
      'SLE': [8.4606, -11.7799],
      'GUY': [4.8604, -58.9302],
      'ECU': [-1.8312, -78.1834],
      'MNG': [46.8625, 103.8467],
      'CZE': [49.8175, 15.4730],
      'GRC': [39.0742, 21.8243],
      'SWE': [60.1282, 18.6435],
      'AZE': [40.1431, 47.5769],
      'HTI': [18.9712, -72.2852],
      'BEL': [50.5039, 4.4699],
      'BOL': [-16.2902, -63.5887],
      'BWA': [-22.3285, 24.6849],
      'ROU': [45.9432, 24.9668],
      'BEN': [9.3077, 2.3158],
      'HUN': [47.1625, 19.5033],
      'BLR': [53.7098, 27.9534],
      'CUB': [21.5218, -77.7812],
      'IRL': [53.4129, -8.2439],
      'ITA': [41.8719, 12.5674],
      'DOM': [18.7357, -70.1627],
      'CHL': [-35.6751, -71.5430],
      'KHM': [12.5657, 104.9910],
      'GAB': [-0.8037, 11.6045],
      'GHA': [7.3697, -1.2],
      'GTM': [15.7835, -90.2308],
      'HND': [15.2, -86.2419],
      'PRY': [-23.4425, -58.4438],
      'ALB': [41.1533, 20.1683],
      'ARM': [40.0691, 45.0382],
      'BIH': [43.9159, 17.6791],
      'COG': [-4.0383, 21.7587],
      'CRI': [9.7489, -83.7534],
      'HRV': [45.1, 15.2],
      'DJI': [11.8254, 42.5903],
      'SLV': [13.7942, -88.8965],
      'EST': [58.5953, 25.0136],
      'FJI': [-17.7134, 178.0650],
      'GEO': [42.3154, 43.3569],
      'GNQ': [1.6508, 10.2679],
      'ISL': [64.9631, -19.0208],
      'JOR': [30.5852, 36.2384],
      'KWT': [29.3117, 47.4818],
      'LAO': [19.8523, 102.4955],
      'LVA': [56.8796, 24.6032],
      'LBN': [33.8547, 35.8623],
      'LSO': [-29.6100, 28.2336],
      'LBR': [6.4281, -9.4295],
      // Libya (nudged inland to avoid Mediterranean placement)
      'LBY': [27.0, 17.0],
      'LIE': [47.1660, 9.5554],
      'LTU': [55.1694, 23.8813],
      'LUX': [49.8153, 6.1296],
      'MDG': [-18.7669, 46.8691],
      'MLI': [17.5707, -3.9962],
      'MLT': [35.9375, 14.3754],
      'MRT': [20.3069, -10.9408],
      'MUS': [-20.3484, 57.5522],
      'MDV': [3.8859, 73.5381],
      'MKD': [41.6086, 21.7453],
      'MDA': [47.4116, 28.3699],
      'MCO': [43.7384, 7.4246],
      'MNE': [42.7087, 19.3744],
      'MMR': [21.9162, 95.9560],
      'MOZ': [-18.6657, 35.5296],
      'NAM': [-22.9375, 18.7331],
      'NPL': [28.3949, 84.1240],
      'NLD': [52.1326, 5.2913],
      'NZL': [-40.9006, 174.8860],
      'NIC': [12.8654, -85.2072],
      'OMN': [21.4735, 55.9754],
      'PAN': [8.5380, -80.7821],
      'PNG': [-6.3150, 143.9555],
      'PSE': [31.9522, 35.2332],
      'PRT': [39.3999, -8.2245],
      'QAT': [25.3548, 51.1839],
      'SMR': [43.9424, 12.4578],
      'SRB': [44.0165, 21.0059],
      'SGP': [1.3521, 103.8198],
      'SVK': [48.6690, 19.6990],
      'SVN': [46.1512, 14.9955],
      'SLB': [-9.6412, 160.1562],
      'ESP': [40.4637, -3.7492],
      'LKA': [7.8731, 80.7718],
      'SUR': [3.9193, -56.0278],
      'SWZ': [-26.5225, 31.4659],
      'TJK': [38.8610, 71.2761],
      'TLS': [-8.8383, 125.9181],
      'TKM': [38.9697, 59.5563],
      'TGO': [6.1256, 1.2317],
      'TON': [-21.1789, -175.1982],
      'TTO': [10.6918, -61.2225],
      'TWN': [23.6978, 120.9605],
      'UGA': [1.3733, 32.2903],
      'ARE': [23.4241, 53.8478],
      'URY': [-32.5228, -55.7658],
      'VAT': [41.9029, 12.4534],
      'VEN': [6.4238, -66.5897],
      'AND': [42.5406, 1.5861],
      'BHS': [24.2155, -76.0789],
      'BRB': [13.1939, -59.5432],
      'BLZ': [17.1899, -88.4976],
      'BMU': [32.3078, -64.7605],
      'FIN' : [61.9241, 25.7482],
      'CYM': [19.5, -80.5],
      'DMA': [15.4150, -61.3710],
      'GRL': [72.0, -40.0],
      'JAM': [18.1096, -77.2975],
      'MNP': [15.0979, 145.6694],
      'PRI': [18.2208, -66.5901],
      'BRN': [4.5353, 114.7277],
      'BTN': [27.5142, 90.4336],
      'KIR': [1.3521, 173.0060],
      'KGZ': [41.5015, 74.6671],
      'CPV': [16.5388, -23.0418],
      'TCA': [21.9945, -71.9860],
      'CUW': [12.1696, -68.9900],
      'ERI': [15.1794, 39.7823],
      'FLK': [-51.7934, -59.5432],
      'GLP': [16.2333, -61.5333],
      'GMB': [13.4549, -15.3101],
      'GNB': [11.8037, -15.1804],
      'GUM': [13.4443, 144.7937],
      'MTQ': [14.6349, -61.0242],
      'MSR': [16.7425, -62.1898],
      'REU': [-21.1151, 55.5364],
      'SPM': [46.8139, -56.1645],
      'SXM': [18.0735, -63.0895],
      'VGB': [18.4207, -64.2994],
      'VIR': [18.3358, -64.8963],
      'ASM': [-14.2710, -170.1322],
      'FSM': [7.4256, 150.5508],
      'GGY': [49.5581, -2.1234],
      'HKG': [22.3193, 114.1694],
      'IMN': [54.2361, -4.5481],
      'JEY': [49.2200, -2.1297],
      'MAC': [22.1987, 113.5439],
      'MAF': [18.0735, -63.0895],
      'NCL': [-20.9043, 165.6180],
      'NIU': [-19.0520, -169.8711],
      'PYF': [-17.5790, -149.5830],
      'WLF': [-13.3048, 176.1649],
      'ABW': [12.1696, -68.9900],
      'BDI': [-3.3731, 29.9189],
      'BGR': [42.7339, 25.4858],
      'BLM': [17.8978, -62.8061],
      'TKL': [-9.1699, -171.8479],
      'AIA': [18.2206, -63.0686],
      'ESH': [24.2155, -13.2038],
      'SSD': [6.8770, 31.3070],
      'DNK': [56.2639, 9.5018],
      'PLW': [7.5150, 134.5825],
      'WSM': [-13.7590, -172.1046],
      'STP': [0.1864, 6.6131],
      'MHL': [7.1315, 171.1845],
      'VUT': [-15.3767, 166.9592],
      'VCT': [12.9843, -61.2872],
      'LCA': [13.9094, -60.9789],
      'ATG': [17.0608, -61.7964],
      'COM': [-11.6455, 43.3333],
      'SYC': [-4.6796, 55.4920],
      'BHR': [25.9304, 50.6378],
      'SHN': [-24.1434, -10.0307],
      'SGS': [-54.4296, -36.5879],
      'ATF': [-49.2804, 69.3486],
      'HMD': [-53.0818, 73.5042],
      'IOT': [-6.0000, 71.5000],
      'CCK': [-12.1642, 96.8710],
      'CXR': [-10.4475, 105.6904],
      'NFK': [-29.0408, 167.9547],
      'PCN': [-24.7036, -127.4393],
      'UMI': [19.2823, 166.6470],
    };

    // Add click handler to map for reverse geocoding
    const handleMapClick = async (e) => {
      const { lat, lng } = e.latlng;
      
      // Try to find the closest country by checking centroids
      let closestCountry = null;
      let minDistance = Infinity;

      countries.forEach((country) => {
        const centroid = countryCentroids[country.cca3];
        if (!centroid) return;

        const [centroidLat, centroidLng] = centroid;
        // Calculate approximate distance (simple Euclidean distance)
        const distance = Math.sqrt(
          Math.pow(lat - centroidLat, 2) + Math.pow(lng - centroidLng, 2)
        );

        // Use a reasonable threshold (about 10 degrees, roughly 1000km)
        if (distance < 10 && distance < minDistance) {
          minDistance = distance;
          closestCountry = country;
        }
      });

      if (closestCountry) {
        onCountrySelect(closestCountry);
        // Find and open the marker popup (try to find the one closest to the click)
        let closestMarker = null;
        let minMarkerDistance = Infinity;
        
        countryMarkers.current.forEach((marker, key) => {
          if (key.startsWith(closestCountry.cca3 + '_')) {
            const markerLatLng = marker.getLatLng();
            const distance = Math.sqrt(
              Math.pow(lat - markerLatLng.lat, 2) + Math.pow(lng - markerLatLng.lng, 2)
            );
            if (distance < minMarkerDistance) {
              minMarkerDistance = distance;
              closestMarker = marker;
            }
          }
        });
        
        if (closestMarker) {
          closestMarker.openPopup();
        }
      }
    };

    // Add click handler to map
    map.current.off('click', handleMapClick); // Remove existing handler if any
    map.current.on('click', handleMapClick);

    // Store clickable areas for zoom updates
    const clickableAreas = [];

    // Create markers at multiple longitude offsets so they appear when scrolling horizontally
    // This allows points to appear on all maps as you scroll left and right
    const longitudeOffsets = [-720, -360, 0, 360, 720];
    
    countries.forEach((country) => {
      const centroid = countryCentroids[country.cca3];
      if (!centroid) return;

      const [lat, lng] = centroid;
      const value = country[selectedMetric];
      const color = getHeatColor(value, selectedMetric, countries);

      // Create markers at each longitude offset
      longitudeOffsets.forEach((lngOffset) => {
        const offsetLng = lng + lngOffset;
        
        // Create a circle marker at the country centroid with longitude offset
        const marker = L.circleMarker([lat, offsetLng], {
          radius: Math.min(Math.max(5, value / 50000000), 30), // Size based on selected metric
          fillColor: color,
          color: '#1a1a1a',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7,
        }).addTo(map.current);

        // Create an invisible larger clickable area around the marker
        // This makes it easier to click smaller countries
        // Radius scales with zoom - larger at lower zoom levels
        const currentZoom = map.current.getZoom();
        const baseRadius = 100000; // 100km base radius
        const zoomFactor = Math.max(1, 4 - currentZoom / 3); // Larger area when zoomed out
        const clickableRadius = baseRadius * zoomFactor;
        
        const clickableArea = L.circle([lat, offsetLng], {
          radius: clickableRadius,
          fillColor: 'transparent',
          color: 'transparent',
          weight: 0,
          fillOpacity: 0,
          interactive: true,
        }).addTo(map.current);
        
        // Store for zoom updates (will be handled outside the loop)
        clickableAreas.push({ area: clickableArea, baseRadius });

        // Add popup on click
        const popupContent = `
          <div class="bg-gray-800 text-white p-3 rounded shadow-lg text-sm">
            <h3 class="font-bold text-lg mb-2">${country.country}</h3>
            <p><strong>Population 2025:</strong> ${formatPopulation(country.pop2025)}</p>
            <p><strong>Population 2050:</strong> ${formatPopulation(country.pop2050)}</p>
            <p><strong>Density:</strong> ${country.density.toFixed(2)} /km²</p>
            <p><strong>Growth Rate:</strong> ${(country.growthRate * 100).toFixed(2)}%</p>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        const handleClick = () => {
          onCountrySelect(country);
          // Open popup on the clicked marker (only one popup should be open at a time)
          marker.openPopup();
        };

        marker.on('click', handleClick);
        clickableArea.on('click', handleClick);

        marker.on('mouseover', function () {
          // Highlight all markers for this country (all longitude offsets)
          countryMarkers.current.forEach((m, key) => {
            if (key.startsWith(country.cca3 + '_')) {
              m.setStyle({
                fillOpacity: 0.9,
                weight: 2,
              });
            }
          });
          map.current.getContainer().style.cursor = 'pointer';
        });

        marker.on('mouseout', function () {
          // Reset all markers for this country
          countryMarkers.current.forEach((m, key) => {
            if (key.startsWith(country.cca3 + '_')) {
              m.setStyle({
                fillOpacity: 0.7,
                weight: 1,
              });
            }
          });
          map.current.getContainer().style.cursor = '';
        });

        clickableArea.on('mouseover', function () {
          // Highlight all markers for this country (all longitude offsets)
          countryMarkers.current.forEach((m, key) => {
            if (key.startsWith(country.cca3 + '_')) {
              m.setStyle({
                fillOpacity: 0.9,
                weight: 2,
              });
            }
          });
          map.current.getContainer().style.cursor = 'pointer';
        });

        clickableArea.on('mouseout', function () {
          // Reset all markers for this country
          countryMarkers.current.forEach((m, key) => {
            if (key.startsWith(country.cca3 + '_')) {
              m.setStyle({
                fillOpacity: 0.7,
                weight: 1,
              });
            }
          });
          map.current.getContainer().style.cursor = '';
        });

        // Store markers with a unique key that includes the offset
        const markerKey = `${country.cca3}_${lngOffset}`;
        countryMarkers.current.set(markerKey, marker);
        countryLayers.current.set(markerKey, clickableArea);
      });
    });

    // Update all clickable areas when zoom changes
    const updateClickableAreas = () => {
      const currentZoom = map.current.getZoom();
      const zoomFactor = Math.max(1, 4 - currentZoom / 3);
      clickableAreas.forEach(({ area, baseRadius }) => {
        area.setRadius(baseRadius * zoomFactor);
      });
    };

    map.current.off('zoomend', updateClickableAreas);
    map.current.on('zoomend', updateClickableAreas);
  }, [countries, selectedMetric, onCountrySelect]);

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
      <div className="absolute bottom-6 left-6 bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-700" style={{ zIndex: 1000, pointerEvents: 'auto' }}>
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
      <div className="absolute top-6 right-6 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700" style={{ zIndex: 1000, pointerEvents: 'auto', minWidth: '300px' }}>
        <h3 className="text-white font-bold mb-3">Heat Scale</h3>
        <div className="relative w-full h-8 rounded overflow-hidden" style={{
          background: 'linear-gradient(to right, #001f3f, #00448f, #00a3e0, #00d084, #ffdc00, #ff9500, #e74c3c)'
        }}></div>
        <div className="flex justify-between text-xs text-gray-300 mt-2">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
