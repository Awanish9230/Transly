@echo off
REM Single-click starter for Meeting AI App
REM Double-click this file to run start-all.ps1 with ExecutionPolicy bypass
set SCRIPT_DIR=%~dp0
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start-all.ps1"
