# Region Statistics Update

## When Are Region Stats Updated?

Region statistics (totalPopulation2025, totalPopulation2050, averageDensity, etc.) are **automatically calculated** from country data in the following scenarios:

### 1. Automatic Update (Recommended)
When you run `npm run fetch-data`, it will:
1. Fetch regions from REST Countries API
2. **Automatically calculate and update region statistics** from your country data

```bash
cd server
npm run fetch-data
```

### 2. Manual Update
You can manually update region statistics anytime:

```bash
cd server
npm run update-region-stats
```

This is useful if:
- You've added new countries to the database
- You've updated country population/density data
- You want to refresh the region statistics

### 3. On-Demand via API
The analytics queries calculate region stats on-the-fly using aggregation pipelines, so they're always current even if the stored values are outdated.

---

## What Gets Calculated?

For each region, the following statistics are calculated from its member countries:

- **totalPopulation2025**: Sum of all countries' pop2025
- **totalPopulation2050**: Sum of all countries' pop2050
- **averageDensity**: Average of all countries' density values
- **averageGrowthRate**: Average of all countries' growthRate values
- **totalArea**: Sum of all countries' landAreaKm (or area)

---

## Example

If a region contains:
- Country A: pop2025 = 100M, density = 50
- Country B: pop2025 = 200M, density = 100
- Country C: pop2025 = 50M, density = 25

The region will have:
- totalPopulation2025 = 350M
- averageDensity = (50 + 100 + 25) / 3 = 58.33

---

## Important Notes

1. **Countries must exist first**: Make sure your countries collection is populated before updating region stats
2. **Stats are calculated, not fetched**: These values come from aggregating your country data, not from external APIs
3. **Updates are additive**: If a country is missing data, it's excluded from averages but included in totals (as 0)

---

## Troubleshooting

**Stats are all 0:**
- Make sure countries are loaded: `npm run seed`
- Make sure country data has pop2025, density, etc. populated
- Run: `npm run update-region-stats`

**Stats seem incorrect:**
- Check that countries have the correct cca3 codes matching region.countries arrays
- Verify country data is correct in the database

**Want to see current stats:**
```bash
# View via API
curl http://localhost:5000/api/regions

# Or use the analytics endpoint (always current)
curl http://localhost:5000/api/analytics/regional-analysis
```

