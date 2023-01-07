const express = require("express");
const router = express.Router();
// importing mongoose model
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.get("/", (req, res) => {
  console.log("hello");
  res.status(200).json({ name: "saket" });
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

module.exports = router;
