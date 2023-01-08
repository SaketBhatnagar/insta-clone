const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    //! 401 Unauthorized response status code indicates that the client request has not been completed because it lacks valid authentication credentials for the requested resource.
    return res.status(401).json({ error: "you must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  // it will remove 'Bearer ' from authorization body , and we left with only jwt token
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    // in payload , we will get the user id , with which we have generated token
    if (err) {
      return res.status(401).json({ error: "you must be logged in." });
    }
    const { _id } = payload;
    User.findById(_id).then(userdata => {
      req.user = userdata;
    });
    next();
  });
};
