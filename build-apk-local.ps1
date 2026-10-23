# ===================================================================
# FitBuddy Direct APK Compiler & Packager (PowerShell)
#
# Downloads minimal compiler tools (aapt2, d8/r8, android.jar),
# compiles Java classes into Dalvik DEX bytecode, packages web assets,
# and signs the final FitBuddy.apk.
# ===================================================================

$ErrorActionPreference = "Stop"

$RootDir = $PSScriptRoot
$ToolsDir = Join-Path $RootDir ".build-tools"
$OutApk = Join-Path $RootDir "FitBuddy.apk"
$BuildDir = Join-Path $RootDir ".apk-build"

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "          FitBuddy Direct APK Compiler                   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

if (-not (Test-Path $ToolsDir)) {
    New-Item -ItemType Directory -Path $ToolsDir -Force | Out-Null
}

$Aapt2Exe = Join-Path $ToolsDir "aapt2.exe"
$R8Jar = Join-Path $ToolsDir "r8.jar"
$AndroidJar = Join-Path $ToolsDir "android.jar"

# 1. Download Android Jar
if (-not (Test-Path $AndroidJar)) {
    Write-Host "[1/6] Downloading android.jar (core Android API)..." -ForegroundColor Cyan
    & curl.exe -L "https://raw.githubusercontent.com/Sable/android-platforms/master/android-30/android.jar" -o $AndroidJar --progress-bar
}

# 2. Download aapt2
if (-not (Test-Path $Aapt2Exe)) {
    Write-Host "[2/6] Downloading Google aapt2 resource compiler..." -ForegroundColor Cyan
    $Aapt2Jar = Join-Path $ToolsDir "aapt2.jar"
    & curl.exe -L "https://dl.google.com/dl/android/maven2/com/android/tools/build/aapt2/8.3.2-10880808/aapt2-8.3.2-10880808-windows.jar" -o $Aapt2Jar --progress-bar
    
    # Extract aapt2.exe from jar
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($Aapt2Jar)
    $entry = $zip.GetEntry("aapt2.exe")
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $Aapt2Exe, $true)
    $zip.Dispose()
    Remove-Item $Aapt2Jar -Force -ErrorAction SilentlyContinue
}

# 3. Download R8 / D8 dex compiler
if (-not (Test-Path $R8Jar)) {
    Write-Host "[3/6] Downloading Google D8/R8 DEX bytecode compiler..." -ForegroundColor Cyan
    & curl.exe -L "https://dl.google.com/dl/android/maven2/com/android/tools/r8/8.3.37/r8-8.3.37.jar" -o $R8Jar --progress-bar
}

# 4. Prepare Build Directories
Write-Host "[4/6] Compiling Android resources and AndroidManifest.xml..." -ForegroundColor Cyan
if (Test-Path $BuildDir) {
    Remove-Item -Path $BuildDir -Recurse -Force
}
New-Item -ItemType Directory -Path "$BuildDir\compiled_res" -Force | Out-Null
New-Item -ItemType Directory -Path "$BuildDir\classes" -Force | Out-Null
New-Item -ItemType Directory -Path "$BuildDir\dex" -Force | Out-Null
New-Item -ItemType Directory -Path "$BuildDir\assets" -Force | Out-Null

# Copy web frontend assets
Copy-Item -Path "$RootDir\frontend\*" -Destination "$BuildDir\assets" -Recurse -Force

# Create minimal resources
$ResDir = "$BuildDir\res"
New-Item -ItemType Directory -Path "$ResDir\values" -Force | Out-Null
New-Item -ItemType Directory -Path "$ResDir\mipmap" -Force | Out-Null

Copy-Item -Path "$RootDir\frontend\assets\icons\app-icon.jpg" -Destination "$ResDir\mipmap\ic_launcher.jpg" -Force

Set-Content -Path "$ResDir\values\strings.xml" -Value @"
<resources>
    <string name="app_name">FitBuddy</string>
</resources>
"@

