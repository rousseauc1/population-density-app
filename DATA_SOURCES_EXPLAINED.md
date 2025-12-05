# Data Sources Explained

## Summary

**Regions**: ✅ **REAL DATA** - Fetched from REST Countries API (free, no API key)

**Economic Indicators**: ⚠️ **SAMPLE DATA** in seed.js - But now you can fetch REAL data!

---

## What Changed

I've updated `server/scripts/fetchData.js` to actually fetch **real economic data** from the World Bank API (free, no API key required for public data).

### To Get Real Economic Data:

```bash
cd server
npm run fetch-data
```

This will now:
1. ✅ Fetch **real regions** from REST Countries API (as before)
2. ✅ Fetch **real economic indicators** from World Bank API (NEW!)

---

## What Data You'll Get

### From World Bank API (Real Data):
- ✅ GDP per capita (current US$)
- ✅ GDP total (calculated)
- ✅ Life expectancy at birth
- ✅ Urbanization rate (% of population)

### Not Available from World Bank (Use Sample Data or CSV):
- ❌ Human Development Index (HDI) - Get from UNDP
- ❌ Gini coefficient - Get from World Bank CSV or Our World in Data
- ❌ Unemployment rate - Get from World Bank CSV
- ❌ Literacy rate - Get from UNESCO or World Bank CSV

---

## Options for Complete Data

### Option 1: Real Data from APIs (Partial)
```bash
npm run fetch-data  # Gets GDP, life expectancy, urbanization
```
Then add HDI, Gini, etc. via CSV import (see Option 2)

### Option 2: Sample Data (Complete but Not Real)
```bash
npm run import-economic  # Gets all fields with realistic sample data
```
Good for testing queries, but values are not from live sources.

### Option 3: CSV Imports (Most Complete Real Data)
1. Download CSVs from:
   - HDI: https://hdr.undp.org/data-center/human-development-index
   - GDP/Gini: https://ourworldindata.org/
2. Use `server/scripts/importCSV.js` to import

---

## Data Source Comparison

| Data Type | Source | Real? | API Key? | Complete? |
|-----------|--------|------|----------|-----------|
| **Regions** | REST Countries | ✅ Yes | ❌ No | ✅ Yes |
| **GDP, Life Exp** | World Bank API | ✅ Yes | ❌ No | ✅ Yes |
| **HDI, Gini, etc.** | Sample data | ❌ No | ❌ No | ✅ Yes |
| **HDI, Gini, etc.** | CSV downloads | ✅ Yes | ❌ No | ✅ Yes |

---

## Recommendation

**For Testing/Demo:**
- Use `npm run import-economic` (sample data, all fields)

**For Real Data:**
- Use `npm run fetch-data` (real GDP, life expectancy)
- Then add HDI/Gini via CSV if needed

**For Production:**
- Use `npm run fetch-data` for basic indicators
- Import HDI, Gini, unemployment from CSV files
- See `QUICK_START_DATA.md` for CSV sources

---

## Quick Start

```bash
# Get real regions + real economic data (GDP, life expectancy)
cd server
npm run fetch-data

# OR get sample data with all fields (for testing)
npm run import-economic
```

