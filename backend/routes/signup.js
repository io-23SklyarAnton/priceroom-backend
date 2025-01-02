const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const client = require("../db");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const userExistQuery = "SELECT * FROM users WHERE username = $1";
  const userExist = await client.query(userExistQuery, [username]);

  if (userExist.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: "User with this username already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createUserQuery =
    "INSERT INTO users (username, password) VALUES ($1, $2)";
  try {
    await client.query(createUserQuery, [username, hashedPassword]);
    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
