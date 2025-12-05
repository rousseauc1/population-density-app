# Quick Start: Getting Real Data

This guide shows you the **easiest ways** to get real data for your collections.

## 🚀 Option 1: Automatic Fetch (Easiest - Regions Only)

The script will automatically fetch region data from REST Countries API (free, no API key needed):

```bash
cd server
npm install axios  # If not already installed
npm run fetch-data
```

This will:
- ✅ Fetch all regions and subregions from REST Countries API
- ✅ Automatically map countries to their continents/subregions
- ✅ Import into your MongoDB database

**Note**: Economic indicators require additional setup (see below).

---

## 🎯 Option 2: Use Sample Data (Quickest for Testing)

For testing your queries, use the sample data already included:

```bash
cd server
npm run seed
```

This uses realistic sample data for all 3 collections.

---

## 📊 Option 3: Manual CSV Import (Most Control)

### Step 1: Download Data

1. **HDI Data** (Human Development Index):
   - Visit: https://hdr.undp.org/data-center/human-development-index
   - Click "Download Data" → Choose CSV format
   - Save as `server/data/hdi_data.csv`

2. **GDP Data**:
   - Visit: https://ourworldindata.org/gdp-per-capita
   - Click "Download" → CSV
   - Save as `server/data/gdp_data.csv`

3. **Life Expectancy**:
   - Visit: https://ourworldindata.org/life-expectancy
   - Click "Download" → CSV
   - Save as `server/data/life_expectancy.csv`

### Step 2: Install CSV Parser

```bash
cd server
npm install csv-parse
```

### Step 3: Modify Import Script

Edit `server/scripts/importCSV.js` to match your CSV column names, then run:

```bash
node server/scripts/importCSV.js
```

---

## 🌐 Option 4: World Bank API (Most Complete)

### Step 1: Get Free API Key

1. Visit: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
2. Register for free API access
3. Get your API key

### Step 2: Add to .env

```bash
WORLD_BANK_API_KEY=your_api_key_here
```

### Step 3: Update fetchData.js

Uncomment the World Bank API code in `server/scripts/fetchData.js`, then run:

```bash
npm run fetch-data
```

---

## 📋 Recommended Approach

**For Quick Setup (Testing)**:
```bash
npm run seed  # Uses sample data
```

**For Production (Real Data)**:
1. Run `npm run fetch-data` for regions (automatic)
2. Download CSV files for economic indicators (Option 3)
3. Import CSVs using the import script

---

## 🔍 Data Source Summary

| Collection | Easiest Source | API Key Needed? |
|------------|---------------|-----------------|
| **Regions** | REST Countries API | ❌ No |
| **Economic Indicators** | Our World in Data (CSV) | ❌ No |
| **Economic Indicators** | World Bank API | ✅ Yes (free) |

---

## 📝 Data Format Requirements

### Regions
- Needs: `name`, `type`, `countries` (array of cca3 codes)
- Source: REST Countries API provides this automatically

### Economic Indicators
- Needs: `countryCode` (cca3), `year`, `gdpPerCapita`, `hdi`, `lifeExpectancy`, etc.
- Sources: World Bank API, UNDP, Our World in Data

---

## ✅ Verification

After importing, verify your data:

```bash
# Check regions
curl http://localhost:5000/api/regions

# Check economic indicators
curl http://localhost:5000/api/economic-indicators

# Test a complex query
curl http://localhost:5000/api/analytics/regional-analysis
```

---

## 🆘 Troubleshooting

**"No countries found"**: 
- Run `npm run seed` first to populate countries

**"API rate limit"**:
- Add delays between requests in fetchData.js
- Use CSV import instead

**"CSV parsing errors"**:
- Check CSV column names match the import script
- Ensure CSV uses UTF-8 encoding

---

For more details, see `DATA_SOURCES.md`

