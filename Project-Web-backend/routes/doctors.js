import express from 'express';
import Doctor from '../models/doctors.js';   // 👈 import FIRST

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const doctors = await Doctor.findAll();   // 👈 use the imported model
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

export default router;