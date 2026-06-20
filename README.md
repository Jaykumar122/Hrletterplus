# 📋 HrLetterPlus

> **A Modern HR Workflow Platform** for seamless candidate management, intelligent offer letter generation, and comprehensive workspace controls.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19+-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

HrLetterPlus streamlines the entire HR workflow—from candidate tracking through offer generation to employee onboarding—with an intuitive, modern interface and powerful backend APIs.
## 📸 Screenshots

### Dashboard
![Dashboard Overview](C:\Users\singh\Downloads\dash.png)

### Candidate Management
![Candidate List](C:\Users\singh\Downloads\Screenshot 2026-06-20 215430.png)

### Offer Generation
![Offer Creation](C:\Users\singh\Downloads\Screenshot 2026-06-20 215441.png)
### 🎯 Core Components

- **Frontend**: React 19 + TypeScript + Vite for rapid, type-safe development
- **Backend**: Node.js + Express with PostgreSQL persistence
- **Authentication**: Secure JWT-based access control
- **APIs**: RESTful endpoints for all core HR operations

## ✨ Key Features

### 🔐 Authentication & Security
- Secure user registration and login with bcrypt hashing
- JWT-based authentication for all protected endpoints
- Role-based access control
- Session management and logout

### 📊 Dashboard & Analytics
- Real-time offer status statistics and distribution
- Activity timeline for tracking workflow progress
- Interactive charts for candidate and offer analytics
- Quick insights into recruitment metrics

### 👥 Candidate Management
- Complete CRUD operations for candidate profiles
- Advanced search and filtering capabilities
- Candidate data enrichment (department, designation, source tracking)
- Bulk candidate operations support

### 📄 Intelligent Template System
- Reusable offer letter templates with dynamic placeholders
- Rich HTML support for professional formatting
- Version control for template iterations
- Template soft-delete for audit trails

### 💌 Offer Management
- One-click offer creation from templates
- Complete offer versioning and change history
- Intelligent status workflow (Draft → Sent → Accepted/Rejected)
- PDF generation for professional offer documents
- Offer status tracking and update logs

### ⚙️ User Settings & Preferences
- Personalized profile management (name, title, team)
- Granular notification preferences
- Theme and appearance customization
- Security settings (2FA, session timeout)
- Integration configuration (email, storage)

### 🔍 Unified Search
- Search across candidates, offers, templates, and users
- Real-time results with relevance ranking
- Advanced filtering by multiple criteria
- Full-text search support

### 📚 Help & Documentation
- In-app help center with quick links
- Frequently asked questions
- Workflow tutorials and best practices

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Modern UI framework with hooks and concurrent features |
| **TypeScript 6** | Type-safe development with full IDE support |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling framework |
| **Shadcn/ui** | High-quality, unstyled component library |
| **React Router 7** | Client-side routing and navigation |
| **Recharts** | Composable charting library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 18+** | JavaScript runtime environment |
| **Express 5** | Minimal and flexible web framework |
| **PostgreSQL** | Reliable, powerful relational database |
| **jsonwebtoken** | JWT generation and verification |
| **bcryptjs** | Secure password hashing |
| **CORS** | Cross-origin resource sharing |
| **Dotenv** | Environment variable management |

## 📁 Project Structure

```
HrLetterPlus/
├── backend/                          # Express API server
│   ├── config/
│   │   └── db.js                    # PostgreSQL connection pool
│   ├── controllers/                 # Request handlers
│   │   ├── auth.controller.js
│   │   ├── candidate.controller.js
│   │   ├── offer.controller.js
│   │   ├── template.controller.js
│   │   ├── settings.controller.js
│   │   ├── search.controller.js
│   │   └── help.controller.js
│   ├── routes/                      # API endpoints
│   │   ├── auth.routes.js
│   │   ├── candidate.routes.js
│   │   ├── offer.routes.js
│   │   ├── template.routes.js
│   │   ├── settings.routes.js
│   │   ├── search.routes.js
│   │   └── help.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT verification
│   ├── index.js                     # Express app entry point
│   └── package.json
│
├── frontend/                         # React + Vite application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── site-header.tsx
│   │   │   ├── nav-user.tsx
│   │   │   └── ui/                  # Shadcn component library
│   │   ├── pages/                   # Route pages
│   │   │   ├── auth/
│   │   │   ├── candidates/
│   │   │   ├── dashboard/
│   │   │   ├── offers/
│   │   │   ├── templates/
│   │   │   ├── settings/
│   │   │   ├── search/
│   │   │   └── help/
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utility functions
│   │   ├── App.tsx                  # Main app component
│   │   └── main.tsx                 # Entry point
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│                   
└── .gitignore
```

