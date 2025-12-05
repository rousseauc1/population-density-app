# Database Queries Documentation

This project incorporates **3 MongoDB collections** with complex relationships and **6 sophisticated aggregation queries** that demonstrate meaningful data analysis.

## Collections

### 1. Countries (`country_stats_2025`)
- **Purpose**: Core population and demographic data for countries
- **Key Fields**: `cca3`, `pop2025`, `pop2050`, `density`, `growthRate`, `worldPercentage`
- **Relationships**: Referenced by `Region.countries` (array of cca3 codes) and `EconomicIndicator.countryCode`

### 2. Regions (`regions`)
- **Purpose**: Geographic groupings (continents, subregions, economic zones)
- **Key Fields**: `name`, `type`, `countries` (array of cca3 codes)
- **Relationships**: Contains arrays of country codes that link to Countries collection

### 3. Economic Indicators (`economic_indicators`)
- **Purpose**: Economic and development metrics linked to countries
- **Key Fields**: `countryCode` (references cca3), `year`, `gdpPerCapita`, `humanDevelopmentIndex`, `lifeExpectancy`, etc.
- **Relationships**: Links to Countries via `countryCode` field

## Complex Queries

### Query 1: High Growth Countries with Economic Data
**Endpoint**: `GET /api/analytics/high-growth-with-economics`

**Purpose**: Identifies countries with above-average population growth rates and joins them with their economic indicators.

**Techniques Used**:
- `$group` to calculate average growth rate
- `$lookup` to join Countries with Economic Indicators (equivalent to SQL JOIN)
- `$match` for filtering
- `$project` for field selection
- Nested pipeline in `$lookup` for conditional joins

**Relational Equivalent**: Would require a JOIN between countries and economic_indicators tables, with a subquery to calculate average growth rate.

---

### Query 2: Regional Analysis with Aggregated Data
**Endpoint**: `GET /api/analytics/regional-analysis`

**Purpose**: Analyzes population and economic metrics aggregated by geographic regions.

**Techniques Used**:
- Multiple `$lookup` operations (equivalent to multiple JOINs)
- `$group` aggregations (`$sum`, `$avg`)
- `$project` with calculated fields
- Array operations (`$size`)

**Relational Equivalent**: Would require:
- JOIN between regions and countries (via country codes array)
- JOIN between regions and economic_indicators
- GROUP BY with aggregate functions (SUM, AVG)
- Complex WHERE clauses

---

### Query 3: Overcrowding Analysis
**Endpoint**: `GET /api/analytics/overcrowding-analysis`

**Purpose**: Identifies countries with high population density but low economic indicators (overcrowding risk).

**Techniques Used**:
- `$lookup` for joining economic data
- `$match` with multiple conditions
- `$project` with conditional logic (`$ifNull`, `$arrayElemAt`)
- Calculated fields (overcrowding index)

**Relational Equivalent**: Would require:
- LEFT JOIN between countries and economic_indicators
- Complex WHERE clause with multiple conditions
- CASE statements for conditional logic

---

### Query 4: Population Projection by Development Level
**Endpoint**: `GET /api/analytics/projection-by-development`

**Purpose**: Categorizes countries by Human Development Index (HDI) and analyzes population projection trends within each category.

**Techniques Used**:
- `$lookup` for joining economic data
- `$bucket` for categorization (equivalent to CASE/WHEN grouping)
- `$group` with multiple aggregations
- `$project` with `$switch` for conditional labeling
- `$sortArray` for ordering nested arrays

**Relational Equivalent**: Would require:
- JOIN between countries and economic_indicators
- CASE/WHEN statements for categorization
- GROUP BY with aggregate functions
- Window functions or subqueries for sorting

---

### Query 5: Economic-Population Correlation Analysis
**Endpoint**: `GET /api/analytics/economic-population-correlation`

**Purpose**: Performs statistical analysis of correlations between economic indicators and population metrics.

**Techniques Used**:
- `$lookup` for joining collections
- `$group` with statistical aggregations
- `$filter` for conditional counting
- `$project` with complex calculations
- `$sortArray` for ranking

**Relational Equivalent**: Would require:
- JOIN operations
- Aggregate functions (AVG, COUNT with CASE)
- Subqueries for filtering
- Window functions for ranking

---

### Query 6: Regional Comparison with Faceted Analysis
**Endpoint**: `GET /api/analytics/regional-comparison`

**Purpose**: Provides multi-dimensional analysis of regions using parallel processing.

**Techniques Used**:
- Multiple `$lookup` operations
- `$facet` for parallel aggregation pipelines (equivalent to running multiple queries)
- `$group` with nested aggregations
- `$project` with calculated fields
- Multiple sorting and limiting operations

**Relational Equivalent**: Would require:
- Multiple JOINs
- Multiple GROUP BY queries (or UNION ALL)
- Complex aggregate calculations
- Window functions

---

## Query Complexity Summary

| Query | Joins | Aggregations | Functions | Complexity |
|-------|-------|--------------|-----------|------------|
| 1. High Growth | 1 ($lookup) | 2 ($group, $avg) | Conditional | Medium |
| 2. Regional Analysis | 2 ($lookup) | 6+ ($sum, $avg, $size) | Calculated fields | High |
| 3. Overcrowding | 1 ($lookup) | 1 ($match) | Conditional ($ifNull) | Medium |
| 4. Projection by Dev | 1 ($lookup) | 4+ ($bucket, $group) | $switch, $sortArray | High |
| 5. Correlation | 1 ($lookup) | 5+ ($group, $filter) | Statistical | Very High |
| 6. Regional Comparison | 2 ($lookup) | 8+ ($facet, $group) | Parallel pipelines | Very High |

## Running the Queries

1. **Start the server**: `npm run server`
2. **Seed the database** (if needed): `node server/seed.js`
3. **Access endpoints**:
   - `http://localhost:5000/api/analytics/high-growth-with-economics`
   - `http://localhost:5000/api/analytics/regional-analysis`
   - `http://localhost:5000/api/analytics/overcrowding-analysis`
   - `http://localhost:5000/api/analytics/projection-by-development`
   - `http://localhost:5000/api/analytics/economic-population-correlation`
   - `http://localhost:5000/api/analytics/regional-comparison`

## Data Relationships

```
Regions
  └── countries: [cca3 codes] ──┐
                                 │
Countries                        │
  ├── cca3 (primary key) ───────┘
  └── pop2025, pop2050, density, growthRate
                                 │
Economic Indicators              │
  └── countryCode ───────────────┘
      └── gdpPerCapita, hdi, lifeExpectancy, etc.
```

## Notes

- All queries use MongoDB aggregation pipeline, which is equivalent to complex SQL queries with JOINs, GROUP BY, and aggregate functions
- The `$lookup` operator performs left outer joins between collections
- `$facet` allows parallel processing of multiple aggregation pipelines
- Indexes are defined on `countryCode` and `year` in EconomicIndicator for optimal performance

