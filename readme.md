
# 📚 Book Review Platform

A full-stack web application for browsing books, submitting reviews, and managing user profiles.

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: JWT (JSON Web Tokens)

---

## 📁 Project Structure

### Frontend (`/book-review-frontend`)
```

/src
├── /components          → Reusable UI (Navbar, BookCard, ReviewForm)
├── /pages               → Pages (Home, BookDetails, Profile, Login, Register)
├── /context             → AuthContext for global auth state
├── /api                 → Axios setup and API functions
├── /utils               → Constants and helpers
├── App.jsx              → Main router config
├── main.jsx             → Vite entry point
└── index.css            → Tailwind CSS

```

### Backend (`/book-review-backend`)
```

/server
├── /controllers         → Logic for books, users, reviews
├── /models              → Mongoose schemas (Book, User, Review)
├── /routes              → API routes
├── /middleware          → Auth & error handlers
├── config/db.js         → MongoDB connection
├── server.js            → App entry point
└── .env                 → Environment variables

````

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/book-review-platform.git
cd book-review-platform
````

---

### 2️⃣ Setup Backend

```bash
cd book-review-backend
npm install
```

#### 🛠️ Configure `.env`:

Create a `.env` file in `/book-review-backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

#### ▶️ Run Backend:

```bash
npm run dev
```

The backend should start at: [http://localhost:5000](http://localhost:5000)

---

### 3️⃣ Setup Frontend

```bash
cd ../book-review-frontend
npm install
```

#### ▶️ Run Frontend:

```bash
npm run dev
```

The frontend should start at: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Features

* 🔐 User authentication (JWT)
* 🧑 Profile page with posted and reviewed books
* 📚 Browse and search books
* ✍️ Write and read reviews with ratings
* 📄 Pagination, loading states, and error handling

---

## 📦 API Endpoints

### 🔹 Books

* `GET /api/books` – Get all books
* `GET /api/books/:id` – Get book by ID
* `POST /api/books` – Add new book (auth required)

### 🔹 Reviews

* `POST /api/reviews` – Add a review
* `GET /api/reviews/:bookId` – Get reviews for a book

### 🔹 Users

* `POST /api/users/register` – Register
* `POST /api/users/login` – Login
* `GET /api/users/me` – Get profile

---




