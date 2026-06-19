# Ali School of Science and Technology (ASST) Management System

An enterprise-grade, microservices-based School Management System containerized with Docker Compose. The system is designed to provide full administrative control alongside a dedicated student/teacher interface.

---

## Technical Stack & Ports mapping

### API Gateway & Authentication
*   **Gateway Service (ExpressJS)**: Port `5000` (Direct proxy to all microservices, handles JWT security and WS notifications)

### Golang Microservices (Gin Engine)
*   **Academic Service**: Port `8081` (Syllabus, courses, classes, enrollments, exams, and marks)
*   **Scheduling Service**: Port `8082` (Timetables, schedule calendars, student/staff attendance)
*   **Library Service**: Port `8083` (Catalog searches, loan transactions checkouts, fine calculations)
*   **Finance Service**: Port `8084` (Tuition invoicing, student payment logs, teacher payroll processing)
*   **Inventory Service**: Port `8085` (School assets log, classroom allocations, item status audits)
*   **Cafe Service**: Port `8086` (Food menu catalog, order pre-checkout, card wallet balance)

### Python Microservices (FastAPI + SQLAlchemy)
*   **Assignment & Quiz Service**: Port `8001` (Assignments submissions, online quiz attempts, simulated NLP AI auto-grading)
*   **Research & Lab Service**: Port `8002` (Research project registers, paper journals log, lab room allocations)
*   **Parking & Alumni Service**: Port `8003` (Sensor slot allocation, vehicle registration, alumni networking directories, mentorship requests, fundraiser donation tally)

### Databases
*   **PostgreSQL**: Port `5432` (10 separate databases logic isolation)

### ReactJS Clients (Vite server)
*   **Admin Portal**: Port `3000` (Administrative views for syllabus, assets, finance billing, cafeteria)
*   **User Portal**: Port `3001` (Dual dashboard view for Students and Teachers)

---

## Getting Started

### Prerequisites
Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Spin up the Stack
In the root directory of this project, execute:

```bash
docker compose up --build
```

Docker will automatically:
1. Spin up the PostgreSQL database container.
2. Run `init-db.sh` to initialize the 10 separate databases.
3. Compile all 6 Go microservices.
4. Set up python virtual environments and dependencies for the 3 FastAPI services.
5. Install packages and launch the ExpressJS Gateway.
6. Install React assets and run both frontend Vite clients.

### Web Access Links
*   **Admin Portal**: [http://localhost:3000](http://localhost:3000)
*   **Student/Teacher Portal**: [http://localhost:3001](http://localhost:3001)

---

## Log In Credentials (Mock Seeding)

The system automatically initializes tables and seeds mock accounts on first startup. You can log in using:

### 🔑 Admin Portal
*   **Admin Account**: `admin@asst.edu` / Password: `admin123`

### 🔑 Student & Teacher Portal
*   **Teacher Account**: `teacher@asst.edu` / Password: `teacher123`
*   **Student Account**: `student@asst.edu` / Password: `student123`
