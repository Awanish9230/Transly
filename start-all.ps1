# Single-click starter for Meeting AI App
# Double-click this file (start-all.ps1) to launch MongoDB, Backend, and Frontend.
# If execution is blocked, right-click -> Run with PowerShell, or use start.cmd.

param(
  [switch]$InstallIfMissing
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSCommandPath
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'
$ai = Join-Path $root 'ai-models'
$aiVenvBin = Join-Path $ai 'venv\Scripts'

Write-Host "🎤 Starting Meeting AI App..." -ForegroundColor Cyan

function Start-MongoDB {
  try {
    $svc = Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue
    if ($svc) {
      if ($svc.Status -ne 'Running') {
        Write-Host 'Starting MongoDB service...' -ForegroundColor Yellow
        Start-Service 'MongoDB'
      }
      Write-Host '✅ MongoDB service is running.' -ForegroundColor Green
    } else {
      Write-Host '⚠️  MongoDB service not found. Starting standalone mongod if available...' -ForegroundColor Yellow
      $dbPath = 'C:\data\db'
      if (-not (Test-Path $dbPath)) { New-Item -ItemType Directory -Force $dbPath | Out-Null }
      Start-Process -WindowStyle Normal -FilePath 'powershell' -ArgumentList @('-NoExit','-Command',"mongod --dbpath '$dbPath'") -WorkingDirectory $root -Verb runAs | Out-Null
      Write-Host 'Opened a window running mongod.' -ForegroundColor Green
    }
  } catch {
    Write-Host "❌ Failed to start MongoDB: $_" -ForegroundColor Red
  }
}

function Ensure-Dependencies {
  if ($InstallIfMissing) {
    if (-not (Test-Path (Join-Path $backend 'node_modules'))) {
      Write-Host 'Installing backend dependencies...' -ForegroundColor Yellow
      Push-Location $backend; npm install; Pop-Location
    }
    if (-not (Test-Path (Join-Path $frontend 'node_modules'))) {
      Write-Host 'Installing frontend dependencies...' -ForegroundColor Yellow
      Push-Location $frontend; npm install; Pop-Location
    }
    if (-not (Test-Path $aiVenvBin)) {
      Write-Host 'Creating Python venv and installing AI deps...' -ForegroundColor Yellow
      Push-Location $ai
      python -m venv venv
      & "$aiVenvBin\Activate.ps1"
      pip install -r requirements.txt
      Pop-Location
    }
  }
}

function Start-Backend {
  $cmd = "$env:Path='$aiVenvBin;' + $env:Path; npm run dev"
  Start-Process -WindowStyle Normal -FilePath 'powershell' -ArgumentList @('-NoExit','-Command',$cmd) -WorkingDirectory $backend | Out-Null
  Write-Host '✅ Backend started (port 5000).' -ForegroundColor Green
}

function Start-Frontend {
  Start-Process -WindowStyle Normal -FilePath 'powershell' -ArgumentList @('-NoExit','-Command','npm run dev') -WorkingDirectory $frontend | Out-Null
  Write-Host '✅ Frontend started (port 5173).' -ForegroundColor Green
}

# Optional: ensure deps if flag provided
Ensure-Dependencies

# Start services
Start-MongoDB
Start-Backend
Start-Frontend

Start-Sleep -Seconds 2
Start-Process 'http://localhost:5173' | Out-Null

Write-Host '🚀 All set! Frontend opened in your browser.' -ForegroundColor Cyan
