# 🌿 SoulHeal — Student Mental Health Platform

A full-stack MERN application providing a safe, confidential digital platform for student mental wellness.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router v6, Recharts, React Hot Toast |
| Backend | Node.js, Express.js (MVC Architecture) |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcrypt |
| Styling | Vanilla CSS (Glassmorphism Design System) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (running locally on port 27017)

### 1. Setup Backend

```bash
cd backend
npm install
npm run seed        # Creates demo accounts + resources
npm run dev         # Starts on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm start           # Starts on http://localhost:3000
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 🎓 Student | student@demo.com | demo123 |
| 🧑‍⚕️ Counselor | counselor@demo.com | demo123 |
| ⚙️ Admin | admin@demo.com | demo123 |

---

## 📁 Project Structure

```
soulheal/
├── backend/
│   ├── src/
│   │   ├── config/        # MongoDB connection
│   │   ├── controllers/   # Auth, Mood, Assessment, Appointment, Resource, Admin
│   │   ├── middleware/    # JWT auth, role authorization, error handler
│   │   ├── models/        # User, Mood, Assessment, Appointment, Resource
│   │   ├── routes/        # All API routes
│   │   └── server.js      # Express app entry
│   ├── seed.js            # Demo data seeder
│   └── .env               # Environment variables
│
└── frontend/
    └── src/
        ├── api/           # Axios API client
        ├── context/       # Auth context + provider
        ├── components/    # Layout (sidebar)
        ├── pages/
        │   ├── Landing.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── student/   # Dashboard, MoodTracker, Assessment, Appointments, Resources, Profile
        │   ├── counselor/ # Dashboard, Appointments, StudentDetail
        │   └── admin/     # Dashboard, Users, Resources
        └── index.css      # Global design system
```

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |
| PUT | /api/auth/update-profile | Private |
| PUT | /api/auth/change-password | Private |

### Mood Tracking
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/moods | Student |
| GET | /api/moods | Student |
| GET | /api/moods/analytics | Student |
| GET | /api/moods/student/:id | Counselor/Admin |
| PUT | /api/moods/:id | Student |
| DELETE | /api/moods/:id | Student |

### Assessments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/assessments | Student |
| GET | /api/assessments | Student |
| GET | /api/assessments/student/:id | Counselor/Admin |
| DELETE | /api/assessments/:id | Student |

### Appointments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/appointments | Student |
| GET | /api/appointments/my | Student |
| GET | /api/appointments/counselor | Counselor |
| GET | /api/appointments | Admin |
| PUT | /api/appointments/:id | Counselor/Admin |
| DELETE | /api/appointments/:id | Student |

### Resources
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/resources | All |
| GET | /api/resources/:id | All |
| POST | /api/resources | Admin |
| PUT | /api/resources/:id | Admin |
| DELETE | /api/resources/:id | Admin |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/admin/counselors | All |
| GET | /api/admin/users | Admin |
| PUT | /api/admin/users/:id/toggle-status | Admin |
| DELETE | /api/admin/users/:id | Admin |
| GET | /api/admin/analytics | Admin |

---

## ✨ Key Features

- **Role-Based Access Control** — Student, Counselor, Admin
- **JWT Authentication** — Secure login with 7-day token expiry
- **Mood Tracking** — Daily mood logging with emoji selector, tags, notes, analytics
- **Self-Assessments** — 6 test types with auto-scoring and personalized recommendations
- **Appointment Booking** — Time slot picker, status management, meeting links
- **Wellness Resources** — Category-filtered library with view tracking
- **Admin Panel** — User management, platform analytics, resource CRUD
- **Glassmorphism UI** — Dark mode, animated backgrounds, responsive design

---

## 🗄️ Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/soulheal
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```
