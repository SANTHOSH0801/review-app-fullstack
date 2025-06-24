# 🏙️ PlacePulse

A Full-Stack Rating Web Application built for the FullStack Intern Coding Challenge.  
Users can sign up, log in, and rate stores. Admins can manage users and stores. Store owners can monitor their ratings.  

---

## 🚀 Tech Stack

- **Frontend**: React.js (Deployed on [Vercel](https://vercel.com))
- **Backend**: Express.js (Deployed on [Render](https://render.com))
- **Database**: PostgreSQL (Hosted on Render)

---

## 🌐 Live URLs

- **Frontend**: [  https://reviews-app-backend-023o.onrender.com ](https://reviews-app-project-git-main-santhoshs-projects-e9e8991d.vercel.app)  
- **Backend API**: [ https://reviews-app-backend-023o.onrender.com ](https://reviews-app-backend-023o.onrender.com)  

---

## 👥 User Roles & Functionalities

### 🛡️ System Administrator
- For login as System Administrator use details
   - EMAIL ID: neelasaisanthosh@gmail.com
   - PASSWORD: Sai.2003$
     
- Add new stores and users (normal/admin).
- Dashboard includes:
  - Total Users
  - Total Stores
  - Total Ratings
- View and filter:
  - Stores (Name, Email, Address, Rating)
  - Users (Name, Email, Address, Role)
- View full user profiles, including ratings for store owners.

### 🙋 Normal User
- Register & log in.
- Update password.
- View/search all registered stores.
- View:
  - Store Name, Address, Overall Rating
  - User’s submitted rating
- Submit & modify store ratings (1 to 5).

### 🏪 Store Owner
- Log in & update password.
- Dashboard:
  - View users who rated their store
  - See average store rating

---

## 🧾 Form Validation

- **Name**: Min 20, Max 60 characters  
- **Address**: Max 400 characters  
- **Email**: Valid email format  
- **Password**: 8–16 characters with:
  - At least one uppercase letter  
  - At least one special character  

---

## 🔁 Sorting & Filtering

All major tables and listings support sorting by key fields (Name, Email, Address, etc.) and role-based filtering.

---

## 🗂️ Backend API Routes

### Base URL: `/api/`

| Endpoint             | Purpose                          |
|----------------------|----------------------------------|
| `/auth`              | Login/Register routes            |
| `/users`             | User profile & password updates  |
| `/stores`            | Store listing, search, ratings   |
| `/ratings`           | Submit & update ratings          |
| `/admin`             | Admin-only routes                |
| `/storeOwnerAuth`    | Store Owner login & profile      |

⚙️ Backend Setup

git clone https://github.com/SANTHOSH0801/review-app-fullstack.git
cd backend
npm install
npm start
Ensure .env includes:

.env file

PORT=5000
DATABASE_URL=your_postgresql_connection_url
JWT_SECRET=your_jwt_secret


📌 Notes
Follows best practices for frontend and backend development.
Clean and scalable database schema using Sequelize ORM.
Secure authentication and role-based access management.

🏁 Developed By
Sai Santhosh Neela


