// Color scale utilities for heatmap visualization

export const getHeatColor = (value, metric, countries) => {
  if (value === null || value === undefined) {
    return '#4b5563'; // Gray for missing data
  }

  // Get min and max values for the metric
  const values = countries
    .map((c) => c[metric])
    .filter((v) => v !== null && v !== undefined);

  if (values.length === 0) return '#4b5563';

  const min = Math.min(...values);
  const max = Math.max(...values);

  const logMin = Math.log(min + 1);
  const logMax = Math.log(max + 1);
  const logValue = Math.log(value + 1);

  const normalized = (logValue - logMin) / (logMax - logMin || 1);

  // Define color scale: Blue (low) -> Green (medium) -> Red (high)
  if (normalized < 0.33) {
    // Blue to Green
    const ratio = normalized / 0.33;
    return interpolateColor('#001f3f', '#00d084', ratio);
  } else if (normalized < 0.66) {
    // Green to Yellow
    const ratio = (normalized - 0.33) / 0.33;
    return interpolateColor('#00d084', '#ffdc00', ratio);
  } else {
    // Yellow to Red
    const ratio = (normalized - 0.66) / 0.34;
    return interpolateColor('#ffdc00', '#e74c3c', ratio);
  }
};

const interpolateColor = (color1, color2, factor) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return rgbToHex(r, g, b);
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};
