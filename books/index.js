const express = require("express");
const app = express();
require("./db/mongoose");
app.use(express.json());
const books = require("./routes/book");
app.use(books);

app.listen(4000, () => {
  console.log("running auth server on 4000");
});
