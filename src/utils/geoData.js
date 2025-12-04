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
      // Indonesia
      {
        type: 'Feature',
        properties: { iso_a3: 'IDN', name: 'Indonesia' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [95, 11],
              [95, -11],
              [141, -11],
              [141, 11],
              [95, 11],
            ],
          ],
        },
      },
      // Pakistan
      {
        type: 'Feature',
        properties: { iso_a3: 'PAK', name: 'Pakistan' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [61, 37],
              [61, 24],
              [77, 24],
              [77, 37],
              [61, 37],
            ],
          ],
        },
      },
      // Bangladesh
      {
        type: 'Feature',
        properties: { iso_a3: 'BGD', name: 'Bangladesh' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [88, 27],
              [88, 21],
              [93, 21],
              [93, 27],
              [88, 27],
            ],
          ],
        },
      },
      // Nigeria
      {
        type: 'Feature',
        properties: { iso_a3: 'NGA', name: 'Nigeria' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [2, 14],
              [2, 4],
              [15, 4],
              [15, 14],
              [2, 14],
            ],
          ],
        },
      },
      // Mexico
      {
        type: 'Feature',
        properties: { iso_a3: 'MEX', name: 'Mexico' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-117, 33],
              [-117, 14],
              [-87, 14],
              [-87, 33],
              [-117, 33],
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
      // Ethiopia
      {
        type: 'Feature',
        properties: { iso_a3: 'ETH', name: 'Ethiopia' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [33, 15],
              [33, 3],
              [48, 3],
              [48, 15],
              [33, 15],
            ],
          ],
        },
      },
      // Philippines
      {
        type: 'Feature',
        properties: { iso_a3: 'PHL', name: 'Philippines' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [117, 20],
              [117, 5],
              [127, 5],
              [127, 20],
              [117, 20],
            ],
          ],
        },
      },
      // Egypt
      {
        type: 'Feature',
        properties: { iso_a3: 'EGY', name: 'Egypt' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [25, 32],
              [25, 22],
              [35, 22],
              [35, 32],
              [25, 32],
            ],
          ],
        },
      },
      // DR Congo
      {
        type: 'Feature',
        properties: { iso_a3: 'COD', name: 'DR Congo' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [12, 5],
              [12, -14],
              [31, -14],
              [31, 5],
              [12, 5],
            ],
          ],
        },
      },
    ],
  };
};
