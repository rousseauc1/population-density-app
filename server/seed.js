import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Country from './models/Country.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/population_density';

const sampleCountries = [
  {
    id: 'USA',
    name: 'United States',
    population: 331900000,
    area: 9834000,
    population_density: 33.7,
    life_expectancy: 78.9,
    gdp: 25744100000000,
    region: 'North America',
    coordinates: { latitude: 37.0902, longitude: -95.7129 },
  },
  {
    id: 'CHN',
    name: 'China',
    population: 1411750000,
    area: 9596961,
    population_density: 147.1,
    life_expectancy: 77.4,
    gdp: 17963170000000,
    region: 'Asia',
    coordinates: { latitude: 35.8617, longitude: 104.1954 },
  },
  {
    id: 'IND',
    name: 'India',
    population: 1380004000,
    area: 3287590,
    population_density: 420.0,
    life_expectancy: 71.4,
    gdp: 3737170000000,
    region: 'Asia',
    coordinates: { latitude: 20.5937, longitude: 78.9629 },
  },
  {
    id: 'BRA',
    name: 'Brazil',
    population: 215313498,
    area: 8514877,
    population_density: 25.3,
    life_expectancy: 76.0,
    gdp: 1839000000000,
    region: 'South America',
    coordinates: { latitude: -14.2350, longitude: -51.9253 },
  },
  {
    id: 'RUS',
    name: 'Russia',
    population: 144444359,
    area: 17098246,
    population_density: 8.4,
    life_expectancy: 72.6,
    gdp: 1778880000000,
    region: 'Europe',
    coordinates: { latitude: 61.5240, longitude: 105.3188 },
  },
  {
    id: 'JPN',
    name: 'Japan',
    population: 125124989,
    area: 377975,
    population_density: 331.0,
    life_expectancy: 84.6,
    gdp: 4230840000000,
    region: 'Asia',
    coordinates: { latitude: 36.2048, longitude: 138.2529 },
  },
  {
    id: 'DEU',
    name: 'Germany',
    population: 84339002,
    area: 357022,
    population_density: 236.0,
    life_expectancy: 81.9,
    gdp: 4108700000000,
    region: 'Europe',
    coordinates: { latitude: 51.1657, longitude: 10.4515 },
  },
  {
    id: 'GBR',
    name: 'United Kingdom',
    population: 67330000,
    area: 242495,
    population_density: 277.0,
    life_expectancy: 81.3,
    gdp: 3160600000000,
    region: 'Europe',
    coordinates: { latitude: 55.3781, longitude: -3.4360 },
  },
  {
    id: 'FRA',
    name: 'France',
    population: 68014000,
    area: 643801,
    population_density: 105.6,
    life_expectancy: 82.9,
    gdp: 2780000000000,
    region: 'Europe',
    coordinates: { latitude: 46.2276, longitude: 2.2137 },
  },
  {
    id: 'AUS',
    name: 'Australia',
    population: 26469000,
    area: 7692024,
    population_density: 3.4,
    life_expectancy: 83.5,
    gdp: 1376000000000,
    region: 'Oceania',
    coordinates: { latitude: -25.2744, longitude: 133.7751 },
  },
  {
    id: 'CAN',
    name: 'Canada',
    population: 39858480,
    area: 9984670,
    population_density: 3.97,
    life_expectancy: 82.5,
    gdp: 2117000000000,
    region: 'North America',
    coordinates: { latitude: 56.1304, longitude: -106.3468 },
  },
  {
    id: 'MEX',
    name: 'Mexico',
    population: 128932753,
    area: 1964375,
    population_density: 65.6,
    life_expectancy: 74.1,
    gdp: 1158000000000,
    region: 'North America',
    coordinates: { latitude: 23.6345, longitude: -102.5528 },
  },
  {
    id: 'ZAF',
    name: 'South Africa',
    population: 60142978,
    area: 1221037,
    population_density: 49.24,
    life_expectancy: 64.1,
    gdp: 405800000000,
    region: 'Africa',
    coordinates: { latitude: -30.5595, longitude: 22.9375 },
  },
  {
    id: 'EGY',
    name: 'Egypt',
    population: 104888000,
    area: 1002000,
    population_density: 104.5,
    life_expectancy: 72.0,
    gdp: 476700000000,
    region: 'Africa',
    coordinates: { latitude: 26.8206, longitude: 30.8025 },
  },
  {
    id: 'NGA',
    name: 'Nigeria',
    population: 223804632,
    area: 923768,
    population_density: 242.5,
    life_expectancy: 54.7,
    gdp: 445760000000,
    region: 'Africa',
    coordinates: { latitude: 9.0820, longitude: 8.6753 },
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Country.deleteMany({});
    console.log('Cleared existing country data');

    // Insert sample data
    const result = await Country.insertMany(sampleCountries);
    console.log(`✓ Successfully seeded ${result.length} countries`);

    // Display inserted data
    console.log('\nInserted countries:');
    result.forEach((country) => {
      console.log(`  - ${country.name} (${country.id}): ${country.population_density} people/km²`);
    });

    await mongoose.disconnect();
    console.log('\nDatabase seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
