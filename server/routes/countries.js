import express from 'express';
import Country from '../models/Country.js';

const router = express.Router();

// Get all countries
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find({});
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get country by cca3 code
router.get('/:cca3', async (req, res) => {
  try {
    const country = await Country.findOne({ cca3: req.params.cca3.toUpperCase() });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(country);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new country
router.post('/', async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    res.status(201).json(country);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a country
router.put('/:cca3', async (req, res) => {
  try {
    const country = await Country.findOneAndUpdate(
      { cca3: req.params.cca3.toUpperCase() },
      req.body,
      { new: true, runValidators: true }
    );
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(country);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a country
router.delete('/:cca3', async (req, res) => {
  try {
    const country = await Country.findOneAndDelete({ cca3: req.params.cca3.toUpperCase() });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json({ message: 'Country deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Country.aggregate([
      {
        $group: {
          _id: null,
          totalCountries: { $sum: 1 },
          avgDensity: { $avg: '$density' },
          maxDensity: { $max: '$density' },
          minDensity: { $min: '$density' },
          totalPopulation: { $sum: '$pop2025' },
          avgGrowthRate: { $avg: '$growthRate' },
        },
      },
    ]);
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
