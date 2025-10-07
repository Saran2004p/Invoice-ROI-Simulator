# Invoicing ROI Simulator

A full-stack web application that helps businesses estimate the **Return on Investment (ROI)** achieved by automating their invoicing process.  
Built with **React (frontend)**, **Node + Express (backend)**, and **MongoDB (database)**.  
Frontend is hosted on **Netlify**, and the backend is hosted on **Render**.

---

## Features

-  ROI calculation based on user input (manual hours, invoices, cost, etc.)  
-  Save and manage multiple simulation scenarios  
-  Dynamic visualization of results  
-  Generate and download a professional ROI report (email required)  
-  Secure backend API with Express and MongoDB  
-  Cloud-hosted frontend and backend  

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Hosting** | Netlify (frontend) & Render (backend) |
| **Styling** | Tailwind CSS |
| **State Management** | React Hooks / Context API |

---

## Installation & Setup (Local)

### Install dependencies

#### Backend
cd backend
npm install


#### Frontend
cd ../frontend
npm install

### Run the application

#### Backend
cd backend
npm run dev

#### Frontend
cd ../frontend
npm run dev

---

## Functionality

### ROI Calculation Formula

ROI (%) = ((Manual Cost - Automated Cost) / Automated Cost) × 100
Manual Cost = (Time per invoice × Number of invoices × Hourly rate)
Automated Cost = (Subscription + Setup + Maintenance)

---

## Folder Structure
```
Complyance/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   ├── public/
│   └── .env
│
└── README.md
```
---

## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/scenarios` | Fetch all saved scenarios |
| POST | `/api/scenarios` | Save a new scenario |
| DELETE | `/api/scenarios/:id` | Delete a scenario |
| POST | `/api/report` | Generate and email/download ROI report |

---
