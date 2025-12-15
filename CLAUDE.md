# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BusinessManagementSuite - A modular suite of interconnected business applications (ERP, CPQ, CRM style). The system uses a modular architecture where each business function (system, peopleManagement, etc.) is a self-contained module.

## Technology Stack

- **Frontend**: Angular 19 (TypeScript, SCSS)
- **Backend**: Spring Boot 3.4.1 (Java 21, Maven)
- **Database**: PostgreSQL 16
- **Migrations**: Flyway
- **Containerization**: Docker / Docker Compose

## Project Structure

```
BusinessManagementSuite/
├── frontend/                    # Angular application
│   └── src/
│       ├── app/                 # Application components and modules
│       │   ├── system/          # System module (dashboard, auth UI)
│       │   ├── layout/          # Layout components (top-menu, sidebar)
│       │   ├── core/            # Core services, guards, interceptors
│       │   └── ...              # Other feature modules
│       └── assets/              # Static assets
│           └── images/
│               └── icons/       # Application icons (logo_trans_bkgrd.png)
├── backend/                     # Spring Boot application
│   └── src/main/java/com/aspiredigital/
│       ├── Application.java     # Main entry point
│       ├── system/              # System module (auth, config, users)
│       │   ├── config/          # SecurityConfig, WebConfig, JwtProperties
│       │   ├── controller/      # AuthController
│       │   ├── model/           # User entity
│       │   ├── repository/      # UserRepository
│       │   ├── security/        # JWT filter, UserPrincipal
│       │   ├── service/         # UserService, JwtService
│       │   └── dto/             # LoginRequest, UserResponse
│       └── peoplemanagement/    # People management module
│           ├── controller/
│           ├── model/           # Person entity
│           ├── repository/
│           └── service/
├── .devcontainer/               # VS Code Dev Container config
├── Dockerfile                   # Multi-stage build (Angular + Spring Boot)
├── Dockerfile.backend           # Dev Dockerfile for Spring Boot with hot reload
├── Dockerfile.frontend          # Dev Dockerfile for Angular with hot reload
├── docker-compose.yml           # Production: PostgreSQL + combined app
├── docker-compose.dev.yml       # Development: Separate containers with hot reload
└── DEV-DOCKER.md                # Development Docker documentation
```

## Assets

- **Application Logo**: `frontend/src/assets/images/icons/logo_trans_bkgrd.png` - Used in top menu header

## Development Commands

### Docker Dev Mode (Recommended for Active Development)

Hot reload for both backend and frontend without rebuilding images.

```bash
# First time setup
docker compose -f docker-compose.dev.yml up --build

# Normal development (no rebuild needed)
docker compose -f docker-compose.dev.yml up

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Rebuild after dependency changes (pom.xml or package.json)
docker compose -f docker-compose.dev.yml up --build backend
docker compose -f docker-compose.dev.yml up --build frontend
```

**Access Points:**
- Frontend: http://localhost:4200 (Angular dev server)
- Backend: http://localhost:8080 (Spring Boot API)
- Debug: localhost:5005 (Remote debugging)

See [DEV-DOCKER.md](DEV-DOCKER.md) for full documentation.

### Docker Production Mode

```bash
# Build and start production containers
docker-compose up -d

# View logs
docker-compose logs -f app

# Rebuild after code changes
docker-compose build && docker-compose up -d

# Stop all services
docker-compose down
```

**Access the app at: http://localhost:8080**

### Local Development (without Docker)

Requires: Node.js 20+, Java 21, Maven, PostgreSQL running locally

```bash
# Frontend (development server with hot reload)
cd frontend
npm install
npm start                        # http://localhost:4200

# Build frontend to backend static folder
npm run build

# Backend (requires PostgreSQL on localhost:5432)
cd backend
mvn spring-boot:run              # http://localhost:8080
```

### Database

```bash
# Flyway migrations location: backend/src/main/resources/db/migration/
# Naming convention: V{version}__{description}.sql
# Example: V1__initial_schema.sql

# Current tables: users, people
```

### VS Code Dev Container

Open the project in VS Code, then use "Reopen in Container" to launch a full development environment with Java 21, Node 20, and PostgreSQL.

## Architecture Notes

- **Single deployable**: Angular is built and bundled into Spring Boot's JAR via multi-stage Docker build
- **Spring serves Angular**: Static files served from `classpath:/static/` with SPA routing support
- **Modular backend**: Each module (system, peopleManagement) has its own package structure
- **Database migrations**: Schema managed by Flyway, JPA set to `validate` mode
- **Security**: Spring Security with BCrypt password encoding, public routes for SPA and auth endpoints

## Module Guidelines

When adding new modules:
1. Create package under `com.aspiredigital.{modulename}/`
2. Include subpackages: controller, service, repository, model
3. Add Flyway migration for new tables: `V{next}__{module}_schema.sql`
4. Add corresponding Angular module under `frontend/src/app/{modulename}/`

## Environment Variables (Docker)

The following can be overridden in docker-compose.yml:
- `SPRING_DATASOURCE_URL` - PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
