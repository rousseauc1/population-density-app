import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Region from '../models/Region.js';
import EconomicIndicator from '../models/EconomicIndicator.js';
import Country from '../models/Country.js';
import { updateRegionStats } from './updateRegionStats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/global_population';

/**
 * Fetch region data from REST Countries API
 */
async function fetchRegionData() {
  try {
    console.log('Fetching region data from REST Countries API...');
    
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=cca3,name,region,subregion');
    const countries = response.data;
    
    // Group countries by region (continent)
    const regionsMap = new Map();
    const subregionsMap = new Map();
    
    countries.forEach(country => {
      if (!country.cca3) return;
      
      const cca3 = country.cca3;
      const region = country.region || 'Unknown';
      const subregion = country.subregion || 'Unknown';
      
      // Add to continent
      if (!regionsMap.has(region)) {
        regionsMap.set(region, []);
      }
      regionsMap.get(region).push(cca3);
      
      // Add to subregion
      if (!subregionsMap.has(subregion)) {
        subregionsMap.set(subregion, []);
      }
      subregionsMap.get(subregion).push(cca3);
    });
    
    const regions = [];
    
    // Create continent regions
    regionsMap.forEach((countryCodes, name) => {
      regions.push({
        name: name,
        type: 'continent',
        countries: countryCodes,
        totalPopulation2025: 0,
        totalPopulation2050: 0,
        averageDensity: 0,
        averageGrowthRate: 0,
        totalArea: 0,
      });
    });
    
    // Create subregion regions
    subregionsMap.forEach((countryCodes, name) => {
      regions.push({
        name: name,
        type: 'subregion',
        countries: countryCodes,
        totalPopulation2025: 0,
        totalPopulation2050: 0,
        averageDensity: 0,
        averageGrowthRate: 0,
        totalArea: 0,
      });
    });
    
    console.log(`✓ Fetched ${regions.length} regions (${regionsMap.size} continents, ${subregionsMap.size} subregions)`);
    return regions;
    
  } catch (error) {
    console.error('Error fetching region data:', error.message);
    return [];
  }
}

/**
 * Fetch economic indicators from World Bank API
 * Note: World Bank API is free and doesn't require an API key for public data
 * However, it uses ISO 2-letter codes (cca2) instead of 3-letter codes (cca3)
 */
async function fetchEconomicIndicators() {
  try {
    console.log('Fetching economic indicators from World Bank API...');
    console.log('   (This may take a few minutes for many countries)\n');
    
    // Get all countries from database (need both cca2 and cca3)
    const countries = await Country.find({}, 'cca2 cca3').lean();
    
    if (countries.length === 0) {
      console.log('⚠ No countries found in database. Please seed countries first.');
      return [];
    }
    
    const indicators = [];
    const year = 2022; // Use 2022 as latest complete data (2024 may not be available yet)
    let successCount = 0;
    let errorCount = 0;
    
    // World Bank API country code mapping (some countries need special codes)
    const wbCodeMap = {
      'USA': 'US', 'GBR': 'GB', 'RUS': 'RU', 'KOR': 'KR', 'IRN': 'IR',
      'VNM': 'VN', 'PSE': 'PS', 'TWN': 'TW', 'HKG': 'HK', 'MAC': 'MO'
    };
    
    for (const country of countries) {
      try {
        // Get World Bank country code (use cca2, or mapped code)
        const wbCode = wbCodeMap[country.cca3] || country.cca2;
        if (!wbCode) {
          errorCount++;
          continue;
        }
        
        // Fetch multiple indicators in parallel
        const [gdpResponse, lifeResponse, urbResponse] = await Promise.allSettled([
          // GDP per capita (current US$)
          axios.get(
            `https://api.worldbank.org/v2/country/${wbCode}/indicator/NY.GDP.PCAP.CD?format=json&date=${year}&per_page=1`,
            { timeout: 10000 }
          ),
          // Life expectancy at birth
          axios.get(
            `https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.DYN.LE00.IN?format=json&date=${year}&per_page=1`,
            { timeout: 10000 }
          ),
          // Urban population (% of total)
          axios.get(
            `https://api.worldbank.org/v2/country/${wbCode}/indicator/SP.URB.TOTL.IN.ZS?format=json&date=${year}&per_page=1`,
            { timeout: 10000 }
          ),
        ]);
        
        // Extract values
        const gdpPerCapita = gdpResponse.status === 'fulfilled' 
          ? gdpResponse.value.data[1]?.[0]?.value 
          : null;
        const lifeExpectancy = lifeResponse.status === 'fulfilled'
          ? lifeResponse.value.data[1]?.[0]?.value
          : null;
        const urbanizationRate = urbResponse.status === 'fulfilled'
          ? urbResponse.value.data[1]?.[0]?.value
          : null;
        
        // Only add if we got at least one value
        if (gdpPerCapita || lifeExpectancy || urbanizationRate) {
          // Calculate GDP total (rough estimate: GDP per capita * population / 1 billion)
          const countryData = await Country.findOne({ cca3: country.cca3 }, 'pop2025').lean();
          const gdpTotal = gdpPerCapita && countryData?.pop2025
            ? (gdpPerCapita * countryData.pop2025) / 1000000000
            : null;
          
          indicators.push({
            countryCode: country.cca3,
            year: year,
            gdpPerCapita: gdpPerCapita ? Math.round(gdpPerCapita) : null,
            gdpTotal: gdpTotal ? parseFloat(gdpTotal.toFixed(2)) : null,
            lifeExpectancy: lifeExpectancy ? parseFloat(lifeExpectancy.toFixed(1)) : null,
            urbanizationRate: urbanizationRate ? parseFloat(urbanizationRate.toFixed(1)) : null,
            // Note: HDI, Gini, unemployment, literacy require other sources
            // These can be added via CSV import or other APIs
          });
          
          successCount++;
        } else {
          errorCount++;
        }
        
        // Rate limiting - be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Progress indicator
        if ((successCount + errorCount) % 10 === 0) {
          process.stdout.write(`   Progress: ${successCount + errorCount}/${countries.length} countries\r`);
        }
        
      } catch (error) {
        errorCount++;
        // Silent fail for individual countries
      }
    }
    
    console.log(`\n✓ Fetched data for ${successCount} countries`);
    if (errorCount > 0) {
      console.log(`⚠ Could not fetch data for ${errorCount} countries`);
      console.log('   (Some countries may not be in World Bank database)');
    }
    console.log('\n📝 Note: HDI, Gini coefficient, unemployment, and literacy rates');
    console.log('   are not available from World Bank API. Use CSV imports for these.');
    console.log('   See QUICK_START_DATA.md for CSV sources.\n');
    
    return indicators;
    
  } catch (error) {
    console.error('Error fetching economic indicators:', error.message);
    console.log('\n💡 Tip: If API fails, you can use sample data:');
    console.log('   npm run import-economic\n');
    return [];
  }
}

