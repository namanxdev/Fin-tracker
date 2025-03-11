import express from "express" // Use CommonJS require
const app = express();

app.get('/', (req, res) => {
    res.send("Server is running on port 3000");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
