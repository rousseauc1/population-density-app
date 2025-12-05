import express from 'express';
import EconomicIndicator from '../models/EconomicIndicator.js';

const router = express.Router();

// Get all economic indicators
router.get('/', async (req, res) => {
  try {
    const { countryCode, year } = req.query;
    const query = {};
    if (countryCode) query.countryCode = countryCode.toUpperCase();
    if (year) query.year = parseInt(year);
    
    const indicators = await EconomicIndicator.find(query);
    res.json(indicators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get indicator by country code
router.get('/country/:countryCode', async (req, res) => {
  try {
    const indicators = await EconomicIndicator.find({
      countryCode: req.params.countryCode.toUpperCase()
    }).sort({ year: -1 });
    res.json(indicators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new economic indicator
router.post('/', async (req, res) => {
  try {
    const indicator = new EconomicIndicator(req.body);
    await indicator.save();
    res.status(201).json(indicator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

