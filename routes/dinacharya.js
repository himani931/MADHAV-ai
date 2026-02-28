const express = require("express");
const router = express.Router();
const Routine = require("../models/routine");

router.get("/", (req, res) => {
    res.render("dinacharya/index");
});

router.post("/", async (req, res) => {
    const { dosha } = req.body;

    let schedule;

    if (dosha === "Vata") {
        schedule = "Wake early, light exercise, creative work.";
    } else if (dosha === "Pitta") {
        schedule = "Focus work in morning, cooling foods.";
    } else {
        schedule = "Morning movement, avoid oversleeping.";
    }

    const routine = new Routine({ dosha, schedule });
    await routine.save();

    req.flash("success", "Routine Generated!");
    res.redirect("/dinacharya");
});

module.exports = router;