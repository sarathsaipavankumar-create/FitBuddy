# ===================================================================
# FitBuddy Spring Boot Backend Runner Script (PowerShell)
#
# Usage:
#   .\run-backend.ps1
#
# This script:
# 1. Automatically locates cached Spring Boot 3.2.4 dependencies.
# 2. Compiles the Java source files using 'javac --release 21'.
# 3. Copies application.properties into target/classes.
# 4. Boots the Spring Boot application on http://localhost:8080.
# ===================================================================

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "         FitBuddy Spring Boot Backend Runner             " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

$BackendDir = $PSScriptRoot
$SrcDir = Join-Path $BackendDir "src\main\java"
$ResDir = Join-Path $BackendDir "src\main\resources"
$TargetClasses = Join-Path $BackendDir "target\classes"

# 1. Create target classes directory
if (-not (Test-Path $TargetClasses)) {
    New-Item -ItemType Directory -Path $TargetClasses -Force | Out-Null
}

# 2. Collect dependencies from .m2 repository
$M2Repo = "$env:USERPROFILE\.m2\repository"
Write-Host "[1/4] Assembling classpath from $M2Repo..." -ForegroundColor Cyan

$Jars = Get-ChildItem -Path $M2Repo -Filter "*.jar" -Recurse | Where-Object {
    $_.FullName -notmatch "1\.7\.36" -and
    $_.FullName -notmatch "maven-plugin" -and
    $_.FullName -notmatch "plexus" -and
    $_.FullName -notmatch "aether"
} | Select-Object -ExpandProperty FullName

$Classpath = ($Jars -join ";")

# 3. Find all Java files
$JavaFiles = Get-ChildItem -Path $SrcDir -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName
Write-Host "[2/4] Compiling $($JavaFiles.Count) Java classes with javac --release 21 -parameters..." -ForegroundColor Cyan

& javac --release 21 -parameters -cp $Classpath -d $TargetClasses $JavaFiles
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Compilation failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "       Compilation succeeded with 0 errors." -ForegroundColor Green

# 4. Copy resources
Write-Host "[3/4] Copying resources (application.properties)..." -ForegroundColor Cyan
Copy-Item -Path "$ResDir\*" -Destination $TargetClasses -Force -Recurse

# 5. Run Spring Boot Application
Write-Host "[4/4] Starting FitBuddyApplication on http://localhost:8080..." -ForegroundColor Cyan
Write-Host "       Health Check URL: http://localhost:8080/api/health" -ForegroundColor Yellow
Write-Host "       Press Ctrl+C to stop the backend server.`n" -ForegroundColor Gray

$RunClasspath = "$TargetClasses;$Classpath"
& java -cp $RunClasspath com.fitbuddy.FitBuddyApplication
