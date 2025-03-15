import express from "express"
import connectDb from "./Config/db.js"
import cors from "cors"

import userRoutes from "./Routes/userRoutes.js" 
import expenseRoutes from "./Routes/expenseRoutes.js"
import budgetRoutes from "./Routes/budgetRoutes.js"
import incomeRoutes from "./Routes/incomeRoutes.js"
import financialRoutes from "./Routes/financialOverviewRoutes.js"

import {errorHandler} from "./utils/ErrorHandler.js"
import cookieParser from "cookie-parser";

import dotenv from "dotenv"

const app = express();

dotenv.config();

app.get('/', (req, res) => {
    res.send("Server is running on port 3000");
});

app.use(cors({
    // origin: process.env.FRONTEND_URL,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Using Routes

app.use('/api/User',userRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/budgets',budgetRoutes);
app.use('/api/incomes',incomeRoutes);
app.use('/api/financial', financialRoutes);

// Error handling middleware (always place it after your routes)
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
