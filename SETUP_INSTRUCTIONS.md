# Backend Setup & Run Instructions

## Prerequisites
- Node.js installed
- Docker Desktop installed (for databases)

## Option 1: Using Docker Desktop (Recommended)

### Step 1: Start Docker Desktop
1. Open **Docker Desktop** from Windows Start Menu
2. Wait until Docker is fully running (whale icon in system tray should be stable)

### Step 2: Remove version field from docker-compose.yml
The `version` field is obsolete in newer Docker Compose versions.

### Step 3: Start Databases
```bash
# Navigate to project root
cd "c:\Users\PasinduMadhuwantha\Documents\TaskFlow - Real-Time Task Management Platform\TaskFlow---Real-Time-Task-Management-Platform"

# Start PostgreSQL and Redis
docker-compose up -d

# Verify containers are running
docker ps
```

You should see two containers running:
- `taskflow---real-time-task-management-platform-postgres-1`
- `taskflow---real-time-task-management-platform-redis-1`

### Step 4: Install Backend Dependencies (if not done)
```bash
cd backend
npm install
```

### Step 5: Start Backend Server
```bash
# From backend directory
npm run start:dev
```

The backend will start on `http://localhost:3000`

### Step 6: Test the API

**Swagger UI**: Open browser to `http://localhost:3000/api/docs`

**Test Endpoints**:
```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"fullName\":\"Test User\"}"

# Login (save the access_token from response)
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"

# Get tasks (use access_token from login)
curl -X GET http://localhost:3000/api/tasks -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Create a task
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" -d "{\"title\":\"My First Task\",\"description\":\"Test task\",\"status\":\"TODO\"}"
```

---

## Option 2: Without Docker (Manual Database Installation)

If you prefer not to use Docker:

### Install PostgreSQL
1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Set password as `postgres`
4. Create database:
```sql
CREATE DATABASE taskflow;
```

### Install Redis on Windows
1. Download Redis from: https://github.com/microsoftarchive/redis/releases
2. Install and run Redis server
3. Default port should be 6379

### Then Follow Steps 4-6 Above

---

## Troubleshooting

### Issue: Docker daemon not running
**Solution**: Make sure Docker Desktop is fully started before running `docker-compose up -d`

### Issue: Port already in use
**Solution**: 
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# Kill the process if needed
taskkill /PID <PID> /F
```

### Issue: npm install fails
**Solution**: 
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeORM connection failed
**Solution**: Make sure PostgreSQL is running and credentials in `.env` match your setup

---

## Stop Services

### Stop Backend
Press `Ctrl+C` in the terminal running `npm run start:dev`

### Stop Docker Containers
```bash
docker-compose down
```
