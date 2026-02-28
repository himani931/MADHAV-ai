const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("dinacharya/index", { schedule: null });
});

router.post("/", (req, res) => {
  const { dosha } = req.body;

  // ✅ Proper object created
  const plans = {

    // 🌬 VATA
    vata: [
      { time: "4:30", activity: "Wake up (Brahma Muhurta)" },
      { time: "5:00 AM", activity: "Meditation, pranayama & light yoga" },
      { time: "2:00 PM - 6:00 PM", activity: "Creative work, brainstorming & studying" },
      { time: "4:00 PM", activity: "Light snack & herbal tea" },
      { time: "5:30 PM", activity: "Evening walk or stretching" }
    ],

    // 🔥 PITTA
    pitta: [
      { time: "10:00 AM - 2:00 PM", activity: "High productivity & important tasks" },
      { time: "12:30 PM", activity: "Main meal of the day" },
      { time: "1:30 PM", activity: "Short mindful break" },
      { time: "9:30 PM", activity: "Sleep preparation routine" }
    ],

    // 🌊 KAPHA
    kapha: [
      { time: "6:00 AM - 10:00 AM", activity: "Exercise & active start" },
      { time: "7:00 AM", activity: "Light breakfast" },
      { time: "7:30 PM", activity: "Light dinner" },
      { time: "9:30 PM", activity: "Sleep before 10 PM" }
    ],

    // ⚖ BALANCED
    balanced: [
      { time: "4:30 AM", activity: "Wake up & meditation" },
      { time: "6:30 AM", activity: "Exercise" },
      { time: "12:30 PM", activity: "Main meal" },
      { time: "4:00 PM", activity: "Creative/light work" },
      { time: "7:30 PM", activity: "Light dinner" },
      { time: "9:30 PM", activity: "Digital detox & sleep" }
    ]

  };

  res.render("dinacharya/index", {
    schedule: plans[dosha] || null
  });
});

module.exports = router;