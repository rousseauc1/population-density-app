import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Region from '../models/Region.js';
import Country from '../models/Country.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/global_population';

/**
 * Calculate and update region statistics from country data
 */
async function updateRegionStats() {
  try {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB\n');
    }
    
    console.log('📊 Calculating region statistics from country data...\n');
    
    // Get all regions
    const regions = await Region.find({});
    
    if (regions.length === 0) {
      console.log('⚠ No regions found. Run "npm run fetch-data" first to create regions.');
      await mongoose.disconnect();
      return;
    }
    
    // Get all countries for efficient lookup
    const countries = await Country.find({});
    const countryMap = new Map();
    countries.forEach(country => {
      countryMap.set(country.cca3, country);
    });
    
    let updatedCount = 0;
    
    // Calculate stats for each region
    for (const region of regions) {
      const countryData = [];
      
      // Get data for all countries in this region
      region.countries.forEach(cca3 => {
        const country = countryMap.get(cca3);
        if (country) {
          countryData.push({
            pop2025: country.pop2025 || 0,
            pop2050: country.pop2050 || 0,
            density: country.density || 0,
            growthRate: country.growthRate || 0,
            landAreaKm: country.landAreaKm || country.area || 0,
          });
        }
      });
      
      if (countryData.length === 0) {
        console.log(`⚠ No country data found for region: ${region.name}`);
        continue;
      }
      
      // Calculate aggregated statistics
      const totalPop2025 = countryData.reduce((sum, c) => sum + (c.pop2025 || 0), 0);
      const totalPop2050 = countryData.reduce((sum, c) => sum + (c.pop2050 || 0), 0);
      const totalArea = countryData.reduce((sum, c) => sum + (c.landAreaKm || 0), 0);
      
      // Calculate averages (only for countries with data)
      const densitiesWithData = countryData.filter(c => c.density > 0);
      const growthRatesWithData = countryData.filter(c => c.growthRate !== 0);
      
      const averageDensity = densitiesWithData.length > 0
        ? densitiesWithData.reduce((sum, c) => sum + c.density, 0) / densitiesWithData.length
        : 0;
      
      const averageGrowthRate = growthRatesWithData.length > 0
        ? growthRatesWithData.reduce((sum, c) => sum + c.growthRate, 0) / growthRatesWithData.length
        : 0;
      
      // Update the region
      await Region.findByIdAndUpdate(region._id, {
        totalPopulation2025: totalPop2025,
        totalPopulation2050: totalPop2050,
        averageDensity: parseFloat(averageDensity.toFixed(2)),
        averageGrowthRate: parseFloat(averageGrowthRate.toFixed(4)),
        totalArea: totalArea,
        updatedAt: new Date(),
      });
      
      updatedCount++;
      console.log(`✓ Updated ${region.name}: ${countryData.length} countries, Pop 2025: ${(totalPop2025 / 1000000).toFixed(1)}M`);
    }
    
    console.log(`\n✅ Updated statistics for ${updatedCount} regions`);
    console.log('\nRegion statistics now include:');
    console.log('   - Total Population 2025');
    console.log('   - Total Population 2050');
    console.log('   - Average Density');
    console.log('   - Average Growth Rate');
    console.log('   - Total Area');
    
    // Only disconnect if we created the connection
    if (mongoose.connection.readyState === 1 && process.argv[1]?.endsWith('updateRegionStats.js')) {
      await mongoose.disconnect();
      console.log('\nDatabase connection closed.');
    }
    
  } catch (error) {
    console.error('Error updating region stats:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('updateRegionStats.js')) {
  updateRegionStats();
}

export { updateRegionStats };

