# 🏋️ FitBuddy - All-in-One Fitness & Wellness Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![HTML5](https://img.shields.io/badge/HTML5-Modern-E34F26.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Flex%20%26%20Grid-1572B6.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**FitBuddy** is a modern, responsive full-stack fitness and wellness web application designed to help users reach their health goals, track workouts, manage customized diet plans, analyze progress, and stay motivated.

---

## 🌟 Key Features

### 🖥️ Frontend (Client Experience)
- **Interactive Dashboard**: Real-time calorie counters, workout summaries, hydration tracking, and activity streaks.
- **Workout Library & Exercise Explorer**: Rich exercise database with detailed muscle group targeting, difficulty levels, and step-by-step instructions.
- **Interactive Workout Timer**: High-intensity interval timer (HIIT), rest intervals, audio cues, and active rep tracking.
- **Personalized Nutrition & Diet Planner**: Macro calculators, daily meal plans, calorie goals, and dietary preference filters.
- **BMI & Health Metrics**: Smart BMI calculator with health classification, ideal weight estimates, and recommendations.
- **Progress Tracking & Analytics**: Visual charts for weight tracking, body measurements, consistency calendars, and milestones.
- **User Authentication & Profile**: Seamless login, registration, onboarding flow, and personalized profile settings.
- **Modern UI/UX**: Dark mode aesthetic, glassmorphism elements, smooth micro-animations, and responsive mobile-first layouts.

### ⚙️ Backend (API & Services)
- **Spring Boot 3.2.4 & Java 21**: High-performance RESTful API with modular clean architecture.
- **Layered Architecture**: Clear separation of concerns (`controller`, `service`, `repository`, `entity`, `dto`, `security`, `exception`).
- **Security & CORS**: Salted one-way password hashing using `BCryptPasswordEncoder`, configurable CORS origin validation for the frontend.
- **Centralized Error Handling**: `@RestControllerAdvice` global exception handling delivering standard, safe JSON error responses without stack leaks.
- **Database Ready**: Spring Data JPA with MySQL driver; zero hardcoded passwords via environment variable configuration.
- **1-Click PowerShell Runner**: Standalone runner script (`run-backend.ps1`) capable of building and launching without requiring a separate Maven install.

---

## 📁 Repository Structure

```
FitBuddy/
├── .gitignore                      # Top-level Git ignore rules
├── README.md                       # Main project documentation
├── frontend/                       # Client web application
│   ├── index.html                  # Landing / Home page
│   ├── pages/                      # Application views & pages
│   │   ├── dashboard.html          # User dashboard
│   │   ├── workouts.html           # Workout catalog
│   │   ├── workout-timer.html      # Active workout timer
│   │   ├── exercise-details.html   # Detailed exercise guide
│   │   ├── diet.html               # Meal & diet plans
│   │   ├── bmi.html                # BMI calculator
│   │   ├── progress.html           # Analytics & progress
│   │   ├── login.html              # Authentication (Sign In)
│   │   ├── register.html           # Authentication (Sign Up)
│   │   ├── profile-setup.html      # Onboarding questionnaire
│   │   ├── profile.html            # User profile management
│   │   ├── settings.html           # Account & app preferences
│   │   └── subscription.html       # Membership plans
│   ├── css/                        # Global & page stylesheets
│   ├── js/                         # Frontend application logic & modules
│   └── assets/                     # Icons, images, and static graphics
└── backend/                        # Spring Boot REST API
    ├── pom.xml                     # Maven project configuration
    ├── run-backend.ps1             # 1-Click PowerShell runner script
    ├── build-backend.ps1           # 1-Click PowerShell build script
    ├── README.md                   # Backend architecture documentation
    └── src/
        └── main/
            ├── java/com/fitbuddy/  # Java application source code
            └── resources/          # Configuration (application.properties)
```

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 21 or higher installed (`java -version` and `javac -version`)
- **Web Browser**: Chrome, Edge, Firefox, or Safari
- **(Optional) Database**: MySQL 8.x for persistent user data

---

### 1. Running the Frontend
The frontend consists of modern static HTML5, CSS3, and JavaScript. You can serve it using any HTTP server:

#### Using Python (Built-in):
```bash
cd frontend
python -m http.server 8000
```
Then open your browser at **`http://localhost:8000`**.

#### Using VS Code Live Server:
Right-click `frontend/index.html` and select **"Open with Live Server"**.

---

### 2. Running the Backend

#### Option A: Using the PowerShell Runner (Quickest)
```powershell
cd backend
.\run-backend.ps1
```
The server will start on **`http://localhost:8080`**.

#### Option B: Using Maven
```bash
cd backend
mvn spring-boot:run
```

#### Health Check
Verify the backend is active:
```bash
curl http://localhost:8080/api/health
```

---

## 🔒 Security Best Practices
- **No hardcoded secrets**: Secrets and database credentials are excluded from version control.
- **Local credentials**: Store local credentials in `backend/src/main/resources/application-local.properties` (ignored by `.gitignore`) or use environment variables:
  ```powershell
  $env:SPRING_DATASOURCE_PASSWORD = "your_actual_password"
  $env:SPRING_DATASOURCE_EXCLUDE = ""
  ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
