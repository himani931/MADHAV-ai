const express = require("express");
const router = express.Router();
const Question = require("../models/question");

// Load Gita JSON safely
let gita;
try {
    gita = require("../data/gita.json");
} catch (err) {
    console.error("Error loading gita.json:", err.message);
    gita = null;
}

router.get("/", (req, res) => {
    res.render("saarathi/index", { answer: null });
});

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

        const userText = question.toLowerCase().trim();

        let selectedVerse = null;
        let selectedChapter = null;
        let selectedVerseNumber = null;

        // 🔍 THEME-BASED MATCHING
        for (let chapterKey in gita.chapters) {
            const chapter = gita.chapters[chapterKey];
            const verses = chapter.verses || {};

            for (let verseKey in verses) {
                const verse = verses[verseKey];

                if (verse.theme && Array.isArray(verse.theme)) {
                    const matchFound = verse.theme.some((themeWord) => {
                        const theme = themeWord.toLowerCase();
                        return (
                            userText.includes(theme) ||
                            theme.includes(userText)
                        );
                    });

                    if (matchFound) {
                        selectedVerse = verse;
                        selectedChapter = chapterKey;
                        selectedVerseNumber = verseKey;
                        break;
                    }
                }
            }

            if (selectedVerse) break;
        }

        // 🎲 RANDOM FALLBACK
        if (!selectedVerse) {
            const chapters = Object.keys(gita.chapters);
            const randomChapter =
                chapters[Math.floor(Math.random() * chapters.length)];

            const verses = Object.keys(
                gita.chapters[randomChapter].verses || {}
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

        const answer = `
📖 Chapter ${selectedChapter}, Verse ${selectedVerseNumber}

${shlok}

✨ Meaning:
${meaning}
    `;

        // Save to DB
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