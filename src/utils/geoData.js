// Simplified GeoJSON data for countries
// In production, you would load this from a proper GeoJSON source or database

export const getCountryGeoJSON = () => {
  return {
    type: 'FeatureCollection',
    features: [
      // USA
      {
        type: 'Feature',
        properties: { iso_a3: 'USA', name: 'United States' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-125, 49],
              [-125, 25],
              [-66, 25],
              [-66, 49],
              [-125, 49],
            ],
          ],
        },
      },
      // China
      {
        type: 'Feature',
        properties: { iso_a3: 'CHN', name: 'China' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [73, 54],
              [73, 18],
              [135, 18],
              [135, 54],
              [73, 54],
            ],
          ],
        },
      },
      // India
      {
        type: 'Feature',
        properties: { iso_a3: 'IND', name: 'India' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [68, 37],
              [68, 8],
              [97, 8],
              [97, 37],
              [68, 37],
            ],
          ],
        },
      },
      // Brazil
      {
        type: 'Feature',
        properties: { iso_a3: 'BRA', name: 'Brazil' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-73, 5],
              [-73, -33],
              [-35, -33],
              [-35, 5],
              [-73, 5],
            ],
          ],
        },
      },
      // Russia
      {
        type: 'Feature',
        properties: { iso_a3: 'RUS', name: 'Russia' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [18, 69],
              [18, 41],
              [169, 41],
              [169, 69],
              [18, 69],
            ],
          ],
        },
      },
      // Japan
      {
        type: 'Feature',
        properties: { iso_a3: 'JPN', name: 'Japan' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [128, 45],
              [128, 30],
              [145, 30],
              [145, 45],
              [128, 45],
            ],
          ],
        },
      },
      // Germany
      {
        type: 'Feature',
        properties: { iso_a3: 'DEU', name: 'Germany' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [6, 56],
              [6, 47],
              [16, 47],
              [16, 56],
              [6, 56],
            ],
          ],
        },
      },
      // United Kingdom
      {
        type: 'Feature',
        properties: { iso_a3: 'GBR', name: 'United Kingdom' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-8, 59],
              [-8, 50],
              [2, 50],
              [2, 59],
              [-8, 59],
            ],
          ],
        },
      },
      // France
      {
        type: 'Feature',
        properties: { iso_a3: 'FRA', name: 'France' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-8, 51],
              [-8, 41],
              [8, 41],
              [8, 51],
              [-8, 51],
            ],
          ],
        },
      },
      // Australia
      {
        type: 'Feature',
        properties: { iso_a3: 'AUS', name: 'Australia' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [113, -10],
              [113, -44],
              [154, -44],
              [154, -10],
              [113, -10],
            ],
          ],
        },
      },
    ],
  };
};
