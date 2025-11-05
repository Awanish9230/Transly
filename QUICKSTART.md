# 🚀 Quick Start Guide

## Prerequisites Check

✅ Node.js installed? → `node --version`  
✅ Python installed? → `python --version`  
✅ MongoDB installed? → `mongod --version`

## 5-Minute Setup

### Step 1: Install Dependencies

```powershell
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install

# Python AI Models
cd ../ai-models
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Step 2: Configure Environment

```powershell
# Create .env file in backend/
cd ../backend
Copy-Item .env.example .env
# Edit .env and set JWT_SECRET
```

### Step 3: Start MongoDB

```powershell
# Option A: As service
net start MongoDB

# Option B: Manual
mongod --dbpath C:\data\db
```

### Step 4: Run Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Terminal 3 - MongoDB** (if not service):
```powershell
mongod --dbpath C:\data\db
```

### Step 5: Open Browser

Navigate to: `http://localhost:5173`

## First Use

1. **Sign Up** with email & password
2. **Upload** an audio file (.mp3, .wav, .m4a, .ogg)
3. **Wait** 2-10 minutes for AI processing
4. **View** transcript, summary, and action items
5. **Export** to PDF

## Troubleshooting

**MongoDB won't start?**
```powershell
mkdir C:\data\db
mongod --dbpath C:\data\db
```

**Port 5000 in use?**
```powershell
# Change PORT in backend/.env to 5001
```

**Python modules missing?**
```powershell
cd ai-models
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Whisper model download fails?**
- Check internet connection
- Free up ~1GB disk space
- Try again (models auto-download on first use)

## Tech Stack Overview

- **Frontend**: React + Vite + Tailwind CSS → Port 5173
- **Backend**: Node.js + Express → Port 5000
- **Database**: MongoDB → Port 27017
- **AI**: Whisper + BART (Python) → Local processing

## Key Features

- 🎤 Audio transcription (Whisper)
- ✍️ Text summarization (BART)
- ✅ Action item extraction
- 📊 Priority scoring
- 📄 PDF export
- 🔐 JWT authentication

## Need Help?

See full `README.md` for detailed documentation.

---

**Happy Meeting Summarizing! 🎉**
