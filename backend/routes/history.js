const express = require("express");
const router = express.Router();
const client = require("../db");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const query =
      "SELECT * FROM history WHERE user_id = $1 ORDER BY datetime DESC";
    const values = [userId];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for this user" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
