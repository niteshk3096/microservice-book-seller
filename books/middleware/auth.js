const jwt = require("jsonwebtoken");
const User = require("../db/schemas/user");
require("dotenv").config({ path: "../.env" });
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Not Authorized");
  }
};

module.exports = auth;
