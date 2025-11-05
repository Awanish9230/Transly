import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { protect } from '../middleware/authMiddleware.js';
import Meeting from '../models/Meeting.js';
import { processAudio } from '../services/aiService.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ Allow both audio and video MIME types
const allowedMimeTypes = [
  // audio
  'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/ogg',
  // video
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Please upload a valid audio or video file (mp3, wav, m4a, ogg, mp4, webm, mov, mkv)'));
};

// ✅ 500MB limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

// ===================================================
// 📤 Upload File (Audio or Video)
// ===================================================
router.post(
  '/upload',
  protect,
  upload.single('file'), // always expect "file" field
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      const meeting = await Meeting.create({
        userId: req.user._id,
        title: req.body.title || 'Meeting Recording',
        audioFileName: req.file.originalname,
        audioFilePath: req.file.path,
        status: 'uploaded',
        fileType: req.file.mimetype.startsWith('video') ? 'video' : 'audio',
      });

      res.status(201).json({
        message: 'File uploaded successfully',
        meetingId: meeting._id,
        meeting,
      });
    } catch (error) {
      console.error('❌ Upload error:', error);
      res.status(500).json({ message: error.message });
    }
  }
);


// ===================================================
// 🎧 Process (Transcribe + Summarize + Extract Tasks)
// ===================================================
router.post('/:id/process', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (meeting.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    meeting.status = 'processing';
    await meeting.save();

    processAudio(meeting._id, meeting.audioFilePath)
      .then(() => console.log(`✅ Meeting ${meeting._id} processed successfully`))
      .catch((err) => console.error(`❌ Error processing meeting ${meeting._id}:`, err));

    res.json({ message: 'Processing started', meetingId: meeting._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===================================================
// 📢 Sharing Routes
// ===================================================
router.post('/:id/share', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (meeting.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const token = crypto.randomBytes(16).toString('hex');
    meeting.isShared = true;
    meeting.shareToken = token;
    meeting.sharedAt = new Date();
    await meeting.save();

    res.json({
      message: 'Sharing enabled',
      shareUrl: `${req.protocol}://${req.get('host')}/p/${token}`,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id/share', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (meeting.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    meeting.isShared = false;
    meeting.shareToken = null;
    meeting.sharedAt = null;
    await meeting.save();

    res.json({ message: 'Sharing disabled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===================================================
// 🟢 Check Meeting Status
// ===================================================
router.get('/:id/status', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      meetingId: meeting._id,
      status: meeting.status || 'unknown',
      lastUpdated: meeting.updatedAt,
    });
  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({ message: 'Failed to fetch meeting status' });
  }
});


// ===================================================
// 📂 Get / Delete Meetings
// ===================================================
router.get('/', protect, async (req, res) => {
  try {
    const meetings = await Meeting.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (meeting.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (meeting.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await meeting.deleteOne();
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
