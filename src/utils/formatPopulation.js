/**
 * Formats population numbers in a human-readable way:
 * - Numbers >= 1 billion: "X.XXB"
 * - Numbers >= 1 million: "X.XXM"
 * - Numbers < 1 million: actual number with commas (e.g., "50,000")
 */
export const formatPopulation = (value) => {
  if (!value && value !== 0) return 'N/A';
  
  const num = Number(value);
  
  // Billions (>= 1 billion)
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  
  // Millions (>= 1 million)
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  
  // Less than 1 million - show actual number with commas
  return num.toLocaleString('en-US');
};

