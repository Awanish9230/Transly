# 🎤 AI-Powered Meeting Summarizer

A full-stack web application that automatically converts meeting audio into structured insights using free, locally runnable AI models.

## 🧩 Overview

This application helps teams transcribe, summarize, extract action items, and prioritize tasks efficiently — all locally and securely using:

- **Speech-to-Text**: Whisper (OpenAI) running locally
- **Summarization**: BART/T5 models from Hugging Face
- **Task Extraction**: NLP + regex-based analysis
- **Priority Scoring**: ML logic for task prioritization

## ✨ Features

- 🎤 **Audio Upload** – Upload meeting recordings (.mp3, .wav, .m4a, .ogg)
- 🧾 **Speech-to-Text** – Converts speech → text using Whisper
- ✍️ **Summarization** – Generates concise summaries using BART
- ✅ **Task Extraction** – Identifies tasks, deadlines, and responsible persons
- 📊 **Priority Scoring** – Ranks tasks by urgency
- 📄 **PDF Export** – Export clean, structured reports
- 🔐 **JWT Authentication** – Secure login/logout system
- 🗄️ **MongoDB** – Local database for storing data

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vite + React.js + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (local) |
| **Authentication** | JWT |
| **AI/ML** | Whisper, BART/T5, Custom NLP |
| **PDF Generation** | jsPDF |
| **File Handling** | Multer |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB Community Edition** - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Windows-Specific Requirements

- **Windows 10/11** (64-bit)
- **Visual Studio Build Tools** (for Python packages) - [Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to Project

```powershell
cd C:\Users\Awanish\meeting-ai-app
```

### Step 2: Set Up Backend

```powershell
cd backend

# Install Node.js dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file with your settings
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/meeting-ai
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development
```

### Step 3: Set Up AI Models (Python)

```powershell
cd ..\ai-models

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt
pip install -r requirements.txt


# This will download ~2-3GB of AI models on first run
```

**Note**: The first time you run transcription or summarization, the models will be downloaded automatically. This may take 5-15 minutes depending on your internet speed.

### Step 4: Set Up Frontend

```powershell
cd ..\frontend

# Install dependencies
npm install
```

### Step 5: Start MongoDB

```powershell
# Option 1: Start MongoDB as a service (if installed as service)
net start MongoDB

# Option 2: Start MongoDB manually
# Navigate to your MongoDB installation directory
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod --dbpath "C:\data\db"

# Keep this terminal open
```

## 🎯 Running the Application

You'll need **3 terminal windows**:

### Terminal 1: Backend Server

```powershell
cd C:\Users\Awanish\meeting-ai-app\backend
npm run dev
```

Server will start on: `http://localhost:5000`

### Terminal 2: Frontend Dev Server

```powershell
cd C:\Users\Awanish\meeting-ai-app\frontend
npm run dev
```

Frontend will start on: `http://localhost:5173`

### Terminal 3: MongoDB (if not running as service)

```powershell
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod --dbpath "C:\data\db"
```

## 🔧 Usage

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Sign Up** with your name, email, and password

3. **Upload Audio File**:
   - Enter a meeting title (optional)
   - Select an audio file (MP3, WAV, M4A, OGG)
   - Click "Upload & Process"

4. **Wait for Processing** (2-10 minutes depending on audio length):
   - Transcription using Whisper
   - Summarization using BART
   - Task extraction using NLP

5. **View Results**:
   - Click on a meeting to see full transcript
   - Review AI-generated summary
   - See extracted action items with priorities
   - Export to PDF

## 📁 Project Structure

```
meeting-ai-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Meeting.js         # Meeting schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── meetingRoutes.js   # Meeting endpoints
│   ├── services/
│   │   └── aiService.js       # AI processing orchestration
│   ├── uploads/               # Uploaded audio files
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AudioUploader.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Report.jsx
│   │   ├── utils/
│   │   │   └── api.js         # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── ai-models/
    ├── transcribe.py          # Whisper transcription
    ├── summarize.py           # BART summarization
    ├── extract_tasks.py       # Task extraction
    ├── requirements.txt       # Python dependencies
    └── venv/                  # Python virtual environment
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Meetings
- `GET /api/meetings` - Get all meetings for logged-in user
- `GET /api/meetings/:id` - Get single meeting
- `POST /api/meetings/upload` - Upload audio file
- `POST /api/meetings/:id/process` - Start AI processing
- `DELETE /api/meetings/:id` - Delete meeting

## 🐛 Troubleshooting

### MongoDB Connection Issues

```powershell
# Ensure MongoDB is running
Get-Service MongoDB

# If not running, start it
net start MongoDB

# Or create data directory
mkdir C:\data\db
```

### Python Module Errors

```powershell
# Reinstall dependencies
cd ai-models
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

### Port Already in Use

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or change PORT in backend/.env
```

### Whisper Model Download Fails

```powershell
# Manually download base model
cd ai-models
.\venv\Scripts\Activate.ps1
python -c "import whisper; whisper.load_model('base')"
```

## 🌟 Features in Detail

### 1. Speech-to-Text (Whisper)
- Uses OpenAI's Whisper model (base variant)
- Runs 100% locally
- Supports multiple audio formats
- Automatic language detection

### 2. Summarization (BART)
- Facebook's BART large CNN model
- Handles long transcripts via chunking
- Generates concise, readable summaries

### 3. Task Extraction
- Regex-based keyword detection
- Identifies action items, deadlines, assignees
- Assigns priority levels (high/medium/low)
- Extracts up to 10 most relevant tasks

### 4. PDF Export
- Clean, structured reports
- Includes summary, tasks, and full transcript
- Professional formatting with jsPDF

## 💡 Tips for Best Results

1. **Audio Quality**: Use clear recordings with minimal background noise
2. **File Size**: Keep files under 100MB for faster processing
3. **Meeting Structure**: Clearly state action items ("John needs to...", "Sarah will...")
4. **Dates**: Mention deadlines explicitly ("by Friday", "before Monday")
5. **Processing Time**: 
   - 5-min recording: ~2-3 minutes
   - 30-min recording: ~8-10 minutes
   - 60-min recording: ~15-20 minutes

## 🔒 Security Notes

- All AI processing happens locally (no cloud APIs)
- Passwords are hashed with bcrypt
- JWT tokens for secure authentication
- Audio files stored locally on your machine
- No external data sharing

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the terminal output for error messages
3. Ensure all prerequisites are installed
4. Check MongoDB is running

## 🎉 Acknowledgments

- OpenAI Whisper for speech recognition
- Facebook BART for summarization
- Hugging Face Transformers
- MongoDB, Express, React, Node.js communities

---

**Built with ❤️ using 100% free and open-source tools**
