# TaskFlow - Real-Time Task Management Platform

TaskFlow is a modern, scalable, and real-time task management system designed to streamline team collaboration. Built with a robust **NestJS** backend and a responsive **React (Vite)** frontend, it leverages the power of **Google Cloud Platform** for seamless global deployment.

![TaskFlow Application](https://via.placeholder.com/800x400?text=TaskFlow+Dashboard+Preview)

## 🚀 Features

- **Real-time Updates**: Instant task reflected across all connected clients.
- **Task Management**: Create, update, assign, and delete tasks with ease.
- **User Authentication**: Secure JWT-based authentication.
- **Scalable Architecture**: Microservices-ready structure using Docker and Kubernetes-friendly design.
- **Cloud Native**: Optimized for Google Cloud Run with Cloud SQL (PostgreSQL).

## 🛠 Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: PostgreSQL (Cloud SQL)
- **ORM**: TypeORM
- **Caching**: Redis (Optional)
- **Containerization**: Docker
- **Testing**: Jest

### Frontend
- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Modern CSS / Styled Components

### Infrastructure & DevOps
- **Cloud Provider**: Google Cloud Platform (GCP)
- **Compute**: Cloud Run (Serverless Container)
- **Database**: Cloud SQL (PostgreSQL)
- **CI/CD**: GitHub Actions (Automated build & deploy)
- **Artifacts**: Google Artifact Registry

---

## 🏗️ Local Development

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (Local or Container)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### 2. Run with Docker Compose (Recommended)
This will start both backend, frontend, PostgreSQL, and Redis.
```bash
docker-compose up --build
```
- Frontend: [http://localhost](http://localhost)
- Backend API: [http://localhost:3002](http://localhost:3002)

### 3. Manual Setup

**Backend:**
```bash
cd backend
npm install
# Set environment variables in .env or use defaults
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment

This project is configured for automated deployment to **Google Cloud Run** using **GitHub Actions**.

### GitHub Secrets Required
To enable CI/CD, configure the following secrets in your GitHub repository:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID | `taskflow-app-123456` |
| `GCP_SA_KEY` | JSON Key for Service Account | `{ "type": "service_account", ... }` |
| `CLOUD_SQL_CONNECTION`| Instance connection name | `project:region:instance` |
| `DB_HOST` | Database connection path | `/cloudsql/project:region:instance` |
| `DB_USER` | Database User | `postgres` |
| `DB_PASSWORD` | Database Password | `secure-password` |
| `DB_NAME` | Database Name | `taskflow` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key` |

### Manual Deployment
You can also deploy manually using the provided script (requires `gcloud` CLI):
```bash
./setup-gcp.sh
```

---

## 📂 Project Structure

```
TaskFlow/
├── backend/                # NestJS API application
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Local development setup
└── setup-gcp.sh           # GCP setup utility
```

---

## 📄 License
This project is licensed under the MIT License.
