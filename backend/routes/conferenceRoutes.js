const express = require('express');
const router = express.Router();
const Conference = require('../models/conference_model'); // Cập nhật đường dẫn tới model phù hợp

// Route để lấy tất cả các hội nghị
router.get('/api/conferences', async (req, res) => {
  try {
    const conferences = await Conference.find();
    res.json(conferences);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the conferences.");
    console.error("Error fetching conferences:", error);
  }
});


module.exports = router;
