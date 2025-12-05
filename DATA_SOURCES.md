# Data Sources for Collections

This document lists free, open data sources for populating the **Region** and **EconomicIndicator** collections.

## 1. Region Data Sources

### Option A: REST Countries API (Recommended - Free, No API Key)
**URL**: https://restcountries.com/

**Features**:
- Free, no API key required
- Includes continent, subregion, and region data
- Uses ISO 3166-1 alpha-3 codes (cca3)
- JSON format

**Example API Call**:
```bash
# Get all countries with region info
curl https://restcountries.com/v3.1/all?fields=cca3,name,region,subregion
```

**Data Mapping**:
- `region` → continent (e.g., "Asia", "Africa", "Americas")
- `subregion` → subregion (e.g., "South Asia", "East Asia")
- `cca3` → country code

### Option B: World Bank API
**URL**: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

**Features**:
- Official World Bank data
- Requires free API key
- Includes regional classifications

### Option C: Manual Mapping (For Custom Regions)
You can manually create region mappings based on:
- UN Statistics Division: https://unstats.un.org/unsd/methodology/m49/
- CIA World Factbook: https://www.cia.gov/the-world-factbook/

---

## 2. Economic Indicators Data Sources

### Option A: World Bank Open Data (Recommended - Free)
**URL**: https://data.worldbank.org/

**API**: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-api-documentation

**Available Indicators**:
- GDP per capita: `NY.GDP.PCAP.CD`
- GDP total: `NY.GDP.MKTP.CD`
- Life expectancy: `SP.DYN.LE00.IN`
- Urbanization: `SP.URB.TOTL.IN.ZS`
- Literacy rate: `SE.ADT.LITR.ZS`

**Example API Call**:
```bash
# GDP per capita for all countries in 2024
https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&date=2024
```

**Note**: Requires free API key registration.

### Option B: UNDP Human Development Index (HDI)
**URL**: https://hdr.undp.org/data-center/documentation-and-downloads

**Features**:
- Free CSV downloads
- Includes HDI, life expectancy, education index
- Updated annually

**Direct Download**: https://hdr.undp.org/data-center/human-development-index#/indicies/HDI

### Option C: Our World in Data (Free CSV/JSON)
**URL**: https://ourworldindata.org/

**Features**:
- Free, open-source data
- CSV downloads available
- Includes GDP, life expectancy, HDI, Gini coefficient
- GitHub repository: https://github.com/owid/owid-datasets

**Key Datasets**:
- GDP per capita: https://ourworldindata.org/grapher/gdp-per-capita-worldbank
- Life expectancy: https://ourworldindata.org/life-expectancy
- HDI: https://ourworldindata.org/human-development-index

### Option D: Gapminder (Free)
**URL**: https://www.gapminder.org/data/

**Features**:
- Free data downloads
- Includes GDP, life expectancy, population
- CSV format

### Option E: World Bank API via npm package
**Package**: `world-bank-api` or use direct HTTP requests

---

## 3. Quick Data Fetching Script

I'll create a script to automatically fetch and import data from these sources.

---

## 4. Manual Data Entry (For Testing)

For quick testing, you can use the sample data already in `server/seed.js`. For production, use the sources above.

---

## Recommended Approach

1. **For Regions**: Use REST Countries API (easiest, no API key)
2. **For Economic Indicators**: Use World Bank API + UNDP HDI data
3. **For Quick Setup**: Use the sample data in seed.js

---

## Data Format Examples

### Region Data Format
```json
{
  "name": "Asia",
  "type": "continent",
  "countries": ["IND", "CHN", "IDN", "PAK", "BGD", ...],
  "totalPopulation2025": 0,
  "totalPopulation2050": 0,
  "averageDensity": 0,
  "averageGrowthRate": 0,
  "totalArea": 0
}
```

### Economic Indicator Data Format
```json
{
  "countryCode": "USA",
  "year": 2024,
  "gdpPerCapita": 76398,
  "gdpTotal": 26.95,
  "humanDevelopmentIndex": 0.921,
  "giniCoefficient": 0.415,
  "unemploymentRate": 3.7,
  "urbanizationRate": 82.9,
  "lifeExpectancy": 76.3,
  "literacyRate": 99.0
}
```

---

## Next Steps

1. Choose your data sources
2. Run the data fetching script (see `scripts/fetchData.js`)
3. Import the data into MongoDB

