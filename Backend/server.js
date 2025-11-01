require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5001
const userRoute = require("./routes/userRoutes");

// Middleware
app.use(express.json());
app.use(cors());
app.use("/Signup", userRoute);

app.listen(port, () => {
    console.log("Server running on port ", port);
    
})

