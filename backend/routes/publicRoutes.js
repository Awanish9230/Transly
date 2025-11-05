import express from 'express';
import Meeting from '../models/Meeting.js';

const router = express.Router();

// @route   GET /api/public/meetings/:token
// @desc    Get public meeting by share token
// @access  Public
router.get('/meetings/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const meeting = await Meeting.findOne({ shareToken: token, isShared: true });
    if (!meeting) {
      return res.status(404).json({ message: 'Public report not found or sharing disabled' });
    }

    // Return limited fields only
    const { title, createdAt, summary, tasks, transcript, status, _id } = meeting;
    res.json({ _id, title, createdAt, summary, tasks, transcript, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
