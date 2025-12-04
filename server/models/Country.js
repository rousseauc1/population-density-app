import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    unique: true,
  },
  cca2: {
    type: String,
    required: true,
  },
  cca3: {
    type: String,
    required: true,
    unique: true,
  },
  pop2025: {
    type: Number,
    required: true,
  },
  pop2050: {
    type: Number,
  },
  area: {
    type: Number,
  },
  landAreaKm: {
    type: Number,
    required: true,
  },
  density: {
    type: Number,
    required: true,
  },
  growthRate: {
    type: Number,
  },
  worldPercentage: {
    type: Number,
  },
  rank: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Country', countrySchema, 'country_stats_2025');