# Create AndroidManifest.xml
$ManifestFile = "$BuildDir\AndroidManifest.xml"
Set-Content -Path $ManifestFile -Value @"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.fitbuddy.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:hardwareAccelerated="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <activity
            android:name="com.fitbuddy.app.MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"@

# Compile resources with aapt2
& $Aapt2Exe compile --dir $ResDir -o "$BuildDir\compiled_res.zip"
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile failed!" }

# Link resources and manifest
$UnsignedApk = "$BuildDir\unsigned.apk"
& $Aapt2Exe link -I $AndroidJar --manifest $ManifestFile -A "$BuildDir\assets" -o $UnsignedApk "$BuildDir\compiled_res.zip" --auto-add-overlay
if ($LASTEXITCODE -ne 0) { throw "aapt2 link failed!" }

# 5. Compile Java Source Code
Write-Host "[5/6] Compiling Java Activity and converting to Dalvik DEX bytecode..." -ForegroundColor Cyan
$JavaSrc = "$BuildDir\MainActivity.java"
Set-Content -Path $JavaSrc -Value @"
package com.fitbuddy.app;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        webView.setWebChromeClient(new WebChromeClient());

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
"@

& javac -source 8 -target 8 -Xlint:-options -cp $AndroidJar -d "$BuildDir\classes" $JavaSrc
if ($LASTEXITCODE -ne 0) { throw "javac failed!" }

# Convert .class to classes.dex using D8/R8
$ClassFiles = (Get-ChildItem -Path "$BuildDir\classes" -Filter "*.class" -Recurse).FullName
& java -cp $R8Jar com.android.tools.r8.D8 --lib $AndroidJar --output "$BuildDir\dex" $ClassFiles
if ($LASTEXITCODE -ne 0) { throw "D8 dex compilation failed!" }

# Find JDK bin directory
$JdkBin = "C:\Program Files\Java\jdk-26.0.2\bin"
if (-not (Test-Path "$JdkBin\jar.exe")) {
    $JdkFolder = Get-ChildItem "C:\Program Files\Java" -Filter "jdk*" | Select-Object -First 1 -ExpandProperty FullName
    $JdkBin = Join-Path $JdkFolder "bin"
}
$JarExe = Join-Path $JdkBin "jar.exe"
$KeytoolExe = Join-Path $JdkBin "keytool.exe"
$JarsignerExe = Join-Path $JdkBin "jarsigner.exe"

# Add classes.dex into the APK
Write-Host "       Bundling classes.dex into APK..." -ForegroundColor Cyan
& $JarExe -uf $UnsignedApk -C "$BuildDir\dex" classes.dex
if ($LASTEXITCODE -ne 0) { throw "jar failed to insert classes.dex!" }

# 6. Sign the APK with debug keystore
Write-Host "[6/6] Signing APK with Android debug keystore..." -ForegroundColor Cyan
$Keystore = Join-Path $ToolsDir "debug.keystore"
if (-not (Test-Path $Keystore)) {
    & $KeytoolExe -genkeypair -v -keystore $Keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=FitBuddy, OU=Mobile, O=FitBuddy, L=FitCity, S=FitState, C=US"
}

Copy-Item -Path $UnsignedApk -Destination $OutApk -Force

# Sign using jarsigner
& $JarsignerExe -sigalg SHA256withRSA -digestalg SHA-256 -keystore $Keystore -storepass android -keypass android $OutApk androiddebugkey
if ($LASTEXITCODE -ne 0) { throw "jarsigner failed!" }

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "       APK GENERATION SUCCESSFUL!                         " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
$ApkInfo = Get-Item $OutApk
Write-Host "APK Location: $($ApkInfo.FullName)" -ForegroundColor Yellow
Write-Host "APK File Size: $([math]::Round($ApkInfo.Length / 1MB, 2)) MB" -ForegroundColor Yellow
Write-Host "Ready to install on any Android phone!" -ForegroundColor Green
