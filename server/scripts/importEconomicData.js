import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import EconomicIndicator from '../models/EconomicIndicator.js';
import Country from '../models/Country.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/global_population';

// Sample economic indicators data (from seed.js)
const sampleEconomicIndicators = [
  // High-income countries
  { countryCode: 'USA', year: 2024, gdpPerCapita: 76398, gdpTotal: 26.95, humanDevelopmentIndex: 0.921, giniCoefficient: 0.415, unemploymentRate: 3.7, urbanizationRate: 82.9, lifeExpectancy: 76.3, literacyRate: 99.0 },
  { countryCode: 'JPN', year: 2024, gdpPerCapita: 33897, gdpTotal: 4.23, humanDevelopmentIndex: 0.925, giniCoefficient: 0.329, unemploymentRate: 2.6, urbanizationRate: 91.9, lifeExpectancy: 84.8, literacyRate: 99.0 },
  { countryCode: 'DEU', year: 2024, gdpPerCapita: 51429, gdpTotal: 4.31, humanDevelopmentIndex: 0.947, giniCoefficient: 0.316, unemploymentRate: 3.0, urbanizationRate: 77.5, lifeExpectancy: 81.3, literacyRate: 99.0 },
  { countryCode: 'GBR', year: 2024, gdpPerCapita: 47234, gdpTotal: 3.13, humanDevelopmentIndex: 0.929, giniCoefficient: 0.351, unemploymentRate: 4.2, urbanizationRate: 84.2, lifeExpectancy: 81.8, literacyRate: 99.0 },
  { countryCode: 'FRA', year: 2024, gdpPerCapita: 43459, gdpTotal: 2.92, humanDevelopmentIndex: 0.903, giniCoefficient: 0.324, unemploymentRate: 7.4, urbanizationRate: 81.2, lifeExpectancy: 82.7, literacyRate: 99.0 },
  { countryCode: 'AUS', year: 2024, gdpPerCapita: 65000, gdpTotal: 1.69, humanDevelopmentIndex: 0.951, giniCoefficient: 0.340, unemploymentRate: 3.5, urbanizationRate: 86.2, lifeExpectancy: 83.4, literacyRate: 99.0 },
  { countryCode: 'CAN', year: 2024, gdpPerCapita: 54867, gdpTotal: 2.14, humanDevelopmentIndex: 0.935, giniCoefficient: 0.338, unemploymentRate: 5.0, urbanizationRate: 81.4, lifeExpectancy: 82.3, literacyRate: 99.0 },
  
  // Upper-middle-income countries
  { countryCode: 'CHN', year: 2024, gdpPerCapita: 12556, gdpTotal: 17.73, humanDevelopmentIndex: 0.788, giniCoefficient: 0.385, unemploymentRate: 5.1, urbanizationRate: 64.7, lifeExpectancy: 78.2, literacyRate: 96.8 },
  { countryCode: 'RUS', year: 2024, gdpPerCapita: 11585, gdpTotal: 1.78, humanDevelopmentIndex: 0.822, giniCoefficient: 0.376, unemploymentRate: 3.5, urbanizationRate: 74.8, lifeExpectancy: 72.6, literacyRate: 99.7 },
  { countryCode: 'BRA', year: 2024, gdpPerCapita: 8917, gdpTotal: 1.92, humanDevelopmentIndex: 0.754, giniCoefficient: 0.539, unemploymentRate: 7.9, urbanizationRate: 87.6, lifeExpectancy: 75.9, literacyRate: 93.2 },
  { countryCode: 'MEX', year: 2024, gdpPerCapita: 11091, gdpTotal: 1.43, humanDevelopmentIndex: 0.758, giniCoefficient: 0.454, unemploymentRate: 2.9, urbanizationRate: 80.8, lifeExpectancy: 75.0, literacyRate: 95.4 },
  { countryCode: 'TUR', year: 2024, gdpPerCapita: 10616, gdpTotal: 0.90, humanDevelopmentIndex: 0.838, giniCoefficient: 0.415, unemploymentRate: 10.4, urbanizationRate: 76.6, lifeExpectancy: 78.6, literacyRate: 96.7 },
  { countryCode: 'ARG', year: 2024, gdpPerCapita: 13655, gdpTotal: 0.64, humanDevelopmentIndex: 0.842, giniCoefficient: 0.425, unemploymentRate: 6.9, urbanizationRate: 92.1, lifeExpectancy: 76.7, literacyRate: 99.0 },
  { countryCode: 'THA', year: 2024, gdpPerCapita: 7189, gdpTotal: 0.51, humanDevelopmentIndex: 0.800, giniCoefficient: 0.363, unemploymentRate: 1.0, urbanizationRate: 52.3, lifeExpectancy: 79.9, literacyRate: 96.6 },
  { countryCode: 'MYS', year: 2024, gdpPerCapita: 11371, gdpTotal: 0.40, humanDevelopmentIndex: 0.803, giniCoefficient: 0.410, unemploymentRate: 3.4, urbanizationRate: 78.2, lifeExpectancy: 76.4, literacyRate: 95.0 },
  
  // Lower-middle-income countries
  { countryCode: 'IND', year: 2024, gdpPerCapita: 2389, gdpTotal: 3.50, humanDevelopmentIndex: 0.644, giniCoefficient: 0.352, unemploymentRate: 7.3, urbanizationRate: 35.9, lifeExpectancy: 70.2, literacyRate: 74.4 },
  { countryCode: 'IDN', year: 2024, gdpPerCapita: 4788, gdpTotal: 1.33, humanDevelopmentIndex: 0.713, giniCoefficient: 0.379, unemploymentRate: 5.3, urbanizationRate: 57.3, lifeExpectancy: 72.0, literacyRate: 95.7 },
  { countryCode: 'PAK', year: 2024, gdpPerCapita: 1591, gdpTotal: 0.38, humanDevelopmentIndex: 0.540, giniCoefficient: 0.297, unemploymentRate: 6.2, urbanizationRate: 37.4, lifeExpectancy: 67.3, literacyRate: 58.0 },
  { countryCode: 'BGD', year: 2024, gdpPerCapita: 2681, gdpTotal: 0.46, humanDevelopmentIndex: 0.661, giniCoefficient: 0.324, unemploymentRate: 4.4, urbanizationRate: 38.2, lifeExpectancy: 73.4, literacyRate: 74.7 },
  { countryCode: 'PHL', year: 2024, gdpPerCapita: 3542, gdpTotal: 0.42, humanDevelopmentIndex: 0.699, giniCoefficient: 0.424, unemploymentRate: 4.3, urbanizationRate: 48.0, lifeExpectancy: 71.2, literacyRate: 96.3 },
  { countryCode: 'VNM', year: 2024, gdpPerCapita: 4163, gdpTotal: 0.41, humanDevelopmentIndex: 0.703, giniCoefficient: 0.357, unemploymentRate: 2.3, urbanizationRate: 38.0, lifeExpectancy: 75.3, literacyRate: 95.8 },
  { countryCode: 'EGY', year: 2024, gdpPerCapita: 4045, gdpTotal: 0.52, humanDevelopmentIndex: 0.731, giniCoefficient: 0.316, unemploymentRate: 7.2, urbanizationRate: 43.0, lifeExpectancy: 72.0, literacyRate: 71.2 },
  { countryCode: 'NGA', year: 2024, gdpPerCapita: 2255, gdpTotal: 0.51, humanDevelopmentIndex: 0.535, giniCoefficient: 0.350, unemploymentRate: 5.3, urbanizationRate: 52.7, lifeExpectancy: 55.2, literacyRate: 62.0 },
  { countryCode: 'ETH', year: 2024, gdpPerCapita: 1027, gdpTotal: 0.12, humanDevelopmentIndex: 0.498, giniCoefficient: 0.350, unemploymentRate: 5.1, urbanizationRate: 22.7, lifeExpectancy: 66.2, literacyRate: 52.0 },
  { countryCode: 'KEN', year: 2024, gdpPerCapita: 2046, gdpTotal: 0.11, humanDevelopmentIndex: 0.601, giniCoefficient: 0.409, unemploymentRate: 5.7, urbanizationRate: 28.8, lifeExpectancy: 66.7, literacyRate: 81.5 },
  { countryCode: 'ZAF', year: 2024, gdpPerCapita: 6610, gdpTotal: 0.40, humanDevelopmentIndex: 0.713, giniCoefficient: 0.630, unemploymentRate: 32.9, urbanizationRate: 68.2, lifeExpectancy: 64.1, literacyRate: 95.0 },
  { countryCode: 'COL', year: 2024, gdpPerCapita: 6623, gdpTotal: 0.34, humanDevelopmentIndex: 0.752, giniCoefficient: 0.523, unemploymentRate: 10.5, urbanizationRate: 81.6, lifeExpectancy: 77.3, literacyRate: 95.2 },
  { countryCode: 'PER', year: 2024, gdpPerCapita: 6977, gdpTotal: 0.24, humanDevelopmentIndex: 0.762, giniCoefficient: 0.434, unemploymentRate: 3.6, urbanizationRate: 78.3, lifeExpectancy: 76.7, literacyRate: 94.5 },
  
  // Low-income countries
  { countryCode: 'COD', year: 2024, gdpPerCapita: 577, gdpTotal: 0.06, humanDevelopmentIndex: 0.479, giniCoefficient: 0.422, unemploymentRate: 4.5, urbanizationRate: 46.2, lifeExpectancy: 60.0, literacyRate: 80.0 },
  { countryCode: 'TZA', year: 2024, gdpPerCapita: 1199, gdpTotal: 0.07, humanDevelopmentIndex: 0.549, giniCoefficient: 0.401, unemploymentRate: 2.2, urbanizationRate: 35.2, lifeExpectancy: 66.2, literacyRate: 77.9 },
  { countryCode: 'UGA', year: 2024, gdpPerCapita: 915, gdpTotal: 0.04, humanDevelopmentIndex: 0.525, giniCoefficient: 0.426, unemploymentRate: 2.9, urbanizationRate: 26.8, lifeExpectancy: 63.4, literacyRate: 76.5 },
];

