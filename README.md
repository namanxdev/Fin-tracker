# 💰 FinTrack - Personal Finance Tracker 🚀

## 📌 Overview
FinTrack is a personal finance tracking application that helps users manage their **budgets**, **expenses**, and **incomes** efficiently. It provides insights into financial health with **charts 📊 and analytics 📈**. The application features a **responsive frontend** built with **React** and **Tailwind CSS**, and a **robust backend** powered by **Express.js** and **MongoDB**.

## ✨ Features
### 🖥️ Frontend:
- ✅ **🔑 Authentication System** (Login/Register)
- ✅ **📊 Dashboard**: Overview of financial data
- ✅ **💸 Expense Tracking**: Add, edit, and delete expenses
- ✅ **💰 Income Management**: Log and categorize income
- ✅ **🎯 Budgeting**: Set and track budgets
- ✅ **🌙 Dark Mode Support**
- ✅ **📉 Interactive Charts** with Recharts
- ✅ **⚡ Real-time State Management** with Zustand
- ✅ **📝 Form Validation** using React Hook Form & Zod
- ✅ **🔔 Notifications** using React Hot Toast

### ⚙️ Backend:
- 🔐 **User Authentication** (Google OAuth, JWT-based auth)
- 🗄️ **Database Integration**: MongoDB with Mongoose ORM
- 🔒 **Security Features**: Helmet, MongoDB sanitization, Rate Limiting
- ⚠️ **Error Handling**: Custom error handler for clean API responses
- 📦 **Compression**: Optimized response size using compression
- 🌍 **CORS Support**: Configured for secure API access

---

## 🛠 Tech Stack
### 🖥️ Frontend:
- ⚛️ **React 19**
- 🎨 **Tailwind CSS 4 & DaisyUI**
- 🔄 **Zustand** for state management
- ✅ **React Hook Form & Zod** for validation
- 📊 **Recharts** for financial data visualization
- 🎭 **Framer Motion** for smooth animations

### 🖧 Backend:
- 🚀 **Express.js**
- 🗄️ **MongoDB & Mongoose**
- 🔐 **Passport.js** for Google OAuth
- 🔑 **JSON Web Tokens (JWT)** for authentication
- 🛡️ **Helmet & Rate Limiting** for security

---

## ⚙️ Installation & Setup
### 📌 Prerequisites:
Ensure you have **Node.js** and **MongoDB** installed.

### 🛠 Clone the repository:
```sh
 git clone https://github.com/yourusername/FinTrack.git
 cd FinTrack
```

### 🔧 Backend Setup:
```sh
 cd backend
 npm install
```
Create a `.env` file in the backend directory and configure the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```
Run the backend server:
```sh
 npm run dev
```

### 🎨 Frontend Setup:
```sh
 cd frontend
 npm install
 npm run dev
```

---

## 🚀 Deployment
### ☁️ Backend:
1. Deploy to **Render/Vercel/Heroku** with proper environment variables set.
2. Ensure MongoDB is hosted on **MongoDB Atlas**.

### 🌎 Frontend:
1. Deploy to **Vercel/Netlify/Render**.
2. Update backend URL in `.env` or `config.js` file.

---

## 🔮 Future Enhancements
- 💳 **Payment Integration** (Stripe, Razorpay)
- 👥 **Expense Sharing** (Split expenses among users)
- 🤖 **AI-powered Financial Insights**
- 📱 **Mobile App** (React Native)

---

## 🤝 Contributing
Feel free to **fork** this repo, **open issues**, and **submit PRs**.

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 📩 Contact
For queries, reach out at **namanguptabhopal@gmail.com** or [LinkedIn](https://www.linkedin.com/in/naman411/).

