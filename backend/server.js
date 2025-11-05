import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

dotenv.config();
const app = express();

// Create uploads folder if not exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'video/mp4', 'video/mkv'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only audio or video files are allowed'));
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes); 
app.use('/api/public', publicRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: '🚀 Meeting AI Backend is running' }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
