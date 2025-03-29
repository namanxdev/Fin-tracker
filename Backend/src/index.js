import express from "express"
import connectDb from "./Config/db.js"
import cors from "cors"

import passport from 'passport';
import setupPassport from './Config/passport.js';
import googleAuthRoutes from './Routes/googleauthRoute.js';

import userRoutes from "./Routes/userRoutes.js" 
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
import {ExpressError} from "./utils/ErrorHandler.js";
import compression from 'compression';
import path from 'path';

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
} else {
    // Empty config() call ensures dotenv is initialized
    dotenv.config();
}

const PORT = process.env.PORT;
const __dirname = path.resolve();


const app = express();

app.use(passport.initialize());
setupPassport();
app.use(compression())

app.get('/', (req, res) => {
    res.send("Server is running on port " + PORT);
});

app.use(cors({
    // origin: process.env.FRONTEND_URL,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

connectDb();

// Enhanced helmet configuration based on environment
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:","https://res.cloudinary.com"]
      }
    }
  }));


  app.set('trust proxy', 1);
} else {
  app.use(helmet({
    contentSecurityPolicy: false
  }));
}


app.use(mongoSanitize({
  replaceWith: '_'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs
    message:"Too many Login attempts ,please try again after 15 minutes"
  });
  app.use('/api/', limiter);

// Using Routes

// Add the Google auth routes
app.use('/api/auth', googleAuthRoutes);
app.use('/api/User',userRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/budgets',budgetRoutes);
app.use('/api/incomes',incomeRoutes);
app.use('/api/financial', financialRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../Frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../Frontend','dist','index.html'));
    });
}

// Error handling middleware (always place it after your routes)
app.use(errorHandler);

app.all('*',(req,res,next)=>{
    // res.send('404!!!')
    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, Something Went Wrong!!'
    res.status(statusCode).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
