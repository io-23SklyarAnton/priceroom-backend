const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const client = require("../db");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const {
    district,
    floor,
    floors_count,
    rooms_count,
    total_square_meters,
    predict_price,
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO history (user_id, district, floor, floors_count, rooms_count, total_square_meters, predict_price) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        req.user.userId,
        district,
        floor,
        floors_count,
        rooms_count,
        total_square_meters,
        predict_price,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving history:", error);
    res.status(500).json({ message: "Помилка зберігання даних" });
  }
});

module.exports = router;
