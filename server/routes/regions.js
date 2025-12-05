import express from 'express';
import Region from '../models/Region.js';

const router = express.Router();

// Get all regions
router.get('/', async (req, res) => {
  try {
    const regions = await Region.find({});
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get region by name
router.get('/:name', async (req, res) => {
  try {
    const region = await Region.findOne({ name: req.params.name });
    if (!region) {
      return res.status(404).json({ error: 'Region not found' });
    }
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new region
router.post('/', async (req, res) => {
  try {
    const region = new Region(req.body);
    await region.save();
    res.status(201).json(region);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

