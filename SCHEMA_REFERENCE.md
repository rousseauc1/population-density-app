# Updated Database Schema

Your Population Density application has been updated to match your actual MongoDB schema:

## 📊 Database Schema Reference

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | MongoDB auto-generated ID |
| `country` | String | Country name (e.g., "India") |
| `cca2` | String | 2-letter country code (e.g., "IN") |
| `cca3` | String | 3-letter country code (e.g., "IND") |
| `pop2025` | Number | Current population in 2025 |
| `pop2050` | Number | Projected population for 2050 |
| `area` | Number | Total area (in specified unit) |
| `landAreaKm` | Number | Land area in square kilometers |
| `density` | Number | Population density (people/km²) |
| `growthRate` | Number | Annual population growth rate (decimal) |
| `worldPercentage` | Number | Percentage of world population (decimal) |
| `rank` | Number | Ranking by population |

## 📋 Example Document

```json
{
  "_id": "692dedb1d7ca965d5d463ff3",
  "pop2025": 1463870000,
  "pop2050": 1679590000,
  "country": "India",
  "area": 3287590,
  "landAreaKm": 2973190,
  "cca2": "IN",
  "cca3": "IND",
  "density": 492.3567,
  "growthRate": 0.0089,
  "worldPercentage": 0.1829,
  "rank": 1
}
```

## 🔄 Available Metrics in UI

The application now displays these metrics:

1. **Population Density** (`density`)
   - People per km²
   - Color scale normalized across all countries

2. **Population 2025** (`pop2025`)
   - Current population data
   - Displayed in millions on sidebar

3. **Population 2050** (`pop2050`)
   - Projected population data
   - Shows future growth expectations

4. **Growth Rate** (`growthRate`)
   - Annual percentage growth
   - Shows demographic trends

5. **World Percentage** (`worldPercentage`)
   - Share of world population
   - Displayed as percentage

## 🔗 API Endpoints

All endpoints work with the new schema:

```bash
# Get all countries
GET /api/countries

# Get specific country by code
GET /api/countries/IND

# Create new country
POST /api/countries
Body: { country, cca2, cca3, pop2025, pop2050, landAreaKm, density, growthRate, worldPercentage, rank }

# Update country
PUT /api/countries/IND
Body: { density: 500, growthRate: 0.009 }

# Delete country
DELETE /api/countries/IND

# Get statistics
GET /api/countries/stats/summary
```

## 📝 Sample Statistics Response

```json
{
  "totalCountries": 195,
  "avgDensity": 58.432,
  "maxDensity": 1330.62,
  "minDensity": 2.45,
  "totalPopulation": 8000000000,
  "avgGrowthRate": 0.0089
}
```

## 🎯 What Changed

### Before
- Field names: `id`, `name`, `population`, `population_density`, `life_expectancy`
- Limited to basic statistics

### After
- Field names: `country`, `cca3`, `pop2025`, `pop2050`, `density`, `growthRate`, `worldPercentage`
- Rich demographic data with future projections
- Better alignment with ISO standards

## ✅ Components Updated

- ✅ MongoDB Schema (`server/models/Country.js`)
- ✅ API Routes (`server/routes/countries.js`)
- ✅ Seed Data (`server/seed.js`)
- ✅ React Components (App, Sidebar, Controls, MapComponent)
- ✅ Utilities (colorScale, geoData)

## 🚀 Quick Start with New Schema

1. **Install dependencies:**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. **Seed the database:**
   ```bash
   cd server && npm run seed
   ```

3. **Start both servers:**
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2
   npm run server
   ```

4. **Open browser:**
   ```
   http://localhost:5173
   ```

## 💡 Tips

- The application automatically normalizes colors based on metric ranges
- Growth rate is stored as decimal (0.0089 = 0.89%)
- World percentage is stored as decimal (0.1829 = 18.29%)
- 15 countries are included in the seed data
- All 195+ countries can be added from the actual database

## 📞 Next Steps

1. Import all country data from your database
2. Customize the color scale in `src/utils/colorScale.js`
3. Add additional metrics as needed
4. Deploy to production

---

**Your app is now fully aligned with your MongoDB schema! 🌍**
