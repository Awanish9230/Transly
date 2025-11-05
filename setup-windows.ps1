# Meeting AI App - Windows Setup Script
# Run this script in PowerShell as Administrator

Write-Host "🎤 Meeting AI App - Windows Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Please run this script as Administrator" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit
}

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✅ $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install from https://www.python.org/" -ForegroundColor Red
    exit
}

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "✅ MongoDB service found" -ForegroundColor Green
    if ($mongoService.Status -ne 'Running') {
        Write-Host "Starting MongoDB..." -ForegroundColor Yellow
        Start-Service MongoDB
    }
} else {
    Write-Host "⚠️  MongoDB not found. Please install from https://www.mongodb.com/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend npm install failed" -ForegroundColor Red
    exit
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit backend/.env and set JWT_SECRET" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend npm install failed" -ForegroundColor Red
    exit
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "🐍 Setting up Python Environment..." -ForegroundColor Cyan
Set-Location ai-models

# Create virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate and install
Write-Host "Installing Python dependencies (this may take a few minutes)..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python pip install failed" -ForegroundColor Red
    exit
}
Write-Host "✅ Python dependencies installed" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend/.env and set a secure JWT_SECRET" -ForegroundColor White
Write-Host "2. Start MongoDB (if not running as service)" -ForegroundColor White
Write-Host "3. Open 3 terminal windows and run:" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 3 (MongoDB - if needed):" -ForegroundColor Yellow
Write-Host "   mongod --dbpath C:\data\db" -ForegroundColor White
Write-Host ""
Write-Host "4. Open browser: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "📚 See README.md for detailed instructions" -ForegroundColor Cyan
