# 🚀 TaskFlow - Quick Deployment Reference

## 📦 What I Created For You

1. **`backend/Dockerfile`** - Backend containerization
2. **`frontend/Dockerfile`** - Frontend containerization  
3. **`docker-compose.yml`** - Local testing with Docker
4. **`.github/workflows/deploy.yml`** - CI/CD pipeline
5. **`DEPLOYMENT.md`** - Complete deployment guide

---

## ⚡ Quick Start (3 Options)

### **Option 1: Full GCP Deployment (Recommended for Production)**

Follow the complete guide in `DEPLOYMENT.md`

**Summary:**
1. Create GCP project
2. Set up Cloud SQL (PostgreSQL) + Redis
3. Configure GitHub secrets
4. Push to GitHub → Auto-deploy!

**Cost:** ~$65-80/month

---

### **Option 2: Test Locally with Docker**

```bash
# Build and run everything
docker-compose up --build

# Access:
# Frontend: http://localhost
# Backend: http://localhost:3002
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

**Cost:** Free (runs on your machine)

---

### **Option 3: Manual Cloud Run Deployment**

```bash
# 1. Install gcloud CLI
# 2. Login
gcloud auth login

# 3. Set project
gcloud config set project YOUR_PROJECT_ID

# 4. Deploy backend
cd backend
gcloud run deploy taskflow-backend --source . --region=us-central1

# 5. Deploy frontend
cd ../frontend
gcloud run deploy taskflow-frontend --source . --region=us-central1
```

---

## 📋 Deployment Checklist

### Before Deployment:
- [ ] **GCP account** with billing enabled
- [ ] **GitHub repository** created
- [ ] **gcloud CLI** installed
- [ ] **Docker** installed (for local testing)

### GCP Setup:
- [ ] Create project
- [ ] Enable APIs (Cloud Run, Cloud SQL, Redis, etc.)
- [ ] Create Cloud SQL instance
- [ ] Create Redis instance
- [ ] Create service account
- [ ] Download service account key

### GitHub Setup:
- [ ] Add repository secrets:
  - `GCP_PROJECT_ID`
  - `GCP_SA_KEY`
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `REDIS_HOST`, `REDIS_PORT`
  - `JWT_SECRET`

### Deployment:
- [ ] Push code to GitHub main branch
- [ ] Wait for CI/CD to complete
- [ ] Test deployed URLs
- [ ] Verify database connection
- [ ] Test user registration/login
- [ ] Test task creation

---

## 🛠️ Common Commands

### View Deployment Status
```bash
# Check GitHub Actions
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# Check Cloud Run services
gcloud run services list --region=us-central1
```

### View Logs
```bash
# Backend logs
gcloud run services logs read taskflow-backend --region=us-central1 --limit=50

# Frontend logs
gcloud run services logs read taskflow-frontend --region=us-central1 --limit=50
```

### Update Environment Variables
```bash
gcloud run services update taskflow-backend \
  --region=us-central1 \
  --update-env-vars "JWT_SECRET=new-secret"
```

### Redeploy
```bash
# Just push to GitHub
git add .
git commit -m "Update"
git push

# Or manual:
gcloud run deploy taskflow-backend --source ./backend --region=us-central1
```

---

## 🌐 Architecture

```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │ (git push)
         ↓
┌─────────────────┐
│ GitHub Actions  │ ← CI/CD Pipeline
└────────┬────────┘
         │
         ├──→ Build Docker Images
         ├──→ Push to GCR
         └──→ Deploy to Cloud Run
                     ↓
         ┌──────────────────────┐
         │   Google Cloud Run   │
         ├──────────────────────┤
         │  Frontend (Nginx)    │ ← Port 80
         │  Backend (NestJS)    │ ← Port 3002
         └──────────┬───────────┘
                    │
         ┌──────────┴───────────┐
         │                      │
    ┌────▼────┐          ┌─────▼─────┐
    │Cloud SQL│          │Redis/     │
    │(Postgres)│          │Memorystore│
    └─────────┘          └───────────┘
```

---

## 💡 Tips

1. **Start with Docker Compose** locally to test everything
2. **Use Cloud SQL Proxy** locally to test with production DB
3. **Monitor costs** in GCP Console
4. **Enable Cloud Logging** for debugging
5. **Set up alerts** for errors and high costs
6. **Use terraform** for infrastructure-as-code (advanced)

---

## 🔐 Security

- **Never commit** `.env` files or secrets
- **Use Secret Manager** in production
- **Enable HTTPS** (Cloud Run does this automatically)
- **Configure CORS** properly
- **Use VPC** for private networking (advanced)
- **Enable Cloud Armor** for DDoS protection

---

## 📞 Support

**Issues?**
1. Check `DEPLOYMENT.md` for detailed steps
2. View logs: `gcloud run services logs read SERVICE_NAME`
3. Check GitHub Actions for build errors
4. Verify secrets are configured correctly

**Need help?**
- GCP Documentation: https://cloud.google.com/run/docs
- GitHub Actions: https://docs.github.com/actions

---

**Ready to deploy?** Start with `DEPLOYMENT.md`! 🚀
