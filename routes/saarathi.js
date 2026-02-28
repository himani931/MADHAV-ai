const express = require("express");
const router = express.Router();
const Question = require("../models/question");

router.get("/", (req, res) => {
    res.render("saarathi/index");
});

router.post("/", async (req, res) => {
    const { question } = req.body;

    const answer = "According to Dharma, act with righteousness and detachment.";

    const newQ = new Question({ question, answer });
    await newQ.save();

    res.render("saarathi/index", { answer });
});

module.exports = router;