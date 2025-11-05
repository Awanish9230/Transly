import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import Meeting from '../models/Meeting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Configure ffmpeg binary if available
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  console.warn('⚠️ FFmpeg path not found — please ensure FFmpeg is installed.');
}

// ✅ Constants
const AI_MODELS_PATH = path.join(__dirname, '../../ai-models');
const AUDIO_EXTS = ['.mp3', '.wav', '.m4a', '.ogg'];
const VIDEO_EXTS = ['.mp4', '.mov', '.mkv', '.webm'];

// ✅ Convert video → audio if needed
const ensureAudioFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filePath).toLowerCase();

    if (AUDIO_EXTS.includes(ext)) {
      return resolve(filePath);
    }

    if (VIDEO_EXTS.includes(ext)) {
      const outPath = filePath.replace(ext, '.wav');
      if (fs.existsSync(outPath)) {
        return resolve(outPath);
      }

      console.log('🎬 Extracting audio from video using FFmpeg...');
      ffmpeg(filePath)
        .noVideo()
        .audioCodec('pcm_s16le')
        .audioChannels(1)
        .audioFrequency(16000)
        .format('wav')
        .save(outPath)
        .on('end', () => resolve(outPath))
        .on('error', (err) => reject(err));
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};

// ✅ Main AI processing flow
export const processAudio = async (meetingId, audioFilePath) => {
  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error('Meeting not found');

    // Step 0: Convert video → audio if needed
    const audioPath = await ensureAudioFile(audioFilePath);

    // Step 1: Transcription
    console.log('🎤 Transcribing audio...');
    const transcript = await transcribeAudio(audioPath);
    if (!transcript || transcript.trim().length < 10) {
      throw new Error('Empty or invalid transcript');
    }

    meeting.transcript = transcript;
    await meeting.save();

    // Step 2: Summarization
    console.log('✍️ Generating summary...');
    const summary = await generateSummary(transcript);
    meeting.summary = summary;
    await meeting.save();

    // Step 3: Task Extraction
    console.log('✅ Extracting tasks...');
    const tasks = await extractTasks(transcript);
    meeting.tasks = tasks;
    meeting.status = 'completed';
    await meeting.save();

    console.log('✅ Processing completed successfully');
    return meeting;
  } catch (error) {
    console.error('❌ Error processing audio/video:', error);
    const meeting = await Meeting.findById(meetingId);
    if (meeting) {
      meeting.status = 'failed';
      await meeting.save();
    }
    throw error;
  }
};

// ✅ Transcribe with Whisper
const transcribeAudio = (audioFilePath) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(AI_MODELS_PATH, 'transcribe.py');
    const safePath = path.resolve(audioFilePath).replace(/\\/g, '/');
    const python = spawn('python', [pythonScript, safePath]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => (output += data.toString()));
    python.stderr.on('data', (data) => (errorOutput += data.toString()));

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Transcription failed: ${errorOutput}`));
      } else {
        resolve(output.trim());
      }
    });
  });
};

// ✅ Summarize transcript
const generateSummary = (transcript) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(AI_MODELS_PATH, 'summarize.py');
    const python = spawn('python', [pythonScript]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => (output += data.toString()));
    python.stderr.on('data', (data) => (errorOutput += data.toString()));

    python.stdin.write(transcript);
    python.stdin.end();

    python.on('close', (code) => {
      if (code !== 0) reject(new Error(`Summarization failed: ${errorOutput}`));
      else resolve(output.trim());
    });
  });
};

// ✅ Extract tasks via NLP
const extractTasks = (transcript) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(AI_MODELS_PATH, 'extract_tasks.py');
    const python = spawn('python', [pythonScript]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => (output += data.toString()));
    python.stderr.on('data', (data) => (errorOutput += data.toString()));

    python.stdin.write(transcript);
    python.stdin.end();

    python.on('close', (code) => {
      if (code !== 0) reject(new Error(`Task extraction failed: ${errorOutput}`));
      else {
        try {
          const tasks = JSON.parse(output);
          resolve(tasks);
        } catch (parseError) {
          reject(new Error('Failed to parse tasks JSON'));
        }
      }
    });
  });
};
