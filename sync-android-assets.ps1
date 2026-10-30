# ===================================================================
# FitBuddy Android Asset Sync Script (PowerShell)
#
# Copies the entire web frontend into the Android app assets folder
# preserving directory structure (pages/, css/, js/, assets/).
# ===================================================================

$ErrorActionPreference = "Stop"

$RootDir = $PSScriptRoot
$FrontendDir = Join-Path $RootDir "frontend"
$AndroidAssetsDir = Join-Path $RootDir "android\app\src\main\assets"

Write-Host "Syncing FitBuddy frontend files into Android assets..." -ForegroundColor Cyan

if (Test-Path $AndroidAssetsDir) {
    Remove-Item -Path $AndroidAssetsDir -Recurse -Force | Out-Null
}

New-Item -ItemType Directory -Path $AndroidAssetsDir -Force | Out-Null

# 1. Copy subdirectories (pages, css, js, assets)
Get-ChildItem -Path $FrontendDir | Where-Object { $_.PSIsContainer } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $AndroidAssetsDir $_.Name) -Recurse -Force
}

# 2. Copy root files (index.html, manifest.json, sw.js) excluding *.apk
Get-ChildItem -Path $FrontendDir | Where-Object { -not $_.PSIsContainer -and $_.Name -notmatch "\.apk$" } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $AndroidAssetsDir -Force
}

$CopiedFiles = (Get-ChildItem -Path $AndroidAssetsDir -Recurse -File).Count
Write-Host "SUCCESS: Synchronized $CopiedFiles frontend files into Android assets." -ForegroundColor Green
Write-Host "Destination: $AndroidAssetsDir" -ForegroundColor Gray
