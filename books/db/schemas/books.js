const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Price should be greater than 0");
        }
      },
    },
    category: {
      type: String,
      required: true,
    },
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);
bookSchema.methods.toJSON = function () {
  const book = this;
  const bookObject = book.toObject();
  bookObject.id = bookObject._id;
  delete bookObject._id;
  delete bookObject.__v;
  delete bookObject.createdAt;
  delete bookObject.updatedAt;
  return bookObject;
};
const Book = mongoose.model("Books", bookSchema);
module.exports = Book;
