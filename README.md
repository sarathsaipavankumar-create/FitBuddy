# 🏋️ FitBuddy - Production-Ready Fitness & Wellness Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Android](https://img.shields.io/badge/Android-APK%20v1%2Fv2%2Fv3%20Signed-green.svg)](https://developer.android.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**FitBuddy** is a full-stack, production-ready fitness and wellness application engineered to deliver identical functionality and design across **both Website format** (live browser URL) and **Android Application format** (installable APK signed with Google v1, v2, and v3 signature schemes).

FitBuddy operates on a single shared ecosystem: user accounts, exercise catalogues, workout logs, BMI screening, and progress tracking recorded via the Android APK are immediately accessible on the Website and vice-versa.

---

## 🌟 Key Features

### 🖥️ Client Experience (Web & Android WebView)
- **Shared Dual-Format UI**: The exact same dark-mode aesthetic, responsive layouts, cards, and micro-animations run seamlessly inside modern desktop/mobile web browsers and the native Android WebView container.
- **Unified Authentication**: Registration and login powered by BCrypt password hashing and persistent token authentication.
- **Dynamic Member Dashboard**: Live workout counts, active consistency streaks, calculated BMI badges, daily spotlight workouts, and activity graphs.
- **Exercise Catalogue & Details**: 25+ structured bodyweight, dumbbell, and calisthenics exercises with targeted muscle groups, instructions, and video/animation cards.
- **Interactive Workout Interval Timer**: High-intensity interval timer with work/rest intervals, audio cues, rep counter, and automatic database logging upon completion.
- **Smart BMI Calculator**: Instant metric BMI assessment with WHO health category classifications and tailored lifestyle suggestions.
- **Diet & Nutrition Planner**: Goal-specific nutrition plans (Muscle Gain, Fat Loss, Endurance) filtered by dietary preference (Vegetarian, Vegan, Non-Veg, Keto).
- **Progress & Consistency Tracker**: Weight logs, completed workouts, and visual consistency trackers with MySQL persistence.
- **User Profile & Settings**: Full demographic customization, measurement unit toggles, and secure account sign-out.
- **100% Free Core Model**: Zero subscription paywalls, upgrade banners, or pricing tiers.

### ⚙️ Backend & Persistence Architecture
- **Layered Architecture**: Controller → Service → Repository → Entity → MySQL Database.
- **Spring Boot 3.2.4 on Java 21**: High-performance RESTful APIs with stateless Bearer token authorization.
- **Database Persistence**: Spring Data JPA with automatic MySQL schema updates and relational mapping.
- **Cryptographic Security**: Passwords hashed with BCrypt (never stored in plain text).
- **Graceful Error Handling**: `@RestControllerAdvice` formatting standard `ApiResponse` and `ErrorResponse` payloads.

---

## 🏗️ Project Architecture

```
[ Web Browser ]              [ Android Application ]
(http://localhost:8000)       (FitBuddy.apk / WebView)
        \                             /
         \                           /
          ▼                         ▼
    [ FitBuddyApi JavaScript Client Layer (api.js) ]
                        │  (REST / JSON)
                        ▼
    ┌───────────────────────────────────────────────┐
    │     Spring Boot 3.2.4 REST API (Port 8080)    │
    │  - SecurityConfig & TokenAuthenticationFilter │
    │  - AuthController       (/api/auth)           │
    │  - UserController       (/api/user)           │
    │  - WorkoutController    (/api/workouts)       │
    │  - ProgressController   (/api/progress)       │
    │  - BmiController        (/api/bmi)            │
    │  - DashboardController  (/api/dashboard)      │
    │  - ExerciseController   (/api/exercises)      │
    │  - HealthController     (/api/health)         │
    └───────────────────────┬───────────────────────┘
                            │
                            ▼
    ┌───────────────────────────────────────────────┐
    │         Service Layer (Business Logic)        │
    │  - AuthService, UserProfileService,           │
    │  - WorkoutService, ProgressService,           │
    │  - BmiService, DashboardService               │
    └───────────────────────┬───────────────────────┘
                            │
                            ▼
    ┌───────────────────────────────────────────────┐
    │    Spring Data JPA Repositories & Entities    │
    │  - User, UserProfile, AuthToken               │
    │  - WorkoutRecord, ProgressRecord, BmiRecord   │
    └───────────────────────┬───────────────────────┘
                            │
                            ▼
    ┌───────────────────────────────────────────────┐
    │            MySQL 8.0 Database (fitbuddy_db)   │
    └───────────────────────────────────────────────┘
```

---

## 🛠️ Technologies Used

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (ES6+), Chart.js |
| **Backend** | Java 21, Spring Boot 3.2.4, Spring Security, Spring Data JPA |
| **Database** | MySQL 8.0, HikariCP Connection Pool |
| **Mobile** | Android SDK, Android WebView, AAPT2, D8/R8, Google `apksig` (v1/v2/v3) |
| **Build Tools** | PowerShell automation scripts, Maven |

---

## 📁 Repository Structure