## 📋 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org))
- **npm 9+** (included with Node.js)
- **PostgreSQL 12+** ([Download](https://www.postgresql.org/download/))
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Verify Installation

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher
psql --version    # Should be 12.0 or higher
```

## 🔑 Environment Configuration

### Backend (`backend/.env`)

```env
# Server Configuration
PORT=5000                           # API server port (default: 5000)
NODE_ENV=development               # Environment mode

# JWT Security
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_recommended

# Database Connection
DB_HOST=localhost                   # PostgreSQL host
DB_PORT=5432                        # PostgreSQL port (default: 5432)
DB_USER=postgres                    # Database user
DB_PASSWORD=your_secure_password    # Database password
DB_NAME=hrletterplus_db             # Database name
```

**Security Tips:**
- Generate a strong JWT secret: `openssl rand -base64 32`
- Never commit `.env` to version control
- Use different secrets for development and production
- Rotate secrets regularly

### Frontend (`frontend/.env`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000  # Backend API base URL
VITE_APP_NAME=HrLetterPlus          # Application name
```

## 🚀 Quick Start Guide

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/hrletterplus.git
cd hrletterplus

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 2: Database Setup

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE hrletterplus_db;"

# Update backend/.env with your database credentials
```

### Step 3: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in new terminal)
cd ../frontend
npm install
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on `http://localhost:5173`

### Step 5: Access Application

Open your browser and navigate to:
```
http://localhost:5173
```

Default test credentials (if seed data exists):
- Email: `admin@hrletterplus.com`
- Password: `password123`

## 🏗 Production Build

### Build Frontend

```bash
cd frontend
npm run build        # Create optimized production bundle
npm run preview      # Preview the production build locally
```

Output will be in `frontend/dist/`

### Deploy Backend

The backend is a standard Node.js/Express application. Deploy to:
- Render, Railway, Heroku, AWS, DigitalOcean, etc.

Example with Render:
```bash
# Push to GitHub
git push origin main

# Connect to Render and deploy
# Set environment variables in Render dashboard
```

## 📡 API Documentation

**Base URL:** `http://localhost:5000`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API health check |
| `GET` | `/health` | Server status |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

### Protected Endpoints (Requires Bearer Token)

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/logout` | Logout current user |

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/stats` | Offer statistics |
| `GET` | `/api/dashboard/activity` | Recent activity feed |
| `GET` | `/api/dashboard/chart` | Chart data (time-series) |

#### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/candidates` | List all candidates |
| `POST` | `/api/candidates` | Create new candidate |
| `GET` | `/api/candidates/:id` | Get candidate details |
| `PUT` | `/api/candidates/:id` | Update candidate |
| `DELETE` | `/api/candidates/:id` | Delete candidate |

#### Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/templates` | List all templates |
| `POST` | `/api/templates` | Create new template |
| `GET` | `/api/templates/:id` | Get template details |
| `PUT` | `/api/templates/:id` | Update template |
| `DELETE` | `/api/templates/:id` | Soft-delete template |

#### Offers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/offers` | List all offers |
| `POST` | `/api/offers` | Create new offer |
| `GET` | `/api/offers/:id` | Get offer details |
| `PUT` | `/api/offers/:id` | Update offer |
| `PATCH` | `/api/offers/:id/status` | Update offer status |
| `GET` | `/api/offers/:id/history` | Get offer version history |

#### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings` | Get user settings |
| `PUT` | `/api/settings` | Update user settings |

#### Search & Help
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search?q=query` | Search all resources |
| `GET` | `/api/help` | Get help center data |

### Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/candidates
```

### Response Format

All API responses follow a consistent JSON format:

**Success (2xx):**
```json
{
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

**Error (4xx, 5xx):**
```json
{
  "message": "Error description",
  "error": "error details"
}
```

## 📌 Important Notes

- ✅ **Auto-migrations**: The backend automatically creates the `user_settings` table on startup
- ✅ **CORS Configuration**: Frontend origin `http://localhost:5173` is whitelisted
- ✅ **JWT Expiry**: Tokens expire after 7 days
- ⚠️ **Database**: Ensure PostgreSQL is running before starting the backend
- ⚠️ **Port Conflicts**: Change `PORT` in `.env` if port 5000 is already in use

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/hrletterplus.git
   cd hrletterplus
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**
   ```bash
   git commit -m "feat: Add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Include a clear description of your changes
   - Reference any related issues
   - Ensure all tests pass

### Development Standards
- Follow existing code style and patterns
- Write meaningful commit messages
- Test your changes locally before submitting
- Keep PRs focused on a single feature/fix

## 📄 License

This project is licensed under the **ISC License**. See [LICENSE](LICENSE) file for details.

## 👥 Support & Contact

For questions, bugs, or feature requests:
- **Issues**: [GitHub Issues](https://github.com/yourusername/hrletterplus/issues)
- **Email**: support@hrletterplus.com
- **Documentation**: [Full Docs](https://docs.hrletterplus.com)

---

**Built with ❤️ by the HrLetterPlus team**
