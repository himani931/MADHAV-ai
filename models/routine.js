const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema({
    dosha: String,
    schedule: String
});

module.exports = mongoose.model("Routine", routineSchema);