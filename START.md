# 🚀 TaskFlow - Manual Startup Commands

## Prerequisites

Before starting, make sure you have:
- ✅ Docker Desktop running (for PostgreSQL and Redis)
- ✅ Node.js installed
- ✅ Two terminal windows ready

---

## Step 1: Start Databases (Docker)

Open a terminal in the **project root** and run:

```powershell
cd "C:\Users\PasinduMadhuwantha\Documents\TaskFlow - Real-Time Task Management Platform\TaskFlow---Real-Time-Task-Management-Platform"

# Start PostgreSQL and Redis containers
docker-compose up -d

# Verify containers are running
docker ps
```

You should see:
- `taskflow---real-time-task-management-platform-postgres-1`
- `taskflow---real-time-task-management-platform-redis-1`

---

## Step 2: Start Backend (NestJS)

Open a **NEW terminal window** and run:

```powershell
# Navigate to backend directory
cd "C:\Users\PasinduMadhuwantha\Documents\TaskFlow - Real-Time Task Management Platform\TaskFlow---Real-Time-Task-Management-Platform\backend"

# Start the backend server
npm run start:dev
```

**Backend will start on:** `http://localhost:3002`
- API: `http://localhost:3002/api`
- Swagger Docs: `http://localhost:3002/api/docs`

Wait until you see:
```
[Nest] INFO [RoutesResolver] TasksController {/api/tasks}:
[Nest] INFO [NestApplication] Nest application successfully started
```

---

## Step 3: Start Frontend (React + Vite)

Open a **NEW terminal window** and run:

```powershell
# Navigate to frontend directory
cd "C:\Users\PasinduMadhuwantha\Documents\TaskFlow - Real-Time Task Management Platform\TaskFlow---Real-Time-Task-Management-Platform\frontend"

# Start the frontend development server
npm run dev
```

**Frontend will start on:** `http://localhost:5173` (or next available port)

Wait until you see:
```
VITE v7.3.1  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## Step 4: Access Application

Open your browser and go to:
```
http://localhost:5173
```
(or whatever port Vite shows in the terminal)

---

## 🎯 Quick Commands Summary

### Start Everything:

**Terminal 1 - Databases:**
```powershell
cd "C:\Users\PasinduMadhuwantha\Documents\TaskFlow - Real-Time Task Management Platform\TaskFlow---Real-Time-Task-Management-Platform"
docker-compose up -d
```

**Terminal 2 - Backend:**
```powershell
cd "C:\Users\PasinduMadhuwantha\Documents\TaskFlow - Real-Time Task Management Platform\TaskFlow---Real-Time-Task-Management-Platform\backend"
npm run start:dev
```

**Terminal 3 - Frontend:**
```powershell
cd "C:\Users\PasinduMadhuwantha\Documents\TaskFlow - Real-Time Task Management Platform\TaskFlow---Real-Time-Task-Management-Platform\frontend"
npm run dev
```

---

## 🛑 Stop Everything

### Stop Frontend:
Press `Ctrl + C` in the frontend terminal

### Stop Backend:
Press `Ctrl + C` in the backend terminal

### Stop Databases:
```powershell
cd "C:\Users\PasinduMadhuwantha\Documents\TaskFlow - Real-Time Task Management Platform\TaskFlow---Real-Time-Task-Management-Platform"
docker-compose down
```

---

## 🔍 Troubleshooting

### Issue: Docker containers not starting
**Solution:**
1. Make sure Docker Desktop is running
2. Check if ports 5432 (PostgreSQL) and 6379 (Redis) are free:
   ```powershell
   netstat -ano | findstr :5432
   netstat -ano | findstr :6379
   ```

### Issue: Backend says "ECONNREFUSED" to database
**Solution:**
- Make sure Docker containers are running first
- Wait 10-15 seconds after starting Docker before starting backend

### Issue: Port already in use
**Solution:**
```powershell
# Find process using the port (e.g., 3000)
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: Frontend shows blank page
**Solution:**
- Check browser console for errors
- Make sure backend is running on port 3000
- Check `.env` file in frontend has correct URLs

---

## 📝 Environment Variables

### Backend (.env)
Located at: `backend\.env`
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=taskflow
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=SECRET_KEY
PORT=3000
```

### Frontend (.env)
Located at: `frontend\.env`
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

---

## ✅ Verify Everything is Working

### Check Backend:
```powershell
# Open Swagger docs in browser
start http://localhost:3000/api/docs
```

### Check Frontend:
```powershell
# Open in browser
start http://localhost:5173
```

### Check Databases:
```powershell
# View running containers
docker ps

# Check PostgreSQL logs
docker logs taskflow---real-time-task-management-platform-postgres-1

# Check Redis logs
docker logs taskflow---real-time-task-management-platform-redis-1
```

---

## 🚀 Ready to Go!

Once all three are running:
1. ✅ Docker containers (PostgreSQL + Redis)
2. ✅ Backend (NestJS on port 3000)
3. ✅ Frontend (React on port 5173)

**Open:** `http://localhost:5173`

Register a new account and start using TaskFlow! 🎉
