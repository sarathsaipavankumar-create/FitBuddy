# FitBuddy Spring Boot Backend

Welcome to the backend service for **FitBuddy**! This backend is built with **Java** and **Spring Boot 3.2.4**, designed with clean layered architecture, strong security defaults, and beginner-friendly structure.

---

## 1. Project Package Structure

All Java classes are organized into clean, dedicated packages under `com.fitbuddy`:

```
d:\FitBuddy\backend\
├── pom.xml                               # Standard Maven project configuration
├── run-backend.ps1                       # 1-click PowerShell runner script
├── build-backend.ps1                     # 1-click PowerShell build script
├── .gitignore                            # Keeps secrets, credentials, and builds out of Git
├── src\
│   └── main\
│       ├── java\com\fitbuddy\
│       │   ├── FitBuddyApplication.java  # Main Spring Boot entry point
│       │   ├── controller\               # Handles incoming HTTP requests
│       │   │   └── HealthController.java # Public diagnostic endpoint (/api/health)
│       │   ├── service\                  # Business logic layer (package established)
│       │   ├── repository\               # Spring Data JPA database repositories (package established)
│       │   ├── entity\                   # JPA database entities mapped to tables (package established)
│       │   ├── dto\                      # Data Transfer Objects for clean JSON communication
│       │   │   ├── ApiResponse.java      # Standard success response envelope
│       │   │   ├── HealthResponse.java   # Diagnostics payload
│       │   │   └── ErrorResponse.java    # Consistent error response format
│       │   ├── security\                 # Security, password hashing, and CORS
│       │   │   └── SecurityConfig.java   # BCrypt encoder, CORS for http://localhost:8000, endpoint rules
│       │   └── exception\                # Global exception handling
│       │       ├── ApiException.java     # Base custom business runtime exception
│       │       ├── BadRequestException.java
│       │       ├── ResourceNotFoundException.java (maps to 404)
│       │       └── GlobalExceptionHandler.java    # @RestControllerAdvice for consistent JSON errors
│       └── resources\
│           ├── application.properties    # Central configuration (port, profiles, DB template)
│           └── application-local.properties.example # Template for local untracked credentials
```

---

## 2. Key Architecture Concepts Explained Simply

- **Controller (`com.fitbuddy.controller`)**:
  Receives HTTP requests from the browser (e.g. GET `/api/health`), delegates to services, and returns formatted JSON data.
- **DTO (`com.fitbuddy.dto`)**:
  "Data Transfer Objects". Separates internal database models from the data sent over the network, ensuring sensitive information (like passwords) is never exposed.
- **Security (`com.fitbuddy.security`)**:
  Uses `BCryptPasswordEncoder` for salted one-way password hashing. Automatically validates CORS for the frontend origin (`http://localhost:8000`). Public endpoints are explicitly whitelisted while protected endpoints require authentication.
- **Global Exception Handler (`com.fitbuddy.exception`)**:
  Catches validation errors and server exceptions across the application and transforms them into consistent, clean `ErrorResponse` JSON without leaking server stack traces.

---

## 3. How to Run the Backend

You can run the backend using either the included PowerShell runner or standard Maven:

### Option A: Using the 1-Click PowerShell Runner (Recommended)
Open a terminal in the `backend` folder and run:
```powershell
cd d:\FitBuddy\backend
.\run-backend.ps1
```
This script compiles all Java classes with `javac --release 21`, loads the Spring Boot 3.2.4 dependencies, and starts Tomcat on **`http://localhost:8080`**.

### Option B: Using Maven or Your IDE (VS Code / IntelliJ)
If you have Maven installed or open the `backend` folder in an IDE (IntelliJ IDEA or VS Code with Java Extension Pack):
```bash
mvn spring-boot:run
```

---

## 4. How to Test the Health Endpoint

With the server running on port 8080:

### Using PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/health" | ConvertTo-Json -Depth 4
```

### Using cURL:
```bash
curl.exe http://localhost:8080/api/health
```

### Expected JSON Response:
```json
{
  "success": true,
  "message": "FitBuddy backend service is healthy and operational",
  "data": {
    "status": "UP",
    "application": "FitBuddy Backend API",
    "version": "1.0.0",
    "environment": "development",
    "timestamp": "2026-10-23T10:00:29.250"
  },
  "timestamp": "2026-10-23T10:00:29.250"
}
```

---

## 5. MySQL Database Configuration (No Hardcoded Credentials)

In accordance with security best practices, **zero database passwords or credentials are hardcoded or committed**.

### How to configure your MySQL password when ready:

#### Method 1: Using an Environment Variable (Easiest & Most Secure)
In PowerShell before starting the backend:
```powershell
$env:SPRING_DATASOURCE_PASSWORD = "your_actual_mysql_password"
$env:SPRING_DATASOURCE_EXCLUDE = "" # Activates MySQL DataSource
.\run-backend.ps1
```

#### Method 2: Using an Untracked `application-local.properties` File
1. Copy `src/main/resources/application-local.properties.example` to `src/main/resources/application-local.properties`.
2. Add your local MySQL password.
3. `application-local.properties` is already listed in `.gitignore` so your password will never be committed to Git.