async function importEconomicData() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB\n');
    console.log('📊 Importing Economic Indicators Data...\n');
    
    // Check if countries exist
    const countryCount = await Country.countDocuments();
    if (countryCount === 0) {
      console.log('⚠ Warning: No countries found in database.');
      console.log('   Run "npm run seed" first to populate countries.\n');
    }
    
    // Clear existing economic indicators
    const deleted = await EconomicIndicator.deleteMany({});
    console.log(`✓ Cleared ${deleted.deletedCount} existing economic indicators`);
    
    // Import sample data
    await EconomicIndicator.insertMany(sampleEconomicIndicators);
    console.log(`✓ Imported ${sampleEconomicIndicators.length} economic indicators\n`);
    
    // Show summary
    const summary = await EconomicIndicator.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          countries: { $addToSet: '$countryCode' },
        },
      },
    ]);
    
    if (summary.length > 0) {
      console.log('📈 Summary:');
      console.log(`   Total indicators: ${summary[0].total}`);
      console.log(`   Countries covered: ${summary[0].countries.length}`);
      console.log(`   Year: 2024\n`);
    }
    
    console.log('✅ Economic indicators imported successfully!');
    console.log('\nYou can now test your queries:');
    console.log('   GET /api/analytics/economic-population-correlation');
    console.log('   GET /api/analytics/overcrowding-analysis');
    console.log('   GET /api/analytics/projection-by-development');
    
    await mongoose.disconnect();
    console.log('\nDatabase connection closed.');
    
  } catch (error) {
    console.error('Error importing economic data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('importEconomicData.js')) {
  importEconomicData();
}

export { importEconomicData, sampleEconomicIndicators };

