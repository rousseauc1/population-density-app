import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  population_density: {
    type: Number,
    required: true,
  },
  life_expectancy: {
    type: Number,
    required: true,
  },
  gdp: {
    type: Number,
  },
  region: {
    type: String,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
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

export default mongoose.model('Country', countrySchema);