```
FitBuddy/
├── FitBuddy.apk                    # Final production-ready Android APK (Signed v1+v2+v3)
├── build-apk-local.ps1             # 1-Click Android APK build and sign script
├── sync-android-assets.ps1         # Synchronizes frontend assets into Android app
├── frontend/                       # Responsive web client & WebView assets
│   ├── index.html                  # Landing page
│   ├── FitBuddy.apk                # Downloadable APK link for website users
│   ├── pages/                      # Application pages (dashboard, workouts, bmi, etc.)
│   ├── css/                        # Dark theme styles & component tokens
│   ├── js/
│   │   ├── api.js                  # Unified API client for web & Android
│   │   ├── auth.js                 # Authentication logic
│   │   ├── dashboard.js            # Dashboard coordinator
│   │   ├── progress.js             # Progress tracking
│   │   ├── bmi.js                  # BMI screening
│   │   ├── workout-timer.js        # Active workout timer
│   │   └── ...                     # Additional page scripts
│   └── assets/                     # Icons, illustrations, and exercise media
├── backend/                        # Spring Boot REST API
│   ├── pom.xml                     # Maven configuration
│   ├── run-backend.ps1             # 1-Click Spring Boot runner script
│   ├── build-backend.ps1           # 1-Click Spring Boot compile script
│   └── src/main/
│       ├── java/com/fitbuddy/      # Controllers, Services, Repositories, Entities
│       └── resources/              # application.properties (MySQL datasource configuration)
└── android/                        # Android Studio Project container
    └── app/src/main/
        ├── AndroidManifest.xml     # Permissions & activity declarations
        ├── java/com/fitbuddy/app/  # MainActivity.java (WebView host)
        └── assets/                 # Synchronized frontend assets
```

---

## 🗄️ Database Setup Instructions

1. Start your local **MySQL Server** on port `3306`:
   ```powershell
   Start-Service MySQL80
   ```
2. Log into MySQL and create the `fitbuddy_db` database:
   ```sql
   CREATE DATABASE IF NOT EXISTS fitbuddy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Spring Boot JPA automatically initializes the schema tables on boot:
   - `users`: User identity and BCrypt password hashes.
   - `user_profiles`: Demographic settings, BMI, activity level, fitness goals.
   - `auth_tokens`: Secure 30-day bearer tokens.
   - `workout_records`: Completed workout history, durations, and calories.
   - `progress_records`: Weight check-ins and notes.
   - `bmi_records`: Historical BMI entries.
4. Credentials can be passed via environment variables (or configured in `backend/src/main/resources/application.properties`):
   ```powershell
   $env:SPRING_DATASOURCE_URL = "jdbc:mysql://localhost:3306/fitbuddy_db"
   $env:SPRING_DATASOURCE_USERNAME = "root"
   $env:SPRING_DATASOURCE_PASSWORD = "your_mysql_password"
   ```

---

## ⚡ Backend Execution Instructions

### Option 1: 1-Click PowerShell Runner (Recommended)
From the project root:
```powershell
powershell -ExecutionPolicy Bypass -File backend\run-backend.ps1
```
The script compiles all Java 21 classes, copies resources, and boots Tomcat on **`http://localhost:8080`**.

### Option 2: Using Maven
```bash
cd backend
mvn clean compile spring-boot:run
```

### Verification:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get
```

---

## 🌐 Website Deployment Instructions

### Local Development / Testing
Serve the `frontend/` directory using Python or any static web server:
```powershell
python -m http.server 8000 --directory frontend
```
Visit **`http://localhost:8000`** in your browser.

### Cloud / GitHub Pages Deployment
1. Commit and push the `main` branch to your GitHub repository:
   ```bash
   git push origin main
   ```
2. In GitHub repository settings, navigate to **Pages** → deploy from branch (`main` / root or `/docs`).
3. For live production environments, set `fitbuddy_api_base` in `localStorage` or configure `api.js` with your production API domain.

---

## 📱 Android APK Build & Installation Instructions

The FitBuddy Android application is compiled and signed with Google APK Signature Scheme **v1, v2, and v3**, ensuring full compatibility with Android 5.0 through Android 14+.

### 1. Synchronize Frontend Assets into Android Project
```powershell
powershell -ExecutionPolicy Bypass -File .\sync-android-assets.ps1
```

### 2. Compile and Sign the Final APK
```powershell
powershell -ExecutionPolicy Bypass -File .\build-apk-local.ps1
```

### 3. Output
- **Location**: `FitBuddy.apk` (in the project root and available for direct download at `frontend/FitBuddy.apk`).
- **Signature Schemes**: v1 (JAR signing), v2 (APK Signature Scheme v2), v3 (APK Signature Scheme v3).
- **Installation**: Copy `FitBuddy.apk` to any Android device or drag-and-drop into an Android emulator.

---

## 🧪 Testing Results

- **Authentication**: Registration and login successfully tested with BCrypt password hashing and 30-day token generation.
- **Database Connectivity**: Verified against local MySQL 8.0 `fitbuddy_db` database.
- **REST APIs**: All endpoints (`/api/auth/*`, `/api/user/*`, `/api/workouts/*`, `/api/progress/*`, `/api/bmi/*`, `/api/dashboard/*`, `/api/exercises/*`) verified with live HTTP requests.
- **Subscription Removal**: Confirmed 0 references to subscriptions or premium paywalls across all HTML, CSS, JS, and Android assets.
- **APK Verification**: Validated with Google `apksig` verifier (`isVerified: true`).

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
