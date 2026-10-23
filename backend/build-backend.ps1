# ===================================================================
# FitBuddy Spring Boot Build Script (PowerShell)
#
# Usage:
#   .\build-backend.ps1
#
# Compiles all Java source code and copies resources without running the server.
# ===================================================================

$ErrorActionPreference = "Stop"

$BackendDir = $PSScriptRoot
$SrcDir = Join-Path $BackendDir "src\main\java"
$ResDir = Join-Path $BackendDir "src\main\resources"
$TargetClasses = Join-Path $BackendDir "target\classes"

if (-not (Test-Path $TargetClasses)) {
    New-Item -ItemType Directory -Path $TargetClasses -Force | Out-Null
}

$M2Repo = "$env:USERPROFILE\.m2\repository"
$Jars = Get-ChildItem -Path $M2Repo -Filter "*.jar" -Recurse | Where-Object {
    $_.FullName -notmatch "1\.7\.36" -and
    $_.FullName -notmatch "maven-plugin" -and
    $_.FullName -notmatch "plexus" -and
    $_.FullName -notmatch "aether"
} | Select-Object -ExpandProperty FullName

$Classpath = ($Jars -join ";")
$JavaFiles = Get-ChildItem -Path $SrcDir -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName

Write-Host "Compiling $($JavaFiles.Count) Java files with -parameters..." -ForegroundColor Cyan
& javac --release 21 -parameters -cp $Classpath -d $TargetClasses $JavaFiles
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Compilation failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Copy-Item -Path "$ResDir\*" -Destination $TargetClasses -Force -Recurse
Write-Host "BUILD SUCCESSFUL! Target classes and resources up to date." -ForegroundColor Green
