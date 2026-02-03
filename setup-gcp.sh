#!/bin/bash

# TaskFlow GCP Setup Script
# This script automates the initial GCP setup for TaskFlow deployment

set -e

echo "🚀 TaskFlow GCP Setup Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

print_success "gcloud CLI found"

# Get project ID
read -p "Enter your GCP Project ID (or press Enter to create new): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    read -p "Enter new project ID to create: " PROJECT_ID
    gcloud projects create "$PROJECT_ID" --name="TaskFlow Production"
    print_success "Project created: $PROJECT_ID"
fi

# Set the project
gcloud config set project "$PROJECT_ID"
print_success "Project set to: $PROJECT_ID"

# Get region
read -p "Enter GCP region (default: us-central1): " REGION
REGION=${REGION:-us-central1}

print_info "Enabling required APIs..."

# Enable APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com \
  --quiet

print_success "APIs enabled"

# Create Cloud SQL instance
print_info "Creating Cloud SQL PostgreSQL instance..."
read -p "Enter root password for PostgreSQL (or press Enter for auto-generated): " DB_PASSWORD

if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 32)
    print_info "Generated password: $DB_PASSWORD"
fi

gcloud sql instances create taskflow-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region="$REGION" \
  --root-password="$DB_PASSWORD" \
  --quiet

print_success "Cloud SQL instance created"

# Create database
gcloud sql databases create taskflow \
  --instance=taskflow-db \
  --quiet

print_success "Database 'taskflow' created"

# Get connection name
DB_CONNECTION_NAME=$(gcloud sql instances describe taskflow-db --format='value(connectionName)')
print_success "Database connection name: $DB_CONNECTION_NAME"

# Create Redis instance
print_info "Creating Redis instance..."

gcloud redis instances create taskflow-redis \
  --size=1 \
  --region="$REGION" \
  --redis-version=redis_7_0 \
  --quiet

print_success "Redis instance created"

# Get Redis host
REDIS_HOST=$(gcloud redis instances describe taskflow-redis --region="$REGION" --format='value(host)')
print_success "Redis host: $REDIS_HOST"

# Create service account
print_info "Creating service account for GitHub Actions..."

gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account" \
  --quiet

# Grant permissions
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin" \
  --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin" \
  --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" \
  --quiet

print_success "Permissions granted"

# Create service account key
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account="github-actions@$PROJECT_ID.iam.gserviceaccount.com"

print_success "Service account key created: gcp-key.json"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 64)

# Create secrets file
cat > github-secrets.txt << EOF
# Add these secrets to your GitHub repository:
# Repository → Settings → Secrets and variables → Actions

GCP_PROJECT_ID=$PROJECT_ID
GCP_SA_KEY=<paste contents of gcp-key.json here>
DB_HOST=/cloudsql/$DB_CONNECTION_NAME
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=$DB_PASSWORD
DB_NAME=taskflow
REDIS_HOST=$REDIS_HOST
REDIS_PORT=6379
JWT_SECRET=$JWT_SECRET
EOF

print_success "GitHub secrets saved to: github-secrets.txt"

echo ""
echo "================================"
print_success "Setup Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Copy contents of gcp-key.json to GitHub secret GCP_SA_KEY"
echo "2. Add all secrets from github-secrets.txt to your GitHub repository"
echo "3. Push your code to GitHub main branch"
echo "4. CI/CD will automatically deploy your application"
echo ""
print_info "Important files created:"
echo "  - gcp-key.json (DO NOT COMMIT THIS)"
echo "  - github-secrets.txt"
echo ""
print_info "Database Details:"
echo "  Connection: $DB_CONNECTION_NAME"
echo "  Password: $DB_PASSWORD"
echo ""
print_info "Redis Details:"
echo "  Host: $REDIS_HOST"
echo "  Port: 6379"
echo ""
echo "🎉 Your GCP infrastructure is ready!"
