@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%scripts\launch_workshop.ps1"
if errorlevel 1 (
  echo.
  echo LedFx Workshop could not start. Check ledfx-workshop.log and ledfx-workshop-error.log.
  pause
)
