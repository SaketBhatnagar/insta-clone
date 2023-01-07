const express = require("express");
const { MONGOURI } = require("./keys");
const app = express();
require("./models/user");
//! here , we are only registering the mongoose model we have created
// we are not storing in variable , we have not export it
// we didn't export because sometime we can get error , can not use model outside file
// we have keep require("./models/user") before routes
//! but we can use it directly by mongoose.model("User")
const mongoose = require("mongoose");
const router = require("./routes/auth");

app.use(express.json());
app.use(router);

// connecting  mongoDB
mongoose.set("strictQuery", true);
mongoose.connect(MONGOURI);
mongoose.connection.on("connected", () => {
  console.log("connection successfull");
});
mongoose.connection.on("error", () => {
  console.log("connection failed");
});

app.listen(3000, () => {
  console.log("listening.......");
});
