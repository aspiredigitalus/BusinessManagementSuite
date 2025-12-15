# Development Docker Setup

Fast iterative development with hot reload for Spring Boot and Angular.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│  Database   │
│  (Angular)  │     │(Spring Boot)│     │ (PostgreSQL)│
│  :4200      │     │   :8080     │     │   :5432     │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       └── /api/* requests proxied to backend
```

The Angular dev server proxies `/api/*` requests to the backend via `proxy.conf.json`.

## Quick Start

### First Time Setup

```bash
docker compose -f docker-compose.dev.yml up --build
```

This builds the images and starts all services. Dependencies are cached in Docker volumes.

### Normal Development

```bash
docker compose -f docker-compose.dev.yml up
```

No rebuild needed - source code is bind-mounted for hot reload.

### Access Points

| Service  | URL                     | Purpose              |
|----------|-------------------------|----------------------|
| Frontend | http://localhost:4200   | Angular dev server   |
| Backend  | http://localhost:8080   | Spring Boot API      |
| Database | localhost:5432          | PostgreSQL (direct)  |

### Login Credentials (Dev)

- **Username:** `developer`
- **Password:** `Asp!reDigita1`

## Hot Reload Behavior

### Backend (Spring Boot)

- Edit files in `backend/src/` → Spring DevTools auto-restarts (~2-3 seconds)
- DevTools watches for class changes and triggers restart
- Debug port available on `5005` for remote debugging

### Frontend (Angular)

- Edit files in `frontend/src/` → Angular rebuilds and browser refreshes
- Uses `--poll 2000` for reliable Windows/Docker file watching
- Changes typically reflect in 1-2 seconds

## Common Commands

### View Logs

```bash
# All services
docker compose -f docker-compose.dev.yml logs -f

# Specific service
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f db
```

### Restart a Service

```bash
docker compose -f docker-compose.dev.yml restart backend
docker compose -f docker-compose.dev.yml restart frontend
```

### Stop All Services

```bash
docker compose -f docker-compose.dev.yml down
```

### Rebuild After Dependency Changes

If you modify `pom.xml` or `package.json`:

```bash
# Rebuild only the affected service
docker compose -f docker-compose.dev.yml up --build backend
docker compose -f docker-compose.dev.yml up --build frontend

# Or rebuild everything
docker compose -f docker-compose.dev.yml up --build
```

### Wipe Database (Fresh Start)

```bash
# Stop containers and remove the database volume
docker compose -f docker-compose.dev.yml down -v

# Or remove just the db volume
docker volume rm bms_dev_pgdata
```

### Clear Dependency Caches

```bash
# Maven cache
docker volume rm bms_dev_maven_cache

# Node modules
docker volume rm bms_dev_node_modules
```

## Troubleshooting

### File changes not detected (Windows)

The Angular dev server uses polling (`--poll 2000`) which should work on Windows/Docker Desktop. If changes still aren't detected:

1. Ensure Docker Desktop has access to your drive (Settings → Resources → File Sharing)
2. Try increasing the poll interval in `Dockerfile.frontend`
3. Check that antivirus isn't blocking file access

### Backend not restarting on changes

1. Verify DevTools is enabled: check `application-dev.properties`
2. Ensure `SPRING_PROFILES_ACTIVE=dev` is set
3. Try manual restart: `docker compose -f docker-compose.dev.yml restart backend`

### Out of memory errors

Increase Docker Desktop memory allocation (Settings → Resources → Memory). Recommended: 4GB minimum.

### Database connection issues

1. Wait for healthcheck to pass: `docker compose -f docker-compose.dev.yml ps`
2. Check db logs: `docker compose -f docker-compose.dev.yml logs db`
3. Verify credentials match in `application.properties`

## Volume Locations

| Volume                  | Purpose                          |
|-------------------------|----------------------------------|
| `bms_dev_pgdata`        | PostgreSQL data                  |
| `bms_dev_maven_cache`   | Maven dependencies (.m2)         |
| `bms_dev_node_modules`  | Node modules (npm packages)      |

## Production vs Development

| Aspect           | Production (`docker-compose.yml`)  | Development (`docker-compose.dev.yml`) |
|------------------|------------------------------------|-----------------------------------------|
| Build            | Multi-stage, optimized JAR         | Separate containers, live source        |
| Frontend         | Built into Spring Boot static      | Standalone Angular dev server           |
| Hot Reload       | No                                 | Yes                                     |
| Debugging        | No                                 | Yes (port 5005)                         |
| Dependencies     | Bundled in image                   | Cached in volumes                       |
