import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  country: String,
  cca2: String,
  cca3: String,
  pop2025: Number,
  pop2050: Number,
  area: Number,
  landAreaKm: Number,
  density: Number,
  growthRate: Number,
  worldPercentage: Number,
  rank: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { strict: false });

export default mongoose.model('Country', countrySchema, 'country_stats_2025');
