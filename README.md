# Enterprise Leave Management System (ELMS)

A full-stack web application for managing employee leaves in an enterprise environment.

## Architecture
Angular 8 SPA (Frontend) ←→ Spring Boot 3.x REST API (Backend) ←→ MySQL 8 Database
**3-Tier Architecture:**
- **Presentation Layer**: Angular 8 SPA — routing, forms, HTTP calls, JWT interceptor
- **Business/API Layer**: Spring Boot REST API — controllers, services, JWT security
- **Data Layer**: MySQL 8 with JPA entities and Spring Data repositories

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Angular | 8.x |
| Frontend | Angular Material | 8.x |
| Backend | Spring Boot | 3.2.5 |
| Backend | Spring Security | 6.x |
| ORM | Spring Data JPA | 3.x |
| Database | MySQL | 8.0.46 |
| Auth | JWT (JJWT) | 0.11.5 |
| Build | Maven | 3.9.x |
| Runtime | Java | 17 (LTS) |

## Features

### Employee
- Register and login with JWT authentication
- View leave balances by type for current year
- Apply for leave with auto-calculated total days
- View own leave application history
- Cancel pending leave applications

### Manager
- Login and view team analytics (Pending/Approved/Rejected counts)
- View all team leave applications with pagination
- Filter team leaves by status
- Approve or reject leave applications with remarks
- View leave balances for any team member

## Project Structure
fullstack/
├── backend/elms-backend/          ← Spring Boot Maven project
│   └── src/main/java/com/elms/elms/
│       ├── config/                ← Security, CORS, JWT config
│       ├── controller/            ← REST controllers
│       ├── dto/                   ← Request/Response DTOs
│       ├── entity/                ← JPA entities
│       ├── exception/             ← Global exception handling
│       ├── repository/            ← Spring Data JPA repositories
│       ├── security/              ← JWT filter, UserDetailsService
│       ├── service/               ← Business logic
│       └── util/                  ← ApiResponse wrapper
├── frontend/elms-frontend/        ← Angular 8 project
│   └── src/app/
│       ├── guards/                ← AuthGuard, ManagerGuard
│       ├── interceptors/          ← JWT interceptor, Error interceptor
│       ├── models/                ← TypeScript interfaces
│       ├── modules/
│       │   ├── auth/              ← Login, Register components
│       │   ├── dashboard/         ← Employee dashboard
│       │   ├── leave/             ← Leave list, Apply leave
│       │   └── manager/           ← Manager dashboard, Team leaves
│       ├── services/              ← Auth, Leave, Manager services
│       └── shared/                ← Navbar component
├── database/
│   ├── schema.sql                 ← DDL scripts
│   └── seed.sql                   ← Seed data
└── docs/
├── ERD.png                    ← Entity Relationship Diagram
└── elms-api.postman_collection.json
## Database Schema

Five tables with proper FK constraints and indexes:
- **users** — id, name, email, password_hash, role, department_id, created_at
- **departments** — id, name, manager_id
- **leave_types** — id, name, max_days_per_year, description
- **leave_applications** — id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status, applied_at, reviewed_by, reviewed_at, remarks
- **leave_balances** — id, user_id, leave_type_id, year, total_days, used_days, remaining_days

## Setup Instructions

### Prerequisites
- Java 17
- Maven 3.8+
- MySQL 8.x
- Node.js 14.x
- Angular CLI 8.x

### Database Setup
```sql
CREATE DATABASE elms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then run `database/schema.sql` and `database/seed.sql` in MySQL.

### Backend Setup
```bash
cd backend/elms-backend
# Update src/main/resources/application.properties with your MySQL password
mvn spring-boot:run
# Backend starts on http://localhost:8080
```

### Frontend Setup
```bash
cd frontend/elms-frontend
npm install
ng serve
# Frontend starts on http://localhost:4200
```

## API Summary

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | Public | Login and get JWT token |
| POST | /api/auth/register | Public | Register new user |
| GET | /api/users/me | All | Get current user profile |
| GET | /api/leave-applications/my | Employee | Get own applications |
| POST | /api/leave-applications | Employee | Apply for leave |
| DELETE | /api/leave-applications/{id} | Employee | Cancel pending leave |
| GET | /api/leave-applications | Manager | Get all applications |
| PUT | /api/leave-applications/{id}/review | Manager | Approve or reject leave |
| GET | /api/leave-balances/my | Employee | Get own leave balances |
| GET | /api/manager/team-leaves | Manager | Get team leave applications |
| GET | /api/manager/analytics | Manager | Get leave analytics |
| GET | /api/departments | Public | Get all departments |
| GET | /api/leave-types | Public | Get all leave types |

## Test Credentials (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Manager | rajesh.kumar@elms.com | password123 |
| Employee | amit.sharma@elms.com | password123 |
| Employee | priya.nair@elms.com | password123 |
| Employee | sneha.patil@elms.com | password123 |
| Employee | vikram.desai@elms.com | password123 |
| Employee | neha.joshi@elms.com | password123 |

## Testing

### API Testing
Import `docs/elms-api.postman_collection.json` into Postman.
Run **Login - Manager** first to auto-save the JWT token, then run other requests.

### Unit Tests
```bash
cd frontend/elms-frontend
ng test --code-coverage --watch=false
```
Covers: AuthService, LeaveService, LoginComponent

## Database
MySQL 8.x is used. Update `application.properties` with your credentials before running.

## Author
Parvani