# Headless smoke check for Glow-Up Gauntlet.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/smoke.ps1 [-Scene ch1] [-Budget 2500]
param(
  [string]$Scene = "",
  [int]$Budget = 2500,
  [switch]$Quiet
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe" }

$url = "file:///" + ($root -replace '\\', '/') + "/index.html"
if ($Scene) { $url += "?scene=$Scene" }

$tmp = Join-Path $env:TEMP "gg-dom-$([guid]::NewGuid().ToString('N')).txt"
$profile = Join-Path $env:TEMP "gg-edge-profile"

& $edge --headless=new --disable-gpu --no-first-run --window-size=1280,800 `
  --user-data-dir="$profile" --virtual-time-budget=$Budget --dump-dom $url 2>$null |
  Out-File -FilePath $tmp -Encoding utf8

$dom = Get-Content $tmp -Raw
Remove-Item $tmp -ErrorAction SilentlyContinue

$fail = 0
function Check($name, $ok) {
  if ($ok) { if (-not $Quiet) { Write-Host "PASS  $name" -ForegroundColor Green } }
  else { Write-Host "FAIL  $name" -ForegroundColor Red; $script:fail++ }
}

Check "app booted (data-ready)" ($dom -match 'data-ready="1"')
Check "expected scene mounted" ($dom -match ('data-scene="' + [regex]::Escape($Scene) + '"'))
Check "scene container has children" ($dom -match '<div id="scene"[^>]*>\s*<')

if ($fail -gt 0) {
  Write-Host "`n--- DOM head ---" -ForegroundColor DarkYellow
  ($dom -split "`n" | Select-Object -First 40) -join "`n"
  exit 1
}
if (-not $Quiet) { Write-Host "`nSMOKE OK" -ForegroundColor Green }
exit 0
