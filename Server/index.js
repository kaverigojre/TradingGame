const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const userModelCtrl = require("./models/userModel");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const updateStocks = require("./controllers/stocks/updateStocks");

const contestRoutes = require("./routes/contestRoutes");
const participantRoutes = require("./routes/participantRoutes");
const signinRoutes = require("./routes/loginRoutes");
const signupRoutes = require("./routes/singupRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const organiserRoutes = require("./routes/organiserRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const stockRoutes = require("./routes/stockRoutes");
const adminRoutes = require("./routes/adminRoutes");

const passport = require("./auth");

const jwt = require("jsonwebtoken");
const generateToken = require("./jwt").generateToken;
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
// Securing HTTP Headers
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(xss());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "secret",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/error", (req, res) => res.send("error logging in"));
app.get("/logout", (req, res) => {
  req.logout();
  res.send("loggedout");
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback/",
  passport.authenticate("google", { failureRedirect: "/error" }),
  async function (req, res) {
    var useritem = await userModelCtrl.userModel.find({
      email: req.user._json.email,
    });

    if (useritem.length <= 0) {
      try {
        var newUser = userModelCtrl.userModel({
          name: req.user._json.name,
          email: req.user._json.email,
          img: req.user._json.picture,
          confirmed: true,
          password: (Math.random() + 1).toString(36).substring(7),
        });
        newUser = await newUser.save();
        var token = generateToken(req.user._json.email, "user" ).token;
        res.redirect(`https://tradebattle.in/Client/auth.html#${token}`);
      } catch (e) {
        console.log(e);
      }
    } else {
      var token = generateToken(req.user._json.email,  "user" ).token;
     
      res.redirect(`https://tradebattle.in/Client/auth.html#${token}`);
    }
  }
);

// TO GET STOCKS PRICE/AND UPDATE 
updateStocks();

app.use("/admin",adminRoutes)
app.use("/login", signinRoutes);
app.use("/register", signupRoutes);
app.use("/contest", contestRoutes);
app.use("/participate", participantRoutes);
app.use("/stocks", stockRoutes);
app.use("/organiser", organiserRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/upload", uploadRoutes);


app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});
