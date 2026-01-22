# HRMS Lite - Frontend

## 🎨 Overview
The **HRMS Lite Frontend** is a modern, responsive user interface built with **React 19** and **Vite**. It provides a seamless experience for users to interact with the HRMS system, featuring a sleek design powered by **Tailwind CSS**.

## 💻 Tech Stack
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Router:** [React Router setup (v7)](https://reactrouter.com/)

## 📋 Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

## ▶️ Running the Application

### Development Server
Start the development server with hot module replacement (HMR):
```bash
npm run dev
```
The app will be accessible at `http://localhost:5173`.

### Production Build
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

## 📐 Project Structure
```
frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Application pages/views
│   ├── App.jsx       # Main application component
│   └── main.jsx      # Entry point
├── public/           # Static assets
└── ...config files   # Vite, Tailwind, ESLint configs
```
