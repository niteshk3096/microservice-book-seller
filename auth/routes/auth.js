const express = require("express");
const router = new express.Router();
const bycrypt = require("bcryptjs");
const User = require("../db/schemas/users");

router.get("/", (req, res) => {
  res.send("working");
});

router.post("/register", async (req, res) => {
  const userData = req.body;
  userData.type = "user";
  const user = new User(userData);
  try {
    const check = await User.findOne({ email: userData.email });
    if (check) throw new Error("User already exist");
    await user.save();
    const token = await user.getUserToken();
    res.send({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    res.status(500);
    res.send({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Authentication failed");

    const isMatched = await bycrypt.compare(password, user.password);
    if (!isMatched) throw new Error("Authentication failed");

    const token = await user.getUserToken();
    res.send({
      success: true,
      message: "Login successfully",
      token,
    });
  } catch (err) {
    res.status(500);
    res.send({ success: false, message: err.message });
  }
});

// router.post("/user/logout", async (req, res) => {
//   const { token } = req.body;
//   try {
//     const user = await User.findOne();
//   } catch (err) {
//     res.status(500);
//     res.send({ success: false, message: err.message });
//   }
// });

module.exports = router;
