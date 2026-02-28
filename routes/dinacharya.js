const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("dinacharya/index", { schedule: null });
});

router.post("/", (req, res) => {
    const { dosha } = req.body;

    const plans = {
        vata: [
            { time: "5:30 AM", activity: "Wake up gently & gratitude practice" },
            { time: "6:00 AM", activity: "Warm oil massage (Abhyanga)" },
            { time: "6:30 AM", activity: "Gentle yoga & pranayama" },
            { time: "7:30 AM", activity: "Warm breakfast (oats, nuts, herbal tea)" },
            { time: "10:30 AM", activity: "Light snack (fruit or soaked almonds)" },
            { time: "12:30 PM", activity: "Main warm lunch (khichdi, soups, ghee)" },
            { time: "4:00 PM", activity: "Herbal tea break & short walk" },
            { time: "7:00 PM", activity: "Light warm dinner" },
            { time: "9:00 PM", activity: "Relaxation, journaling & early sleep" },
        ],

        pitta: [
            {
                time: "5:00 AM",
                activity: "Wake up & cooling breathing (Sheetali pranayama)",
            },
            { time: "5:30 AM", activity: "Meditation & gratitude" },
            { time: "6:00 AM", activity: "Moderate yoga or walk" },
            {
                time: "7:30 AM",
                activity: "Light breakfast (sweet fruits, coconut water)",
            },
            { time: "11:30 AM", activity: "Short mindfulness break" },
            {
                time: "12:30 PM",
                activity: "Largest meal of the day (balanced & cooling foods)",
            },
            { time: "4:00 PM", activity: "Fresh juice or herbal tea" },
            { time: "7:30 PM", activity: "Light dinner (avoid spicy foods)" },
            { time: "10:00 PM", activity: "Cooling bedtime routine & sleep" },
        ],

        kapha: [
            { time: "4:45 AM", activity: "Wake up early (before sunrise)" },
            { time: "5:00 AM", activity: "Intense workout or Surya Namaskar" },
            { time: "6:00 AM", activity: "Dry brushing & warm shower" },
            { time: "7:00 AM", activity: "Light breakfast (avoid heavy foods)" },
            { time: "11:00 AM", activity: "Productive work period" },
            {
                time: "1:00 PM",
                activity: "Light lunch (spicy & warm foods preferred)",
            },
            { time: "4:30 PM", activity: "Green tea & brisk walk" },
            { time: "7:00 PM", activity: "Very light dinner or soup" },
            { time: "9:30 PM", activity: "Sleep (avoid daytime naps)" },
        ],

        balanced: [
            { time: "5:30 AM", activity: "Wake up & gratitude" },
            { time: "6:00 AM", activity: "Yoga + Meditation" },
            { time: "7:00 AM", activity: "Healthy balanced breakfast" },
            { time: "10:30 AM", activity: "Fruit or nuts snack" },
            { time: "12:30 PM", activity: "Balanced main meal" },
            { time: "4:00 PM", activity: "Tea break & short walk" },
            { time: "6:30 PM", activity: "Light physical activity or hobby time" },
            { time: "8:00 PM", activity: "Light dinner" },
            { time: "10:00 PM", activity: "Digital detox & sleep" },
        ],
    };

    res.render("dinacharya/index", {
        schedule: plans[dosha],
    });
});

module.exports = router;