#  MediSlot – Doctor Appointment Booking System

MediSlot is a full-stack web application that enables users to browse doctors, book appointments, and manage schedules efficiently with secure authentication and role-based access.

##  Live Demo

-  **User App:** https://medislot-frontend-gxaf.onrender.com  
-  **Admin / Doctor Panel:** https://medislot-admin-xmsv.onrender.com  

##  Features
- User Authentication (Login / Signup)
- Browse Doctors by Specialization
- Book & Manage Appointments
- Real-time Slot Availability
- Admin Dashboard
- Razorpay Payment Integration
- Responsive UI

##  Tech Stack
- Frontend: React.js, Tailwind CSS  
- Backend: Node.js, Express.js  
- Database: MongoDB  

##  Setup

```bash
git clone https://github.com/Ajeesh6/MediSlot.git
cd MediSlot
```

### Install dependencies
```bash
cd frontend && npm install
cd ../backend && npm install
```

### Environment Variables

Create `.env` files in the following folders:

###  Backend (`/backend/.env`)
```
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

###  Frontend (`/frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_key
```

###  Admin (`/admin/.env`)
```
VITE_BACKEND_URL=http://localhost:4000
```

###  Run the Application

Open **3 terminals** and run each service:

### 1️⃣ Start Backend
```bash
cd backend
npm run server
```

### 2️⃣ Start Frontend
```bash
cd frontend
npm run dev
```

### 3️⃣ Start Admin Panel
```bash
cd admin
npm run dev
```