/**
 * Alternative: Fetch from Our World in Data CSV
 * You can download CSV files and parse them here
 */
async function fetchFromCSV() {
  console.log('\n📥 Alternative: Download CSV files from:');
  console.log('   - HDI: https://hdr.undp.org/data-center/human-development-index');
  console.log('   - GDP: https://ourworldindata.org/grapher/gdp-per-capita-worldbank');
  console.log('   - Life Expectancy: https://ourworldindata.org/life-expectancy');
  console.log('\n   Then parse and import using a CSV parser like "csv-parse"');
}

/**
 * Main function to fetch and import all data
 */
async function main() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB\n');
    
    // Fetch and save regions
    const regions = await fetchRegionData();
    if (regions.length > 0) {
      await Region.deleteMany({});
      await Region.insertMany(regions);
      console.log(`✓ Imported ${regions.length} regions into database\n`);
      
      // Update region statistics from country data
      console.log('Calculating region statistics from country data...');
      try {
        // Reconnect if needed (updateRegionStats will handle its own connection)
        await updateRegionStats();
        console.log('');
      } catch (error) {
        console.log('⚠ Could not update region stats:', error.message);
        console.log('   Run "npm run update-region-stats" manually after countries are loaded\n');
      }
    }
    
    // Fetch economic indicators
    const indicators = await fetchEconomicIndicators();
    if (indicators.length > 0) {
      console.log(`\n💾 Saving ${indicators.length} economic indicators to database...`);
      try {
        await EconomicIndicator.deleteMany({});
        const result = await EconomicIndicator.insertMany(indicators);
        console.log(`✓ Successfully imported ${result.length} economic indicators into 'economic_indicators' collection\n`);
      } catch (error) {
        console.error('❌ Error saving economic indicators:', error.message);
        if (error.code === 11000) {
          console.log('   (Duplicate key error - some indicators may already exist)');
        }
        console.log('   Try running: npm run import-economic\n');
      }
    } else {
      console.log('⚠ No economic indicators fetched.');
      console.log('   Possible reasons:');
      console.log('   - No countries in database (run: npm run seed)');
      console.log('   - World Bank API rate limit or connection issue');
      console.log('   - Countries missing cca2 codes');
      console.log('\n   Alternative: Use sample data: npm run import-economic\n');
    }
    
    // Show alternative options
    await fetchFromCSV();
    
    console.log('\n✅ Data fetching completed!');
    console.log('\n📊 Summary:');
    console.log('   - Regions: Real data from REST Countries API');
    console.log('   - Economic Indicators: Real data from World Bank API');
    console.log('\n💡 To add HDI, Gini coefficient, unemployment, and literacy rates:');
    console.log('   - Download CSVs from Our World in Data or UNDP');
    console.log('   - Use: npm run import-economic (for sample data with all fields)');
    console.log('   - Or modify server/scripts/importCSV.js for CSV imports');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if called directly (not imported)
if (process.argv[1] && process.argv[1].endsWith('fetchData.js')) {
  main();
}

export { fetchRegionData, fetchEconomicIndicators };

