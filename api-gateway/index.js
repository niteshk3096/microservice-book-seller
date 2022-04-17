const gateway = require("fast-gateway");
require("./db/mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
const User = require("./db/schema/users");

const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("No token");
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: verify._id });
    if (!verify || !user) {
      throw new Error("Invalid token");
    } else {
      return next();
    }
  } catch (err) {
    res.statusCode = 401;
    res.send(`Unauthorized: ${err.message}`);
  }
};

const server = gateway({
  routes: [
    {
      prefix: "/auth",
      target: "http://127.0.0.1:3000",
    },
    {
      prefix: "/books",
      middlewares: [verifyToken],
      target: "http://127.0.0.1:4000",
    },
  ],
});

server.start(8080);
