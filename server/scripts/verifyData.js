import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Region from '../models/Region.js';
import EconomicIndicator from '../models/EconomicIndicator.js';
import Country from '../models/Country.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/global_population';

async function verifyData() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB\n');
    console.log('🔍 Verifying collections...\n');
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');
    
    // Check Regions
    const regionCount = await Region.countDocuments();
    console.log(`📊 Regions collection ('regions'):`);
    console.log(`   Total documents: ${regionCount}`);
    
    if (regionCount > 0) {
      const sampleRegion = await Region.findOne();
      console.log(`   Sample region: ${sampleRegion.name} (${sampleRegion.type})`);
      console.log(`   Countries in sample: ${sampleRegion.countries.length}`);
      console.log(`   Total Pop 2025: ${sampleRegion.totalPopulation2025 || 0}`);
      console.log(`   Average Density: ${sampleRegion.averageDensity || 0}`);
    } else {
      console.log('   ⚠ No regions found!');
      console.log('   Run: npm run fetch-data');
    }
    console.log('');
    
    // Check Economic Indicators
    const indicatorCount = await EconomicIndicator.countDocuments();
    console.log(`💰 Economic Indicators collection ('economic_indicators'):`);
    console.log(`   Total documents: ${indicatorCount}`);
    
    if (indicatorCount > 0) {
      const sampleIndicator = await EconomicIndicator.findOne();
      console.log(`   Sample indicator: ${sampleIndicator.countryCode} (${sampleIndicator.year})`);
      console.log(`   GDP per capita: ${sampleIndicator.gdpPerCapita || 'N/A'}`);
      console.log(`   Life expectancy: ${sampleIndicator.lifeExpectancy || 'N/A'}`);
      
      // Count by year
      const byYear = await EconomicIndicator.aggregate([
        { $group: { _id: '$year', count: { $sum: 1 } } },
        { $sort: { _id: -1 } }
      ]);
      console.log(`   Breakdown by year:`);
      byYear.forEach(item => {
        console.log(`     ${item._id}: ${item.count} countries`);
      });
    } else {
      console.log('   ⚠ No economic indicators found!');
      console.log('   Run: npm run fetch-data (for real data)');
      console.log('   Or: npm run import-economic (for sample data)');
    }
    console.log('');
    
    // Check Countries
    const countryCount = await Country.countDocuments();
    console.log(`🌍 Countries collection ('country_stats_2025'):`);
    console.log(`   Total documents: ${countryCount}`);
    
    if (countryCount > 0) {
      const sampleCountry = await Country.findOne();
      console.log(`   Sample country: ${sampleCountry.country} (${sampleCountry.cca3})`);
      console.log(`   Pop 2025: ${sampleCountry.pop2025 || 'N/A'}`);
    } else {
      console.log('   ⚠ No countries found!');
      console.log('   Run: npm run seed');
    }
    console.log('');
    
    // Check raw collections (in case model names don't match)
    console.log('🔎 Checking raw collection counts:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Verification complete!');
    
  } catch (error) {
    console.error('Error verifying data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('verifyData.js')) {
  verifyData();
}

export { verifyData };

