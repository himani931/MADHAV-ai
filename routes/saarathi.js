const express = require("express");
const router = express.Router();
const Question = require("../models/question");

// 🔹 Load Gita JSON safely
let gita;
try {
    gita = require("../data/gita.json");
    console.log("✅ Gita loaded successfully");
} catch (err) {
    console.error("❌ Error loading gita.json:", err.message);
    gita = null;
}

// =============================
// GET ROUTE
// =============================
router.get("/", (req, res) => {
    res.render("saarathi/index", { answer: null });
});

// =============================
// POST ROUTE
// =============================
router.post("/", async (req, res) => {
    try {

        if (!gita || !gita.chapters) {
            return res.render("saarathi/index", {
                answer: "Sacred texts not available 🙏",
            });
        }

        const { question } = req.body;

        if (!question || question.trim() === "") {
            return res.render("saarathi/index", {
                answer: "Please enter your question 🙏",
            });
        }

        // 🔥 Normalize user input
        const userText = question
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .trim();

        const words = userText.split(/\s+/);

        let bestMatch = null;
        let highestScore = 0;
        let bestChapter = null;
        let bestVerseNumber = null;

        // =============================
        // 🔍 SMART MATCHING SYSTEM
        // =============================
        for (let chapterKey in gita.chapters) {
            const chapter = gita.chapters[chapterKey];
            const verses = chapter.verses || {};

            for (let verseKey in verses) {
                const verse = verses[verseKey];

                if (verse.theme && Array.isArray(verse.theme)) {
                    let score = 0;

                    verse.theme.forEach(themeWord => {
                        const theme = themeWord.toLowerCase();

                        words.forEach(word => {
                            if (
                                theme.includes(word) ||
                                word.includes(theme)
                            ) {
                                score++;
                            }
                        });
                    });

                    // Keep highest scoring verse
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = verse;
                        bestChapter = chapterKey;
                        bestVerseNumber = verseKey;
                    }
                }
            }
        }

        let selectedVerse = bestMatch;
        let selectedChapter = bestChapter;
        let selectedVerseNumber = bestVerseNumber;

        // =============================
        // 🎲 RANDOM FALLBACK
        // =============================
        if (!selectedVerse) {
            const chapters = Object.keys(gita.chapters);
            const randomChapter =
                chapters[Math.floor(Math.random() * chapters.length)];

            const verses = Object.keys(
                gita.chapters[randomChapter].verses
            );

            const randomVerse =
                verses[Math.floor(Math.random() * verses.length)];

            selectedVerse =
                gita.chapters[randomChapter].verses[randomVerse];

            selectedChapter = randomChapter;
            selectedVerseNumber = randomVerse;
        }

        if (!selectedVerse) {
            return res.render("saarathi/index", {
                answer: "No guidance found 🙏",
            });
        }

        const shlok = selectedVerse.text || "Verse unavailable";
        const meaning = selectedVerse.meaning || "Meaning unavailable";
        const chapterName =
            gita.chapters[selectedChapter].name || "Unknown Chapter";

        const answer = `
📖 Chapter ${selectedChapter} – ${chapterName}
Verse ${selectedVerseNumber}

${shlok}

✨ Meaning:
${meaning}
        `;

        // =============================
        // 💾 SAVE TO DATABASE
        // =============================
        const newQ = new Question({ question, answer });
        await newQ.save();

        res.render("saarathi/index", { answer });

    } catch (error) {
        console.error("SAARATHI ERROR:", error);
        res.render("saarathi/index", {
            answer: "Guidance not available at the moment 🙏",
        });
    }
});

module.exports = router;