# 📦 Installation Instructions

## Complete Setup Guide for Windows

### ✅ Step 1: Install Prerequisites

1. **Node.js** (v18+)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Python** (v3.8+)
   - Download: https://www.python.org/
   - ✅ Check "Add Python to PATH" during installation
   - Verify: `python --version`

3. **MongoDB Community Edition**
   - Download: https://www.mongodb.com/try/download/community
   - ✅ Install as Windows Service
   - Verify: `mongod --version`

4. **Git** (optional, for version control)
   - Download: https://git-scm.com/

---

### ⚙️ Step 2: Install Dependencies

Open PowerShell in project directory:

```powershell
cd C:\Users\Awanish\meeting-ai-app
```

#### Backend Dependencies

```powershell
cd backend
npm install
cd ..
```

Expected packages:
- express
- mongoose
- multer
- jsonwebtoken
- bcrypt
- cors
- dotenv

#### Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

Expected packages:
- react
- react-dom
- react-router-dom
- axios
- jspdf
- tailwindcss
- vite

#### Python AI Dependencies

```powershell
cd ai-models

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install packages (this will take 5-10 minutes)
pip install -r requirements.txt

cd ..
```

Expected packages:
- openai-whisper
- transformers
- torch

---

### 🔧 Step 3: Configuration

#### Create Backend .env File

```powershell
cd backend
Copy-Item .env.example .env
```

Edit `.env` file (use Notepad or VS Code):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meeting-ai
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

⚠️ **Important**: Change `JWT_SECRET` to a random string!

---

### 🚀 Step 4: Start Services

You need **3 separate PowerShell terminals**:

#### Terminal 1: Backend

```powershell
cd C:\Users\Awanish\meeting-ai-app\backend
npm run dev
```

✅ Should see: `🚀 Server running on port 5000`

#### Terminal 2: Frontend

```powershell
cd C:\Users\Awanish\meeting-ai-app\frontend
npm run dev
```

✅ Should see: `Local: http://localhost:5173/`

#### Terminal 3: MongoDB

Only if MongoDB is NOT running as a service:

```powershell
# Create data directory (first time only)
mkdir C:\data\db

# Start MongoDB
mongod --dbpath C:\data\db
```

✅ Should see: `Waiting for connections`

---

### 🌐 Step 5: Open Application

Open your browser and go to:

```
http://localhost:5173
```

You should see the Meeting AI login page! 🎉

---

## 🧪 Test the Application

### 1. Sign Up

- Click "Sign up"
- Enter name, email, password
- Click "Sign Up"

### 2. Upload Test Audio

For testing, use a short audio file:
- Format: MP3, WAV, M4A, or OGG
- Size: < 10MB for quick testing
- Content: Clear speech (e.g., meeting recording, podcast clip)

### 3. Wait for Processing

- Upload will take a few seconds
- Processing time depends on audio length:
  - 1-min audio: ~1-2 minutes
  - 5-min audio: ~3-5 minutes
  - 10-min audio: ~5-8 minutes

**Note**: First run will download AI models (~2GB), taking 10-15 minutes.

### 4. View Results

- See transcription
- Read AI-generated summary
- Check extracted action items
- Export to PDF

---

## ❓ Common Issues & Solutions

### Issue: `npm install` fails

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Python packages fail to install

**Solution:**
```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install Visual C++ Build Tools (if needed)
# Download: https://visualstudio.microsoft.com/visual-cpp-build-tools/

# Try again
pip install -r requirements.txt
```

### Issue: MongoDB won't start

**Solution:**
```powershell
# Check if running
Get-Service MongoDB

# Start service
net start MongoDB

# Or manually
mkdir C:\data\db
mongod --dbpath C:\data\db
```

### Issue: Port 5000 already in use

**Solution:**

Edit `backend/.env`:
```
PORT=5001
```

Then update `frontend/src/utils/api.js`:
```javascript
const API_URL = 'http://localhost:5001/api';
```

### Issue: Whisper models won't download

**Solutions:**
1. Check internet connection
2. Free up disk space (~2GB needed)
3. Disable VPN/proxy temporarily
4. Manual download:
```powershell
cd ai-models
.\venv\Scripts\Activate.ps1
python -c "import whisper; whisper.load_model('base')"
```

### Issue: Frontend shows blank page

**Solutions:**
1. Check browser console (F12)
2. Verify backend is running on port 5000
3. Clear browser cache (Ctrl + Shift + Delete)
4. Try different browser

---

## 📚 Next Steps

1. ✅ Read `README.md` for detailed documentation
2. ✅ See `QUICKSTART.md` for quick reference
3. ✅ Try uploading your first meeting audio
4. ✅ Explore the dashboard and features
5. ✅ Export your first PDF report

---

## 🎯 Quick Commands Reference

### Start Everything

```powershell
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Terminal 3 (if needed)
mongod --dbpath C:\data\db
```

### Stop Everything

- Press `Ctrl + C` in each terminal
- Or close the terminals

### Restart Services

Just re-run the start commands in each terminal.

---

## 💾 Data Storage

- **Database**: `mongodb://localhost:27017/meeting-ai`
- **Uploaded Audio**: `backend/uploads/`
- **AI Models**: `ai-models/venv/Lib/site-packages/`

---

## 🎉 Success!

If you see the dashboard and can upload audio, you're all set!

**Enjoy your AI-powered meeting summarizer!** 🚀

---

**Need Help?** Check README.md for troubleshooting or review error messages in the terminals.
