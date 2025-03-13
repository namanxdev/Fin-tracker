import express from "express"
import connectDb from "./Config/db.js"

import userRoutes from "./routes/userRoutes.js" 
import expenseRoutes from "./routes/expenseRoutes.js"
import budgetRoutes from "./routes/budgetRoutes.js"

import ExpressErrorHandler from "./middleware/ErrorHandler.js"
import cookieParser from "cookie-parser";

import dotenv from "dotenv"

const app = express();

dotenv.config();

app.get('/', (req, res) => {
    res.send("Server is running on port 3000");
});

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Using Routes

app.use('/api/User',userRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/budgets',budgetRoutes);

// Error handling middleware (always place it after your routes)
app.use(ExpressErrorHandler.handle);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
