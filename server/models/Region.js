import mongoose from 'mongoose';

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['continent', 'subregion', 'economic_zone'],
    required: true,
  },
  countries: [{
    type: String, // Array of cca3 codes
    required: true,
  }],
  totalPopulation2025: Number,
  totalPopulation2050: Number,
  averageDensity: Number,
  averageGrowthRate: Number,
  totalArea: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Region', regionSchema, 'regions');

