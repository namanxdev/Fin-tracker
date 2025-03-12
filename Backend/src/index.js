import express from "express"
import connectDb from "./Config/db.js"

import userRoutes from "./routes/userRoutes.js" 
import expenseRoutes from "./routes/expenseRoutes.js"
import budgetRoutes from "./routes/budgetRoutes.js"

import dotenv from "dotenv"

const app = express();

dotenv.config();

app.get('/', (req, res) => {
    res.send("Server is running on port 3000");
});

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Using Routes

app.use('/api/User',userRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/budgets',budgetRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
