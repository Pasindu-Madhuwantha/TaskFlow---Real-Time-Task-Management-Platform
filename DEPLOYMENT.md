# TaskFlow - GCP Deployment Guide

This guide will walk you through deploying TaskFlow to Google Cloud Platform (GCP) with CI/CD using GitHub Actions.

## 📋 Prerequisites

1. **GCP Account** with billing enabled
2. **GitHub Repository** for your code
3. **gcloud CLI** installed locally
4. **Docker** installed locally (for testing)

---

## 🚀 Step-by-Step Deployment

### **1. Set Up GCP Project**

```bash
# Login to GCP
gcloud auth login

# Create a new project (or use existing)
gcloud projects create taskflow-prod --name="TaskFlow Production"

# Set the project
gcloud config set project taskflow-prod

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com
```

### **2. Set Up PostgreSQL (Cloud SQL)**

```bash
# Create Cloud SQL PostgreSQL instance
gcloud sql instances create taskflow-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create taskflow \
  --instance=taskflow-db

# Get connection name (save this for later)
gcloud sql instances describe taskflow-db --format='value(connectionName)'
```

### **3. Set Up Redis (Memorystore)**

```bash
# Create Redis instance
gcloud redis instances create taskflow-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0

# Get Redis host (save this for later)
gcloud redis instances describe taskflow-redis \
  --region=us-central1 \
  --format='value(host)'
```

### **4. Create Service Account for GitHub Actions**

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding taskflow-prod \
  --member="serviceAccount:github-actions@taskflow-prod.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding taskflow-prod \
  --member="serviceAccount:github-actions@taskflow-prod.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding taskflow-prod \
  --member="serviceAccount:github-actions@taskflow-prod.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@taskflow-prod.iam.gserviceaccount.com
```

### **5. Configure GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

```
GCP_PROJECT_ID = taskflow-prod
GCP_SA_KEY = <contents of key.json file>
DB_HOST = <Cloud SQL connection name>
DB_PORT = 5432
DB_USER = postgres
DB_PASSWORD = <your secure password>
DB_NAME = taskflow
REDIS_HOST = <Redis instance host>
REDIS_PORT = 6379
JWT_SECRET = <generate a secure random string>
```

### **6. Push Code to GitHub**

```bash
# Initialize git (if not already)
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/TaskFlow.git

# Add all files
git add .

# Commit
git commit -m "Initial commit with CI/CD"

# Push to main branch
git push -u origin main
```

The GitHub Actions workflow will automatically:
1. Build Docker images
2. Push to Google Container Registry
3. Deploy to Cloud Run

---

## 🔧 Local Testing

### Test Docker Images Locally

**Backend:**
```bash
cd backend
docker build -t taskflow-backend .
docker run -p 3002:3002 \
  -e DATABASE_HOST=localhost \
  -e DATABASE_PORT=5432 \
  -e DATABASE_USER=postgres \
  -e DATABASE_PASSWORD=postgres \
  -e DATABASE_NAME=taskflow \
  -e REDIS_HOST=localhost \
  -e REDIS_PORT=6379 \
  -e JWT_SECRET=test-secret \
  taskflow-backend
```

**Frontend:**
```bash
cd frontend
docker build -t taskflow-frontend .
docker run -p 80:80 taskflow-frontend
```

---

## 🌐 Access Your Application

After deployment, get the URLs:

```bash
# Backend URL
gcloud run services describe taskflow-backend \
  --region=us-central1 \
  --format='value(status.url)'

# Frontend URL
gcloud run services describe taskflow-frontend \
  --region=us-central1 \
  --format='value(status.url)'
```

---

## 📊 Monitoring and Logs

### View Logs
```bash
# Backend logs
gcloud run services logs read taskflow-backend --region=us-central1

# Frontend logs
gcloud run services logs read taskflow-frontend --region=us-central1
```

### Monitor Cloud Run
Visit: https://console.cloud.google.com/run

---

## 🔒 Security Best Practices

1. **Use Secret Manager** for sensitive data (recommended for production)
2. **Enable VPC Connector** for private database access
3. **Set up Cloud Load Balancer** for custom domain
4. **Enable Cloud Armor** for DDoS protection
5. **Configure CORS** properly in backend
6. **Use HTTPS** (Cloud Run provides this by default)

---

## 💰 Cost Estimate

- **Cloud Run**: ~$5-20/month (depends on traffic)
- **Cloud SQL (db-f1-micro)**: ~$9/month
- **Redis (1GB)**: ~$50/month
- **Total**: ~$65-80/month

**Free tier**: Cloud Run includes 2 million requests/month free!

---

## 🔄 CI/CD Workflow

The deployment happens automatically when you:

1. **Push to main branch** → Full deployment
2. **Create PR** → Build and test only

### Manual Deployment

```bash
# Deploy backend manually
gcloud run deploy taskflow-backend \
  --source ./backend \
  --region=us-central1 \
  --allow-unauthenticated

# Deploy frontend manually
gcloud run deploy taskflow-frontend \
  --source ./frontend \
  --region=us-central1 \
  --allow-unauthenticated
```

---

## 🐛 Troubleshooting

### Backend won't connect to database
```bash
# Check Cloud SQL connection
gcloud sql instances describe taskflow-db

# Verify database exists
gcloud sql databases list --instance=taskflow-db
```

### Frontend can't reach backend
- Check CORS settings in backend
- Verify VITE_API_URL in frontend .env.production
- Check Cloud Run service URLs

### Out of Memory Errors
- Increase memory allocation in `.github/workflows/deploy.yml`
- Default is 512Mi for backend, 256Mi for frontend

---

## 🎯 Custom Domain Setup

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service=taskflow-frontend \
  --domain=yourdomain.com \
  --region=us-central1

# Follow DNS instructions provided by GCP
```

---

## 📝 Update Environment Variables

```bash
# Update backend environment
gcloud run services update taskflow-backend \
  --region=us-central1 \
  --update-env-vars "KEY=VALUE"
```

---

## ✅ Checklist

- [ ] GCP project created
- [ ] Cloud SQL PostgreSQL instance created
- [ ] Redis instance created
- [ ] Service account created with proper permissions
- [ ] GitHub secrets configured
- [ ] Code pushed to GitHub
- [ ] CI/CD pipeline successful
- [ ] Application accessible via Cloud Run URLs
- [ ] Database migrations run successfully
- [ ] Environment variables configured correctly

---

**Congratulations! Your TaskFlow application is now deployed to GCP with automated CI/CD!** 🎉
