const express = require("express");
const fs = require("fs");
var path = require("path");
const router = new express.Router();
const bycrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Book = require("../db/schemas/books");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("working");
});

router.post("/book-add", upload.single("image"), async (req, res) => {
  const bookData = req.body;
  bookData.price = Number(req.body.price);
  bookData.img = {
    data: path.join(__dirname, ".." + "/" + req.file.path),
    contentType: req.file.mimetype,
  };
  const book = new Book(bookData);
  try {
    const check = await Book.findOne({ name: bookData.name });
    if (check) throw new Error("Book already exist");
    await book.save();
    res.send({
      success: true,
      message: "Book added successfully",
    });
  } catch (err) {
    res.status(500);
    res.send({ success: false, message: err.message });
  }
});

router.get("/books-list", async (req, res) => {
  try {
    const book = await Book.find({});
    if (!book) throw new Error("No books availbale");
    console.log("req user", req.user);
    res.send({
      success: true,
      message: "Books",
      book,
    });
  } catch (err) {
    res.status(500);
    res.send({ success: false, message: err.message });
  }
});

router.put("/book-update/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const allowedUpdate = ["name", "price", "category", "image"];
  const updates = Object.keys(req.body);
  console.log("up", updates);
  const verify = updates.every((update) => allowedUpdate.includes(update));
  if (!verify || updates.length === 0)
    return res.status(400).send("Invalid parameter");
  try {
    const book = await Book.findOne({ _id: id });
    if (!book) throw new Error("Book does not exist");
    updates.forEach((data) => (book[data] = req.body[data]));
    if (req.file) {
      book.img = {
        data: path.join(__dirname, ".." + "/" + req.file.path),
        contentType: req.file.mimetype,
      };
    }
    await book.save();
    res.send({
      success: true,
      message: "Book updated",
      book,
    });
  } catch (err) {
    res.status(500);
    res.send({ success: false, message: err.message });
  }
});

router.delete("/book-delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Book.findOne({ _id: id });
    if (!book) throw new Error("Book does not exist");
    await book.remove();
    res.send({
      success: true,
      message: "Book deleted succesfully",
    });
  } catch (err) {
    res.status(500);
    res.send({ success: false, message: err.message });
  }
});

router.post("/add-to-cart/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    req.user.cart.push(id);
    req.user.save();
    res.send({
      success: true,
      message: "Book added to cart succesfully",
    });
  } catch (err) {
    res.status(500);
    res.send({ success: false, message: err.message });
  }
});

router.get("/user/cart", auth, async (req, res) => {
  try {
    const dd = await req.user.populate("cart");
    res.send(req.user.cart);
  } catch (err) {
    res.status(500);
    res.send({ success: false, message: err.message });
  }
});

module.exports = router;
