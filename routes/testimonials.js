const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");

const handleError = (res, error, status = 500) => {
  console.error(error);
  res.status(status).json({ error: error.message });
};

router.get("/", async (req, res) => {
  try {
    res.json(await Testimonial.find());
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const doc = new Testimonial(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    handleError(res, error, 400);
  }
});

module.exports = router;
