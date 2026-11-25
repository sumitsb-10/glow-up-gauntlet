# Screenshot a scene headlessly. Usage: scripts/shot.ps1 -Scene intro -Out shots/intro.png
param(
  [Parameter(Mandatory = $true)][string]$Scene,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Width = 1280,
  [int]$Height = 800,
  [int]$Budget = 3000
)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }

# Edge writes harmless renderer noise to stderr; don't let it abort the script.
$prevEA = $ErrorActionPreference
$ErrorActionPreference = "Continue"

$outPath = if ([System.IO.Path]::IsPathRooted($Out)) { $Out } else { Join-Path $root $Out }
$dir = Split-Path -Parent $outPath
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

$url = "file:///" + ($root -replace '\\', '/') + "/index.html?scene=$Scene"
$profile = Join-Path $env:TEMP "gg-edge-profile"

& $edge --headless=new --disable-gpu --no-first-run --hide-scrollbars `
  --window-size="$Width,$Height" --user-data-dir="$profile" `
  --virtual-time-budget=$Budget --screenshot="$outPath" $url 2>$null | Out-Null

if (Test-Path $outPath) { Write-Host "SHOT $outPath" } else { Write-Host "FAILED $outPath" -ForegroundColor Red; exit 1 }
