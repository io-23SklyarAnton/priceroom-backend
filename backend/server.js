const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const signupRoutes = require("./routes/signup");
const dataInputRoutes = require("./routes/data_input");
const historyRoutes = require("./routes/history");

const authenticateToken = require("./middlewares/authMiddleware");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/signup", signupRoutes);
app.use("/", authenticateToken, dataInputRoutes);
app.use("/history", authenticateToken, historyRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
