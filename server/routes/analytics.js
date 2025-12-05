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
    const result = await Country.aggregate([
      // Calculate average growth rate
      {
        $group: {
          _id: null,
          avgGrowthRate: { $avg: '$growthRate' },
        },
      },
      // Find countries above average
      {
        $lookup: {
          from: 'countries',
          pipeline: [
            {
              $match: {
                growthRate: { $gt: '$avgGrowthRate' },
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
          ],
          as: 'highGrowthCountries',
        },
      },
      {
        $project: {
          _id: 0,
          avgGrowthRate: 1,
          highGrowthCountries: 1,
        },
      },
    ]);

    res.json(result[0] || {});
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
                year: 2024,
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
            $avg: '$economicData.gdpPerCapita',
          },
          avgHDI: {
            $avg: '$economicData.humanDevelopmentIndex',
          },
          avgLifeExpectancy: {
            $avg: '$economicData.lifeExpectancy',
          },
          totalGDP: {
            $sum: '$economicData.gdpTotal',
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
        $match: {
          $or: [
            { 'economicData.gdpPerCapita': { $lt: 5000 } },
            { 'economicData.humanDevelopmentIndex': { $lt: 0.7 } },
            { 'economicData': { $size: 0 } }, // No economic data
          ],
        },
      },
      {
        $project: {
          country: 1,
          cca3: 1,
          density: 1,
          pop2025: 1,
          growthRate: 1,
          gdpPerCapita: {
            $ifNull: [
              { $arrayElemAt: ['$economicData.gdpPerCapita', 0] },
              'N/A',
            ],
          },
          hdi: {
            $ifNull: [
              { $arrayElemAt: ['$economicData.humanDevelopmentIndex', 0] },
              'N/A',
            ],
          },
          lifeExpectancy: {
            $ifNull: [
              { $arrayElemAt: ['$economicData.lifeExpectancy', 0] },
              'N/A',
            ],
          },
          overcrowdingIndex: {
            $divide: [
              '$density',
              {
                $ifNull: [
                  { $arrayElemAt: ['$economicData.gdpPerCapita', 0] },
                  1,
                ],
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
 * QUERY 4: Population projection trends by economic development level
 * Demonstrates: $lookup, $group, $bucket (categorization), $project
 */
router.get('/projection-by-development', async (req, res) => {
  try {
    const result = await Country.aggregate([
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
        $project: {
          country: 1,
          cca3: 1,
          pop2025: 1,
          pop2050: 1,
          growthRate: 1,
          hdi: { $arrayElemAt: ['$economicData.humanDevelopmentIndex', 0] },
          gdpPerCapita: { $arrayElemAt: ['$economicData.gdpPerCapita', 0] },
          populationChange: {
            $subtract: ['$pop2050', '$pop2025'],
          },
          percentChange: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ['$pop2050', '$pop2025'] },
                  '$pop2025',
                ],
              },
              100,
            ],
          },
        },
      },
      {
        $bucket: {
          groupBy: '$hdi',
          boundaries: [0, 0.5, 0.7, 0.8, 1.0],
          default: 'Unknown',
          output: {
            count: { $sum: 1 },
            avgGrowthRate: { $avg: '$growthRate' },
            avgPercentChange: { $avg: '$percentChange' },
            totalPop2025: { $sum: '$pop2025' },
            totalPop2050: { $sum: '$pop2050' },
            countries: {
              $push: {
                name: '$country',
                change: '$percentChange',
                growthRate: '$growthRate',
              },
            },
          },
        },
      },
      {
        $project: {
          developmentLevel: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 0] }, then: 'Low (0-0.5)' },
                { case: { $eq: ['$_id', 0.5] }, then: 'Medium (0.5-0.7)' },
                { case: { $eq: ['$_id', 0.7] }, then: 'High (0.7-0.8)' },
                { case: { $eq: ['$_id', 0.8] }, then: 'Very High (0.8-1.0)' },
              ],
              default: 'Unknown',
            },
          },
          countryCount: '$count',
          avgGrowthRate: { $round: ['$avgGrowthRate', 4] },
          avgPercentChange: { $round: ['$avgPercentChange', 2] },
          totalPop2025: 1,
          totalPop2050: 1,
          projectedChange: {
            $subtract: ['$totalPop2050', '$totalPop2025'],
          },
          topCountries: {
            $slice: [
              {
                $sortArray: {
                  input: '$countries',
                  sortBy: { change: -1 },
                },
              },
              5,
            ],
          },
        },
      },
    ]);

    res.json(result);
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
        $match: {
          'economicData': { $ne: [] }, // Only countries with economic data
        },
      },
      {
        $project: {
          country: 1,
          cca3: 1,
          density: 1,
          growthRate: 1,
          pop2025: 1,
          gdpPerCapita: { $arrayElemAt: ['$economicData.gdpPerCapita', 0] },
          hdi: { $arrayElemAt: ['$economicData.humanDevelopmentIndex', 0] },
          lifeExpectancy: { $arrayElemAt: ['$economicData.lifeExpectancy', 0] },
          urbanizationRate: { $arrayElemAt: ['$economicData.urbanizationRate', 0] },
        },
      },
      {
        $group: {
          _id: null,
          countries: { $push: '$$ROOT' },
          avgDensity: { $avg: '$density' },
          avgGDP: { $avg: '$gdpPerCapita' },
          avgHDI: { $avg: '$hdi' },
          avgGrowthRate: { $avg: '$growthRate' },
          avgLifeExpectancy: { $avg: '$lifeExpectancy' },
          avgUrbanization: { $avg: '$urbanizationRate' },
        },
      },
      {
        $project: {
          _id: 0,
          summary: {
            avgDensity: { $round: ['$avgDensity', 2] },
            avgGDPPerCapita: { $round: ['$avgGDP', 2] },
            avgHDI: { $round: ['$avgHDI', 3] },
            avgGrowthRate: { $round: ['$avgGrowthRate', 4] },
            avgLifeExpectancy: { $round: ['$avgLifeExpectancy', 1] },
            avgUrbanization: { $round: ['$avgUrbanization', 2] },
          },
          insights: {
            highGDPHighDensity: {
              $size: {
                $filter: {
                  input: '$countries',
                  as: 'country',
                  cond: {
                    $and: [
                      { $gt: ['$$country.gdpPerCapita', '$avgGDP'] },
                      { $gt: ['$$country.density', '$avgDensity'] },
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
                      { $lt: ['$$country.gdpPerCapita', '$avgGDP'] },
                      { $gt: ['$$country.density', '$avgDensity'] },
                    ],
                  },
                },
              },
            },
            highHDILowGrowth: {
              $size: {
                $filter: {
                  input: '$countries',
                  as: 'country',
                  cond: {
                    $and: [
                      { $gt: ['$$country.hdi', '$avgHDI'] },
                      { $lt: ['$$country.growthRate', '$avgGrowthRate'] },
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
                    input: '$countries',
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
                    input: '$countries',
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
                    input: '$countries',
                    sortBy: {
                      balanceScore: {
                        $divide: [
                          { $multiply: ['$gdpPerCapita', '$hdi'] },
                          { $add: [1, '$density'] },
                        ],
                      },
                    },
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
                $expr: { $in: ['$countryCode', '$$countryCodes'] },
                year: 2024,
              },
            },
          ],
          as: 'economicData',
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
                    avgGDP: { $avg: '$economicData.gdpPerCapita' },
                    avgHDI: { $avg: '$economicData.humanDevelopmentIndex' },
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
              $project: {
                name: 1,
                type: 1,
                totalPop2025: { $sum: '$countryData.pop2025' },
                totalPop2050: { $sum: '$countryData.pop2050' },
                avgDensity: { $avg: '$countryData.density' },
                avgGDP: { $avg: '$economicData.gdpPerCapita' },
                avgHDI: { $avg: '$economicData.humanDevelopmentIndex' },
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
                avgGDP: { $avg: '$economicData.gdpPerCapita' },
                avgHDI: { $avg: '$economicData.humanDevelopmentIndex' },
                avgLifeExpectancy: { $avg: '$economicData.lifeExpectancy' },
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

