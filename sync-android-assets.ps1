# ===================================================================
# FitBuddy Android Asset Sync Script (PowerShell)
#
# Copies the entire web frontend into the Android app assets folder
# so the Android APK runs 100% offline and standalone.
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

Copy-Item -Path "$FrontendDir\*" -Destination $AndroidAssetsDir -Recurse -Force

$CopiedFiles = (Get-ChildItem -Path $AndroidAssetsDir -Recurse -File).Count
Write-Host "SUCCESS: Synchronized $CopiedFiles frontend files into Android assets." -ForegroundColor Green
Write-Host "Destination: $AndroidAssetsDir" -ForegroundColor Gray
