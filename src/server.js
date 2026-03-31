require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connect = require("./config/connection.js");
const userRoute = require("./router/user.js");
const adminRoute = require("./router/AdminRoute.js");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js Server!" });
});

// Main Routes
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

// Start Server
connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});

