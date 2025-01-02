const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("../db");
require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Неправильні дані для авторизації" });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Неправильні дані для авторизації" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Помилка на сервері" });
  }
});

module.exports = router;
