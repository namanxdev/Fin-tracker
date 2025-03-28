import express from "express"
import connectDb from "./Config/db.js"
import cors from "cors"

import passport from 'passport';
import setupPassport from './Config/passport.js';
import googleAuthRoutes from './Routes/googleauthRoute.js';

import userRoutes from "./routes/userRoutes.js" 
import expenseRoutes from "./Routes/expenseRoutes.js"
import budgetRoutes from "./Routes/budgetRoutes.js"
import incomeRoutes from "./Routes/incomeRoutes.js"
import financialRoutes from "./Routes/financialOverviewRoutes.js"

import {errorHandler} from "./utils/ErrorHandler.js"
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import dotenv from "dotenv"

const app = express();

dotenv.config();

app.use(passport.initialize());
setupPassport();

app.get('/', (req, res) => {
    res.send("Server is running on port 3000");
});

app.use(cors({
    // origin: process.env.FRONTEND_URL,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

connectDb();

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: process.env.NODE_ENV === 'production' ? 100 : 10000, // Limit each IP to 100 requests per windowMs
//     message:"Too many Login attempts ,please try again after 15 minutes"
//   });
//   app.use('/api/', limiter);

// Using Routes

// Add the Google auth routes
app.use('/api/auth', googleAuthRoutes);
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
