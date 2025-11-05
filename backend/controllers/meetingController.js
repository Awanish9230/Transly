// backend/controllers/meetingController.js
import Meeting from '../models/meetingModel.js';

export const createMeeting = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const meeting = new Meeting({
      user: req.user._id,
      filePath: req.file.path,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
    });

    await meeting.save();
    res.json({ message: 'File uploaded successfully', meeting });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user._id });
    res.json(meetings);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch meetings' });
  }
};
