import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: String,
  assignedTo: String,
  deadline: String,
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
});

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Meeting Recording',
    },
    audioFileName: {
      type: String,
      required: true,
    },
    audioFilePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['audio', 'video'],
      default: 'audio',
    },
    transcript: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    tasks: [taskSchema],
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed'],
      default: 'uploaded',
    },
    // Sharing fields
    isShared: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    sharedAt: {
      type: Date,
      default: null,
    },
    pdfFileName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
