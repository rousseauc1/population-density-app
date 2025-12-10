import express from 'express';
import Country from '../models/Country.js';
import Region from '../models/Region.js';
import EconomicIndicator from '../models/EconomicIndicator.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * QUERY 1: Countries with population growth above average, joined with economic indicators
 * Demonstrates: $lookup (join), $match, $group aggregation
 */
router.get('/high-growth-with-economics', async (req, res) => {
  try {
    // First, calculate average growth rate
    const avgResult = await Country.aggregate([
      {
        $group: {
          _id: null,
          avgGrowthRate: { $avg: '$growthRate' },
        },
      },
    ]);
    
    const avgGrowthRate = avgResult[0]?.avgGrowthRate || 0;

    // Then find countries above average and join with economic data
    const result = await Country.aggregate([
      {
        $match: {
          growthRate: { $gt: avgGrowthRate },
        },
      },
      {
        $lookup: {
          from: 'economic_indicators',
          localField: 'cca3',
          foreignField: 'countryCode',
          as: 'economicData',
          pipeline: [
            { $sort: { year: -1 } }, // use most recent economic data available
            { $limit: 1 },
          ],
        },
      },
      {
        $project: {
          country: 1,
          cca3: 1,
          growthRate: 1,
          pop2025: 1,
          pop2050: 1,
          economicData: { $arrayElemAt: ['$economicData', 0] },
        },
      },
      { $sort: { growthRate: -1 } },
      { $limit: 20 },
    ]);

    res.json({
      avgGrowthRate,
      highGrowthCountries: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * QUERY 2: Regional analysis with aggregated population and economic data
 * Demonstrates: $lookup, $group, $project, complex aggregations
 */
router.get('/regional-analysis', async (req, res) => {
  try {
    const result = await Region.aggregate([
      {
        $lookup: {
          from: 'country_stats_2025',
          localField: 'countries',
          foreignField: 'cca3',
          as: 'countryData',
        },
      },
      {
        $lookup: {
          from: 'economic_indicators',
          let: { countryCodes: '$countries' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$countryCode', '$$countryCodes'],
                },
              },
            },
            { $sort: { countryCode: 1, year: -1 } },
            {
              $group: {
                _id: '$countryCode',
                year: { $first: '$year' },
                gdpPerCapita: { $first: '$gdpPerCapita' },
                gdpTotal: { $first: '$gdpTotal' },
                lifeExpectancy: { $first: '$lifeExpectancy' },
                urbanizationRate: { $first: '$urbanizationRate' },
              },
            },
          ],
          as: 'economicData',
        },
      },
      {
        $project: {
          name: 1,
          type: 1,
          countryCount: { $size: '$countries' },
          totalPopulation2025: {
            $sum: '$countryData.pop2025',
          },
          totalPopulation2050: {
            $sum: '$countryData.pop2050',
          },
          avgDensity: {
            $avg: '$countryData.density',
          },
          avgGrowthRate: {
            $avg: '$countryData.growthRate',
          },
          avgGDPPerCapita: {
            $avg: {
              $filter: {
                input: '$economicData.gdpPerCapita',
                as: 'g',
                cond: { $ne: ['$$g', null] },
              },
            },
          },
          avgLifeExpectancy: {
            $avg: {
              $filter: {
                input: '$economicData.lifeExpectancy',
                as: 'l',
                cond: { $ne: ['$$l', null] },
              },
            },
          },
          avgUrbanization: {
            $avg: {
              $filter: {
                input: '$economicData.urbanizationRate',
                as: 'u',
                cond: { $ne: ['$$u', null] },
              },
            },
          },
          totalGDP: {
            $sum: {
              $filter: {
                input: '$economicData.gdpTotal',
                as: 't',
                cond: { $ne: ['$$t', null] },
              },
            },
          },
          projectedGrowth: {
            $subtract: [
              { $sum: '$countryData.pop2050' },
              { $sum: '$countryData.pop2025' },
            ],
          },
        },
      },
      {
        $sort: { totalPopulation2025: -1 },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * QUERY 3: Countries with high density but low economic indicators (overcrowding analysis)
 * Demonstrates: $lookup, $match with multiple conditions, $project
 */
router.get('/overcrowding-analysis', async (req, res) => {
  try {
    const result = await Country.aggregate([
      {
        $match: {
          density: { $gt: 300 }, // High density threshold
        },
      },
      {
        $lookup: {
          from: 'economic_indicators',
          localField: 'cca3',
          foreignField: 'countryCode',
          as: 'economicData',
          pipeline: [
            { $match: { year: 2024 } },
            { $limit: 1 },
          ],
        },
      },
      {
        $addFields: {
          economicData: { $arrayElemAt: ['$economicData', 0] },
        },
      },
      {
        $match: {
          $or: [
            { 'economicData.gdpPerCapita': { $lt: 5000 } },
            { 'economicData': null }, // No economic data
          ],
        },
      },
      {
        $project: {
          country: 1,
          cca3: 1,
          density: 1,
          pop2025: 1,
          pop2050: 1,
          growthRate: 1,
          worldPercentage: 1,
          area: 1,
          landAreaKm: 1,
          // Primary economic indicators
          gdpPerCapita: {
            $ifNull: ['$economicData.gdpPerCapita', null],
          },
          lifeExpectancy: {
            $ifNull: ['$economicData.lifeExpectancy', null],
          },
          // Additional economic metrics (shown when primary ones are missing)
          gdpTotal: {
            $ifNull: ['$economicData.gdpTotal', null],
          },
          giniCoefficient: {
            $ifNull: ['$economicData.giniCoefficient', null],
          },
          unemploymentRate: {
            $ifNull: ['$economicData.unemploymentRate', null],
          },
          urbanizationRate: {
            $ifNull: ['$economicData.urbanizationRate', null],
          },
          literacyRate: {
            $ifNull: ['$economicData.literacyRate', null],
          },
          overcrowdingIndex: {
            $divide: [
              '$density',
              {
                $ifNull: ['$economicData.gdpPerCapita', 1],
              },
            ],
          },
        },
      },
      {
        $sort: { density: -1 },
      },
      {
        $limit: 15,
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * QUERY 4: Population projection movers (top gainers / decliners)
 * Demonstrates: $project with calculations, $group, $sortArray slicing
 */
router.get('/projection-by-development', async (req, res) => {
  try {
    const result = await Country.aggregate([
      {
        $project: {
          country: 1,
          cca3: 1,
          pop2025: 1,
          pop2050: 1,
          growthRate: 1,
          density: 1,
          worldPercentage: 1,
          change: { $subtract: ['$pop2050', '$pop2025'] },
          percentChange: {
            $cond: {
              if: { $gt: ['$pop2025', 0] },
              then: {
                $multiply: [
                  { $divide: [{ $subtract: ['$pop2050', '$pop2025'] }, '$pop2025'] },
                  100,
                ],
              },
              else: null,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          countries: { $push: '$$ROOT' },
          avgGrowthRate: { $avg: '$growthRate' },
          avgPercentChange: { $avg: '$percentChange' },
          totalPop2025: { $sum: '$pop2025' },
          totalPop2050: { $sum: '$pop2050' },
        },
      },
      {
        $project: {
          _id: 0,
          summary: {
            avgGrowthRate: { $round: ['$avgGrowthRate', 4] },
            avgPercentChange: { $round: ['$avgPercentChange', 2] },
            totalPop2025: '$totalPop2025',
            totalPop2050: '$totalPop2050',
            projectedChange: { $subtract: ['$totalPop2050', '$totalPop2025'] },
          },
          topGainers: {
            $slice: [
              {
                $sortArray: {
                  input: '$countries',
                  sortBy: { change: -1 },
                },
              },
              8,
            ],
          },
          topDecliners: {
            $slice: [
              {
                $sortArray: {
                  input: '$countries',
                  sortBy: { change: 1 },
                },
              },
              8,
            ],
          },
        },
      },
    ]);

    res.json(result[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * QUERY 5: Correlation between economic indicators and population metrics
 * Demonstrates: $lookup, $group, $project with calculations, statistical analysis
 */
router.get('/economic-population-correlation', async (req, res) => {
  try {
    const result = await Country.aggregate([
      {
        $lookup: {
          from: 'economic_indicators',
          let: { countryCode: '$cca3' },
          as: 'economicData',
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$countryCode', '$$countryCode'] },
              },
            },
            { $sort: { year: -1 } }, // Grab most recent economic data available
            { $limit: 1 },
          ],
        },
      },
      {
        $match: {
          $expr: { $gt: [{ $size: '$economicData' }, 0] }, // Only countries with economic data
        },
      },
      {
        $addFields: {
          economicData: { $arrayElemAt: ['$economicData', 0] },
        },
      },
      {
        $project: {
          country: 1,
          cca3: 1,
          density: 1,
          growthRate: 1,
          pop2025: 1,
          gdpPerCapita: '$economicData.gdpPerCapita',
          lifeExpectancy: '$economicData.lifeExpectancy',
          urbanizationRate: '$economicData.urbanizationRate',
        },
      },
      {
        $group: {
          _id: null,
          countries: { $push: '$$ROOT' },
          avgDensity: { $avg: '$density' },
          avgGDP: { $avg: { $ifNull: ['$gdpPerCapita', null] } },
          avgGrowthRate: { $avg: '$growthRate' },
          avgLifeExpectancy: { $avg: { $ifNull: ['$lifeExpectancy', null] } },
          avgUrbanization: { $avg: { $ifNull: ['$urbanizationRate', null] } },
        },
      },
      {
        $project: {
          _id: 0,
          summary: {
            avgDensity: {
              $cond: {
                if: { $ne: ['$avgDensity', null] },
                then: { $round: ['$avgDensity', 2] },
                else: null,
              },
            },
            avgGDPPerCapita: {
              $cond: {
                if: { $ne: ['$avgGDP', null] },
                then: { $round: ['$avgGDP', 2] },
                else: null,
              },
            },
            avgGrowthRate: {
              $cond: {
                if: { $ne: ['$avgGrowthRate', null] },
                then: { $round: ['$avgGrowthRate', 4] },
                else: null,
              },
            },
            avgLifeExpectancy: {
              $cond: {
                if: { $ne: ['$avgLifeExpectancy', null] },
                then: { $round: ['$avgLifeExpectancy', 1] },
                else: null,
              },
            },
            avgUrbanization: {
              $cond: {
                if: { $ne: ['$avgUrbanization', null] },
                then: { $round: ['$avgUrbanization', 2] },
                else: null,
              },
            },
          },
          insights: {
            highGDPHighDensity: {
              $size: {
                $filter: {
                  input: '$countries',
                  as: 'country',
                  cond: {
                    $and: [
                      { $ne: ['$$country.gdpPerCapita', null] },
                      { $ne: ['$$country.density', null] },
                      { $gt: ['$$country.gdpPerCapita', { $ifNull: ['$avgGDP', 0] }] },
                      { $gt: ['$$country.density', { $ifNull: ['$avgDensity', 0] }] },
                    ],
                  },
                },
              },
            },
            lowGDPHighDensity: {
              $size: {
                $filter: {
                  input: '$countries',
                  as: 'country',
                  cond: {
                    $and: [
                      { $ne: ['$$country.gdpPerCapita', null] },
                      { $ne: ['$$country.density', null] },
                      { $lt: ['$$country.gdpPerCapita', { $ifNull: ['$avgGDP', 0] }] },
                      { $gt: ['$$country.density', { $ifNull: ['$avgDensity', 0] }] },
                    ],
                  },
                },
              },
            },
          },
          topPerformers: {
            highGDP: {
              $slice: [
                {
                  $sortArray: {
                    input: {
                      $filter: {
                        input: '$countries',
                        as: 'country',
                        cond: { $ne: ['$$country.gdpPerCapita', null] },
                      },
                    },
                    sortBy: { gdpPerCapita: -1 },
                  },
                },
                5,
              ],
            },
            highDensity: {
              $slice: [
                {
                  $sortArray: {
                    input: {
                      $filter: {
                        input: '$countries',
                        as: 'country',
                        cond: { $ne: ['$$country.density', null] },
                      },
                    },
                    sortBy: { density: -1 },
                  },
                },
                5,
              ],
            },
            bestBalance: {
              $slice: [
                {
                  $sortArray: {
                    input: {
                      $filter: {
                        input: {
                          $map: {
                            input: '$countries',
                            as: 'country',
                            in: {
                              $mergeObjects: [
                                '$$country',
                                {
                                  balanceScore: {
                                    $cond: {
                                      if: {
                                        $and: [
                                          { $ne: ['$$country.gdpPerCapita', null] },
                                          { $ne: ['$$country.density', null] },
                                        ],
                                      },
                                      then: {
                                        $divide: [
                                          '$$country.gdpPerCapita',
                                          { $add: [1, '$$country.density'] },
                                        ],
                                      },
                                      else: null,
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        },
                        as: 'country',
                        cond: { $ne: ['$$country.balanceScore', null] },
                      },
                    },
                    sortBy: { balanceScore: -1 },
                  },
                },
                5,
              ],
            },
          },
        },
      },
    ]);

    res.json(result[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * QUERY 6: Regional comparison with economic development and future projections
 * Demonstrates: Multiple $lookups, nested aggregations, $facet for parallel processing
 */
router.get('/regional-comparison', async (req, res) => {
  try {
    const result = await Region.aggregate([
      {
        $lookup: {
          from: 'country_stats_2025',
          localField: 'countries',
          foreignField: 'cca3',
          as: 'countryData',
        },
      },
      {
        $lookup: {
          from: 'economic_indicators',
          let: { countryCodes: '$countries' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$countryCode', '$$countryCodes'] },
                  ],
                },
              },
            },
            { $sort: { countryCode: 1, year: -1 } },
            {
              $group: {
                _id: '$countryCode',
                gdpPerCapita: { $first: '$gdpPerCapita' },
                humanDevelopmentIndex: { $first: '$humanDevelopmentIndex' },
                lifeExpectancy: { $first: '$lifeExpectancy' },
              },
            },
          ],
          as: 'economicData',
        },
      },
      {
        // Derive numeric economic metrics from the joined array
        $addFields: {
          economicMetrics: {
            avgGDP: { $avg: '$economicData.gdpPerCapita' },
            avgLifeExpectancy: { $avg: '$economicData.lifeExpectancy' },
          },
        },
      },
      {
        $facet: {
          byType: [
            {
              $group: {
                _id: '$type',
                regions: {
                  $push: {
                    name: '$name',
                    countryCount: { $size: '$countries' },
                    totalPop2025: { $sum: '$countryData.pop2025' },
                    totalPop2050: { $sum: '$countryData.pop2050' },
                    avgDensity: { $avg: '$countryData.density' },
                    avgGDP: { $avg: '$economicMetrics.avgGDP' },
                  },
                },
                totalRegions: { $sum: 1 },
                totalCountries: { $sum: { $size: '$countries' } },
                globalPop2025: { $sum: { $sum: '$countryData.pop2025' } },
                globalPop2050: { $sum: { $sum: '$countryData.pop2050' } },
              },
            },
          ],
          topRegions: [
            {
              $match: {
                type: 'subregion', // Only show subregions for more meaningful comparison
              },
            },
            {
              $project: {
                name: 1,
                type: 1,
                totalPop2025: { $sum: '$countryData.pop2025' },
                totalPop2050: { $sum: '$countryData.pop2050' },
                avgDensity: { $avg: '$countryData.density' },
                avgGDP: { $avg: '$economicMetrics.avgGDP' },
                growthRate: {
                  $avg: '$countryData.growthRate',
                },
                projectedChange: {
                  $subtract: [
                    { $sum: '$countryData.pop2050' },
                    { $sum: '$countryData.pop2025' },
                  ],
                },
                projectedPercentChange: {
                  $cond: {
                    if: { $gt: [{ $sum: '$countryData.pop2025' }, 0] },
                    then: {
                      $multiply: [
                        {
                          $divide: [
                            {
                              $subtract: [
                                { $sum: '$countryData.pop2050' },
                                { $sum: '$countryData.pop2025' },
                              ],
                            },
                            { $sum: '$countryData.pop2025' },
                          ],
                        },
                        100,
                      ],
                    },
                    else: null,
                  },
                },
              },
            },
            { $sort: { totalPop2025: -1 } },
            { $limit: 10 },
          ],
          economicLeaders: [
            {
              $project: {
                name: 1,
                type: 1,
                avgGDP: { $avg: '$economicMetrics.avgGDP' },
                avgLifeExpectancy: { $avg: '$economicMetrics.avgLifeExpectancy' },
                countryCount: { $size: '$countries' },
              },
            },
            { $sort: { avgGDP: -1 } },
            { $limit: 10 },
          ],
        },
      },
      {
        $project: {
          byType: 1,
          topRegions: 1,
          economicLeaders: 1,
        },
      },
    ]);

    res.json(result[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

