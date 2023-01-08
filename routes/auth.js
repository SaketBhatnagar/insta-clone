const express = require("express");
const router = express.Router();
// importing mongoose model
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");

router.get("/", (req, res) => {
  console.log("hello");
  res.status(200).json({ name: "saket" });
});

router.get("/protected", requireLogin, (req, res) => {
  console.log("verifed user");
  res.json("you are verified");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
    return res.status(422).json({ error: "please send all data" });
    // return will stop execution here
  }
  // finding data by email
  User.findOne({ email })
    .then(saveduser => {
      bcrypt.hash(password, 12).then(hashedpassword => {
        if (saveduser) {
          return res.json({ error: "user already exist with this email." });
        }
        const user = new User({
          name,
          email,
          password: hashedpassword,
        });

        user
          .save()
          .then(msg => res.json({ message: "sucessfully created" }))
          .catch(err => console.log(err));
      });
    })
    .catch(error => console.log(error));
});

router.post("/signin", (req, res) => {
  let { name, email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: "fill the email and password!" });
  }

  User.findOne({ email }).then(saveduser => {
    console.log("saveduser:  ", saveduser);
    if (!saveduser) {
      return res.json({ error: "Invalid Email or password!" });
    }
    bcrypt.compare(password, saveduser.password).then(doMatch => {
      console.log("compare :  ", doMatch);
      if (doMatch) {
        // res.json({ message: "Signed In Successfully!" });
        const token = jwt.sign({ _id: saveduser._id }, JWT_SECRET);
        res.json({ token });
      } else {
        return res.json({ error: "Invalid Email or password!" });
      }
    });
  });
});

module.exports = router;
