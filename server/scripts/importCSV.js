/**
 * CSV Import Script
 * 
 * This script helps you import economic indicator data from CSV files.
 * 
 * Example usage:
 * 1. Download CSV from Our World in Data or UNDP
 * 2. Place it in server/data/ directory
 * 3. Run: node server/scripts/importCSV.js
 * 
 * You'll need to install csv-parse:
 * npm install csv-parse
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EconomicIndicator from '../models/EconomicIndicator.js';
import Country from '../models/Country.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/global_population';

/**
 * Example CSV import function
 * Modify based on your CSV structure
 */
async function importHDIData() {
  try {
    const csvPath = path.join(__dirname, '..', 'data', 'hdi_data.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('⚠ CSV file not found at:', csvPath);
      console.log('   Please download HDI data and place it in server/data/hdi_data.csv');
      return;
    }
    
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    // Map CSV columns to your schema
    // Adjust based on your CSV structure
    const indicators = records.map(record => ({
      countryCode: record['Country Code'] || record['ISO3'],
      year: parseInt(record['Year'] || '2024'),
      humanDevelopmentIndex: parseFloat(record['HDI'] || record['Human Development Index']),
      lifeExpectancy: parseFloat(record['Life Expectancy'] || record['Life expectancy at birth']),
      // Add more mappings as needed
    })).filter(ind => ind.countryCode); // Remove invalid entries
    
    await EconomicIndicator.insertMany(indicators);
    console.log(`✓ Imported ${indicators.length} HDI records`);
    
  } catch (error) {
    console.error('Error importing CSV:', error.message);
  }
}

/**
 * Import GDP data from CSV
 */
async function importGDPData() {
  try {
    const csvPath = path.join(__dirname, '..', 'data', 'gdp_data.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('⚠ CSV file not found at:', csvPath);
      return;
    }
    
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    // Update existing indicators or create new ones
    for (const record of records) {
      await EconomicIndicator.findOneAndUpdate(
        {
          countryCode: record['Country Code'] || record['ISO3'],
          year: parseInt(record['Year'] || '2024'),
        },
        {
          $set: {
            gdpPerCapita: parseFloat(record['GDP per capita'] || record['Value']),
            gdpTotal: parseFloat(record['GDP Total'] || record['GDP (current US$)']),
          },
        },
        { upsert: true }
      );
    }
    
    console.log(`✓ Updated GDP data for ${records.length} countries`);
    
  } catch (error) {
    console.error('Error importing GDP CSV:', error.message);
  }
}

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('Created data directory:', dataDir);
    }
    
    console.log('📥 CSV Import Script');
    console.log('   Place your CSV files in: server/data/\n');
    
    // Uncomment the imports you want to use:
    // await importHDIData();
    // await importGDPData();
    
    console.log('\n✅ Import completed!');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

