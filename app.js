const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// ✅ FIRST create app
const app = express();

// ✅ THEN connect DB
mongoose.connect("mongodb://127.0.0.1:27017/madhav-ai")
    .then(() => console.log("Mongo Connected"))
    .catch(err => console.log(err));

// ✅ View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// ✅ Session must come BEFORE passport.session()
app.use(session({
    secret: "madhavai",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// ✅ Passport setup AFTER session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Global variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ✅ NOW require routes (after app exists)
const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");
const dinacharyaRoutes = require("./routes/dinacharya");
const yogaRoutes = require("./routes/yoga");
const saarathiRoutes = require("./routes/saarathi");

// ✅ Use routes
app.use("/", userRoutes);
app.use("/", indexRoutes);
app.use("/dinacharya", dinacharyaRoutes);
app.use("/yoga", yogaRoutes);
app.use("/saarathi", saarathiRoutes);

// ✅ Start server
app.listen(3000, () => {
    console.log("Server Started on 3000");
});