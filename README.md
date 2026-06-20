# HrletterPlus

A full-stack recruitment and hiring platform built with **React + Vite**, **TypeScript**, **Tailwind CSS**, **Node.js + Express**, and **PostgreSQL**.

HireItPlus helps recruiters manage candidates, job offers, dashboards, and hiring workflows with a modern UI and scalable backend architecture.

---
screeen shot

---

# 🚀 Tech Stack

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* REST API

---

# 📁 Project Structure

```bash
HrlettertPlus/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── candidates/
│   │   │   ├── dashboard/
│   │   │   ├── Offers/
│   │   │   └── Templates/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

# ✨ Features

* 🔐 Authentication & Authorization
* 📊 Recruiter Dashboard
* 👨‍💼 Candidate Management
* 📄 Offer Letter Templates
* 📬 Offer Generation Workflow
* ⚡ REST API Integration
* 📱 Responsive UI
* 🎨 Modern Tailwind Styling
* 🗄️ PostgreSQL Database Support

---

# 🖼️ Project Screenshot

> Add your screenshots inside the repository and update the paths below.

## VS Code Project Structure

![Project Structure](./screenshots/project-structure.png)

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

## Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

# 🛠️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Jaykumar122/Hrletterplus.git
cd HrletterPlus
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
node index.js
```

Backend runs on:

```bash
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🗄️ Database Setup (PostgreSQL)

1. Install PostgreSQL
2. Create a database
3. Add your connection string in `.env`
4. Run database migrations or SQL setup scripts

Example:

```sql
CREATE DATABASE hireitplus;
```

---

# 📡 API Structure

Example API routes:

```bash
/api/auth
/api/candidates
/api/offers
/api/templates
```

---

# 📦 Build for Production

## Frontend

```bash
npm run build
```

## Backend

```bash
npm start
```

---

# 🧪 Future Improvements

* Email integration
* Resume parsing
* Role-based access control
* Interview scheduling
* Analytics dashboard
* Cloud deployment

---

# ☁️ Deployment Suggestions

### Frontend

* Vercel
* Netlify

### Backend

* Render
* Railway
* AWS EC2

### Database

* PostgreSQL on Neon / Supabase / Railway

---

# 🤝 Contributing


1 Jay kumar
2. HEMANTH MC
3. Hetha
4. Kaashyap


---
# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed with ❤️ using React, Node.js, Express, PostgreSQL, TypeScript, and Tailwind CSS.
