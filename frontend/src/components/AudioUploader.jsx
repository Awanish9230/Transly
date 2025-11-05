import { useState } from 'react';
import axios from 'axios';

function AudioUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const allowedTypes = [
    'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a', 'audio/ogg',
    'video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validExt = /\.(mp3|wav|m4a|ogg|mp4|mov|mkv|webm)$/i;

    if (!allowedTypes.includes(selectedFile.type) && !validExt.test(selectedFile.name)) {
      setError('Please upload a valid audio/video file (MP3, WAV, M4A, OGG, MP4, MOV, MKV, WEBM)');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an audio or video file.');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.token) throw new Error('User not authenticated');

      const { data } = await axios.post(
        'http://localhost:5000/api/meetings/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSuccess('File uploaded successfully! Starting AI processing...');
      setProcessing(true);
      setProgress(0);

      let progressValue = 0;
      const progressInterval = setInterval(() => {
        // smoothly simulate up to 80%
        if (progressValue < 80) {
          progressValue += 5;
          setProgress(progressValue);
        }
      }, 400);

      // ✅ Trigger backend processing
      await axios.post(
        `http://localhost:5000/api/meetings/${data.meetingId}/process`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // ✅ Poll backend for real completion
      const checkStatus = async () => {
        const res = await axios.get(
          `http://localhost:5000/api/meetings/${data.meetingId}/status`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        return res.data.status;
      };

      let status = 'processing';
      let attempts = 0;
      while (status === 'processing' && attempts < 30) {
        await new Promise((r) => setTimeout(r, 3000));
        status = await checkStatus();
        attempts++;

        if (progressValue < 95) {
          progressValue += 1;
          setProgress(progressValue);
        }
      }

      clearInterval(progressInterval);
      setProgress(100);
      setSuccess('✅ Processing completed successfully!');

      // Wait a bit before closing loader for smoother UI
      setTimeout(() => setProcessing(false), 800);

      setFile(null);
      setTitle('');
      if (onUploadSuccess) setTimeout(onUploadSuccess, 1000);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Upload failed');
      setProcessing(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* 🌀 Fullscreen Loader Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center z-[1000] transition-all duration-300">
          <div className="bg-white shadow-2xl rounded-2xl p-8 flex flex-col items-center w-[90%] sm:w-[400px] text-center border border-gray-100">
            {/* Animated circular loader */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              Processing your file...
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Please wait while AI works its magic ✨
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
              <div
                className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-gray-700 text-sm font-medium">{progress}% completed</p>
          </div>
        </div>
      )}

      {/* Main Uploader */}
      <div className="bg-white rounded-lg shadow-lg p-6 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📤 Upload Meeting Audio/Video
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Meeting Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Standup - Nov 3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Audio or Video File
            </label>
            <input
              type="file"
              accept=".mp3,.wav,.m4a,.ogg,.mp4,.mov,.mkv,.webm,audio/*,video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || processing || !file}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {uploading
              ? 'Uploading...'
              : processing
                ? 'Processing...'
                : 'Upload & Process'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Supported formats: Audio (MP3, WAV, M4A, OGG) and Video (MP4, MOV, MKV, WEBM)
          </p>
        </div>
      </div>
    </>
  );
}

export default AudioUploader;
