param(
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"
$AppName = "LedFx Workshop"
$ScriptDir = Split-Path -Parent $PSCommandPath
$ProjectDir = if ($env:LEDFX_WORKSHOP_DIR) {
  (Resolve-Path $env:LEDFX_WORKSHOP_DIR).Path
} else {
  (Resolve-Path (Join-Path $ScriptDir "..")).Path
}
$BindHost = if ($env:LEDFX_WORKSHOP_HOST) { $env:LEDFX_WORKSHOP_HOST } else { "127.0.0.1" }
$StartPort = if ($env:LEDFX_WORKSHOP_PORT) { [int]$env:LEDFX_WORKSHOP_PORT } else { 8057 }
$LedFxUrl = if ($env:LEDFX_API_URL) { $env:LEDFX_API_URL } else { "http://127.0.0.1:8888" }
$LogFile = if ($env:LEDFX_WORKSHOP_LOG) { $env:LEDFX_WORKSHOP_LOG } else { Join-Path $ProjectDir "ledfx-workshop.log" }
$ErrorLogFile = Join-Path $ProjectDir "ledfx-workshop-error.log"

function Show-LauncherMessage {
  param([string]$Message)
  try {
    $shell = New-Object -ComObject WScript.Shell
    $shell.Popup($Message, 0, $AppName, 64) | Out-Null
  } catch {
    Write-Host $Message
  }
}

function New-PythonCommand {
  param(
    [string]$Exe,
    [string[]]$Prefix = @()
  )
  [pscustomobject]@{
    Exe = $Exe
    Prefix = $Prefix
  }
}

function Find-Python {
  $venvPython = Join-Path $ProjectDir ".venv\Scripts\python.exe"
  if (Test-Path $venvPython) {
    return New-PythonCommand -Exe $venvPython
  }

  $pyLauncher = Get-Command "py.exe" -ErrorAction SilentlyContinue
  if ($pyLauncher) {
    return New-PythonCommand -Exe $pyLauncher.Source -Prefix @("-3")
  }

  $python = Get-Command "python.exe" -ErrorAction SilentlyContinue
  if ($python) {
    return New-PythonCommand -Exe $python.Source
  }

  $python3 = Get-Command "python3.exe" -ErrorAction SilentlyContinue
  if ($python3) {
    return New-PythonCommand -Exe $python3.Source
  }

  return $null
}

function Invoke-Python {
  param(
    [object]$Python,
    [string[]]$Arguments
  )
  $allArguments = @($Python.Prefix) + $Arguments
  & $Python.Exe @allArguments
}

function Test-WorkshopStatus {
  param(
    [object]$Python,
    [string]$Url
  )
  $code = @'
import json
import sys
import urllib.request

url = sys.argv[1].rstrip("/") + "/api/connection"
try:
    with urllib.request.urlopen(url, timeout=0.8) as response:
        payload = json.loads(response.read().decode("utf-8"))
    raise SystemExit(0 if isinstance(payload, dict) and "ledfx_url" in payload else 1)
except Exception:
    raise SystemExit(1)
'@
  Invoke-Python -Python $Python -Arguments @("-c", $code, $Url) *> $null
  return $LASTEXITCODE -eq 0
}

function Find-FreePort {
  param(
    [object]$Python,
    [string]$Address,
    [int]$FirstPort
  )
  $code = @'
import socket
import sys

host = sys.argv[1]
start = int(sys.argv[2])
for port in range(start, start + 80):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind((host, port))
        except OSError:
            continue
        print(port)
        raise SystemExit(0)
raise SystemExit(1)
'@
  $port = Invoke-Python -Python $Python -Arguments @("-c", $code, $Address, [string]$FirstPort) 2>$null | Select-Object -First 1
  if (-not $port) {
    throw "No free local port was found."
  }
  return [int]$port
}

function Open-WorkshopUrl {
  param([string]$Url)
  if ($NoOpen -or $env:LEDFX_WORKSHOP_NO_OPEN -eq "1") {
    Write-Host $Url
    return
  }
  Start-Process $Url | Out-Null
}

try {
  if (-not (Test-Path (Join-Path $ProjectDir "src"))) {
    throw "Cannot find the Workshop project folder. Keep this launcher inside the LedFx Workshop folder."
  }

  $Python = Find-Python
  if (-not $Python) {
    throw "Python 3 was not found. Install Python 3.10 or newer, then click the launcher again."
  }

  $existingPortFile = Join-Path $ProjectDir ".ledfx-workshop.port"
  $existingPort = $null
  if (Test-Path $existingPortFile) {
    $existingPort = ((Get-Content -Raw $existingPortFile) -replace "\D", "")
  }

  $checkedPorts = New-Object System.Collections.Generic.HashSet[string]
  foreach ($candidate in @($existingPort, [string]$StartPort)) {
    if ($candidate -and $checkedPorts.Add($candidate)) {
      $candidateUrl = "http://${BindHost}:$candidate"
      if (Test-WorkshopStatus -Python $Python -Url $candidateUrl) {
        Open-WorkshopUrl $candidateUrl
        exit 0
      }
    }
  }

  $Port = Find-FreePort -Python $Python -Address $BindHost -FirstPort $StartPort
  $Url = "http://${BindHost}:$Port"
  $pidFile = Join-Path $ProjectDir ".ledfx-workshop.pid"
  Set-Content -Path $pidFile -Value "" -Encoding UTF8
  Set-Content -Path $existingPortFile -Value $Port -Encoding UTF8

  Add-Content -Path $LogFile -Encoding UTF8 -Value @(
    "",
    "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Starting $AppName",
    "Project: $ProjectDir",
    "Python: $($Python.Exe) $($Python.Prefix -join ' ')",
    "Workshop URL: $Url",
    "LedFx API: $LedFxUrl"
  )

  $arguments = @($Python.Prefix) + @("-m", "src.server", "--host", $BindHost, "--port", [string]$Port, "--ledfx", $LedFxUrl)
  $process = Start-Process -FilePath $Python.Exe -ArgumentList $arguments -WorkingDirectory $ProjectDir -WindowStyle Hidden -RedirectStandardOutput $LogFile -RedirectStandardError $ErrorLogFile -PassThru
  Set-Content -Path $pidFile -Value $process.Id -Encoding UTF8

  for ($attempt = 0; $attempt -lt 60; $attempt += 1) {
    if (Test-WorkshopStatus -Python $Python -Url $Url) {
      Open-WorkshopUrl $Url
      exit 0
    }
    if ($process.HasExited) {
      throw "$AppName stopped while starting. Check $LogFile and $ErrorLogFile."
    }
    Start-Sleep -Milliseconds 250
  }

  Open-WorkshopUrl $Url
  Show-LauncherMessage "$AppName was started, but it did not answer yet. If the page stays blank, check $LogFile and $ErrorLogFile."
} catch {
  Show-LauncherMessage $_.Exception.Message
  exit 1
}
