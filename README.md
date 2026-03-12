# Candidate Management Module

A full-stack **Candidate Management System** with an Admin Panel and a Candidate Panel.

---

## 🛠 Tech Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Backend     | Node.js + Express.js     |
| Frontend    | ReactJS (Create React App) |
| Database    | PostgreSQL                |
| ORM         | Prisma                   |
| Auth        | JWT                      |
| Email       | Nodemailer               |
| UI          | Material UI (MUI)        |

---

## 📁 Project Structure

```
CANDIDATE MANAGEMENT ASSISMENT/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         ← DB models
│   │   └── seed.js               ← Seed admin + sample data
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js ← JWT guard
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── country.controller.js
│   │   │   ├── qualification.controller.js
│   │   │   ├── designation.controller.js
│   │   │   └── candidate.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── country.routes.js
│   │   │   ├── qualification.routes.js
│   │   │   ├── designation.routes.js
│   │   │   └── candidate.routes.js
│   │   └── services/
│   │       └── email.service.js  ← Nodemailer
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── axios.js           ← Configured Axios instance
    │   ├── context/
    │   │   ├── AdminAuthContext.jsx
    │   │   └── CandidateAuthContext.jsx
    │   ├── components/
    │   │   ├── AdminLayout.jsx    ← Sidebar + AppBar
    │   │   ├── MasterPage.jsx     ← Reusable CRUD component
    │   │   └── ProtectedAdminRoute.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminLogin.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── CountryMaster.jsx
    │   │   │   ├── QualificationMaster.jsx
    │   │   │   ├── DesignationMaster.jsx
    │   │   │   └── CandidateManagement.jsx
    │   │   └── candidate/
    │   │       ├── RegisterStep1.jsx
    │   │       ├── RegisterStep2.jsx
    │   │       ├── ActivationPage.jsx
    │   │       ├── CandidateLogin.jsx
    │   │       └── CandidateDashboard.jsx
    │   ├── App.jsx
    │   ├── index.jsx
    │   └── index.css
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18
- PostgreSQL database running
- Gmail account (for email) or any SMTP service

---

### 1. Clone / Open the project

```bash
cd "CANDIDATE MANAGEMENT ASSISMENT"
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure it
copy .env.example .env
```

Edit `.env` and fill in:
```
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/candidate_db
JWT_SECRET=your_secret_key_here
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

> **Gmail Note**: Use an [App Password](https://support.google.com/accounts/answer/185833) (not your Gmail password) when 2FA is enabled.

```bash
# Run Prisma migrations (creates tables)
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database (admin + sample data)
node prisma/seed.js

# Start dev server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔑 Default Credentials

### Admin
| Email | Password |
|-------|----------|
| admin@example.com | Admin@123 |

---

## 🌐 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/admin/login` | Admin login |
| POST | `/api/auth/candidate/login` | Candidate login |

### Countries (Admin protected for write)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/countries` | Get all |
| GET | `/api/countries/:id` | Get one |
| POST | `/api/countries` | Create |
| PUT | `/api/countries/:id` | Update |
| DELETE | `/api/countries/:id` | Delete |

_(Same pattern for `/api/qualifications` and `/api/designations`)_

### Candidates
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/candidates/register/step1` | Register step 1 |
| POST | `/api/candidates/register/step2` | Register step 2 + send email |
| GET | `/api/candidates/activate/:token` | Activate account |
| GET | `/api/candidates` | Get all (admin) |
| GET | `/api/candidates/:id` | Get one (admin) |
| POST | `/api/candidates` | Create (admin) |
| PUT | `/api/candidates/:id` | Update (admin) |
| DELETE | `/api/candidates/:id` | Delete (admin) |

---

## 🔒 Security Notes

- JWT tokens expire in 7 days (configurable via `JWT_EXPIRES_IN`)
- Passwords hashed with bcrypt (12 salt rounds)
- Email activation tokens are UUID v4 and cleared after use
- Admin and candidate tokens are role-separated (cannot cross-authenticate)
