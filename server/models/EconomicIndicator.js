import mongoose from 'mongoose';

const economicIndicatorSchema = new mongoose.Schema({
  countryCode: {
    type: String, // cca3 code
    required: true,
    index: true,
  },
  year: {
    type: Number,
    required: true,
  },
  gdpPerCapita: Number, // USD
  gdpTotal: Number, // USD in billions
  humanDevelopmentIndex: Number, // HDI score 0-1
  giniCoefficient: Number, // Income inequality 0-1
  unemploymentRate: Number, // Percentage
  urbanizationRate: Number, // Percentage
  lifeExpectancy: Number, // Years
  literacyRate: Number, // Percentage
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Compound index for efficient queries
  indexes: [
    { countryCode: 1, year: 1 },
  ],
});

export default mongoose.model('EconomicIndicator', economicIndicatorSchema, 'economic_indicators');

