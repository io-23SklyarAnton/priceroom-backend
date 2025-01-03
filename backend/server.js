const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const signupRoutes = require("./routes/signup");
const dataInputRoutes = require("./routes/data_input");
const historyRoutes = require("./routes/history");

const authenticateToken = require("./middlewares/authMiddleware");
const client = require("./db");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/signup", signupRoutes);

app.get('/users_test', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM users');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);  
      res.status(500).json({ error: 'Не вдалося отримати користувачів' });
    }
});
  
app.get('/history_test', async (req, res) => {
    try {
      const result = await client.query(`
        SELECT history.*, users.username 
        FROM history 
        JOIN users ON history.user_id = users.id
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching history:', error);  // Логування помилки
      res.status(500).json({ error: 'Не вдалося отримати історію користувачів' });
    }
});

  
app.use("/", authenticateToken, dataInputRoutes);
app.use("/history", authenticateToken, historyRoutes);
  
const PORT = 5000;
// app.listen(PORT, () =>
//   console.log(`Server running on http://localhost:${PORT}`),
// );
module.exports = app; 