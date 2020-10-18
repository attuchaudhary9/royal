//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/UserDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const secret = process.env.SECRET;

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const userId = req.body.username;
  const userPassword = req.body.password;
  User.findOne({ email: userId }, function (err, foundResult) {
    if (err) {
      console.log(err);
    } else {
      if (foundResult) {
        if (foundResult.password === userPassword) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server is started at port 3000");
});
