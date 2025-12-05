import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/global_population';

const sampleCountries = [
  {
    country: 'India',
    cca2: 'IN',
    cca3: 'IND',
    pop2025: 1463870000,
    pop2050: 1679590000,
    area: 3287590,
    landAreaKm: 2973190,
    density: 492.3567,
    growthRate: 0.0089,
    worldPercentage: 0.1829,
    rank: 1,
  },
  {
    country: 'China',
    cca2: 'CN',
    cca3: 'CHN',
    pop2025: 1425887000,
    pop2050: 1382000000,
    area: 9596961,
    landAreaKm: 9326400,
    density: 152.8922,
    growthRate: -0.0027,
    worldPercentage: 0.1784,
    rank: 2,
  },
  {
    country: 'United States',
    cca2: 'US',
    cca3: 'USA',
    pop2025: 346570000,
    pop2050: 371621000,
    area: 9834000,
    landAreaKm: 9148220,
    density: 37.8946,
    growthRate: 0.0054,
    worldPercentage: 0.0434,
    rank: 3,
  },
  {
    country: 'Indonesia',
    cca2: 'ID',
    cca3: 'IDN',
    pop2025: 277534000,
    pop2050: 319866000,
    area: 1904569,
    landAreaKm: 1812221,
    density: 153.1198,
    growthRate: 0.0071,
    worldPercentage: 0.0347,
    rank: 4,
  },
  {
    country: 'Pakistan',
    cca2: 'PK',
    cca3: 'PAK',
    pop2025: 240485000,
    pop2050: 308745000,
    area: 796095,
    landAreaKm: 770875,
    density: 311.8876,
    growthRate: 0.0196,
    worldPercentage: 0.0301,
    rank: 5,
  },
  {
    country: 'Brazil',
    cca2: 'BR',
    cca3: 'BRA',
    pop2025: 215313000,
    pop2050: 228033000,
    area: 8514877,
    landAreaKm: 8358140,
    density: 25.7480,
    growthRate: 0.0062,
    worldPercentage: 0.0270,
    rank: 6,
  },
  {
    country: 'Nigeria',
    cca2: 'NG',
    cca3: 'NGA',
    pop2025: 223804000,
    pop2050: 401315000,
    area: 923768,
    landAreaKm: 910768,
    density: 245.8762,
    growthRate: 0.0254,
    worldPercentage: 0.0280,
    rank: 7,
  },
  {
    country: 'Bangladesh',
    cca2: 'BD',
    cca3: 'BGD',
    pop2025: 172953000,
    pop2050: 184347000,
    area: 147570,
    landAreaKm: 130170,
    density: 1330.6234,
    growthRate: 0.0099,
    worldPercentage: 0.0217,
    rank: 8,
  },
  {
    country: 'Russia',
    cca2: 'RU',
    cca3: 'RUS',
    pop2025: 144444000,
    pop2050: 137663000,
    area: 17098246,
    landAreaKm: 16995800,
    density: 8.4943,
    growthRate: -0.0004,
    worldPercentage: 0.0181,
    rank: 9,
  },
  {
    country: 'Mexico',
    cca2: 'MX',
    cca3: 'MEX',
    pop2025: 128932000,
    pop2050: 135355000,
    area: 1964375,
    landAreaKm: 1943945,
    density: 66.3497,
    growthRate: 0.0047,
    worldPercentage: 0.0162,
    rank: 10,
  },
  {
    country: 'Japan',
    cca2: 'JP',
    cca3: 'JPN',
    pop2025: 125124000,
    pop2050: 106365000,
    area: 377975,
    landAreaKm: 364555,
    density: 343.2458,
    growthRate: -0.0048,
    worldPercentage: 0.0157,
    rank: 11,
  },
  {
    country: 'Ethiopia',
    cca2: 'ET',
    cca3: 'ETH',
    pop2025: 120283000,
    pop2050: 190873000,
    area: 1127127,
    landAreaKm: 1000000,
    density: 120.2830,
    growthRate: 0.0250,
    worldPercentage: 0.0151,
    rank: 12,
  },
  {
    country: 'Philippines',
    cca2: 'PH',
    cca3: 'PHL',
    pop2025: 119106000,
    pop2050: 136931000,
    area: 299404,
    landAreaKm: 298170,
    density: 398.8765,
    growthRate: 0.0134,
    worldPercentage: 0.0149,
    rank: 13,
  },
  {
    country: 'Egypt',
    cca2: 'EG',
    cca3: 'EGY',
    pop2025: 104888000,
    pop2050: 130622000,
    area: 1002000,
    landAreaKm: 995450,
    density: 105.3527,
    growthRate: 0.0185,
    worldPercentage: 0.0131,
    rank: 14,
  },
  {
    country: 'DR Congo',
    cca2: 'CD',
    cca3: 'COD',
    pop2025: 99010000,
    pop2050: 194186000,
    area: 2344858,
    landAreaKm: 2267048,
    density: 43.6677,
    growthRate: 0.0291,
    worldPercentage: 0.0124,
    rank: 15,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
    console.log(`Using database: ${MONGODB_URI}`);

    // Get collection stats
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const hasCountryStats = collections.some(c => c.name === 'country_stats_2025');
    
    if (hasCountryStats) {
      const collection = db.collection('country_stats_2025');
      const count = await collection.countDocuments();
      console.log(`✓ Found existing collection 'country_stats_2025' with ${count} documents`);
      console.log('No seeding needed - using existing data');
    } else {
      console.log('Warning: country_stats_2025 collection not found');
      console.log('Please import your data manually or ensure MongoDB is properly set up');
    }

    await mongoose.disconnect();
    console.log('Database check completed!');
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
};

seedDatabase();
