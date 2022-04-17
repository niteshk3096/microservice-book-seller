const express = require("express");
const app = express();
require("./db/mongoose");
app.use(express.json());
const authentication = require("./routes/auth");
app.use(authentication);

app.listen(3000, () => {
  console.log("running auth server on 3000");
});
