require("dotenv").config();
const express = require("express");
const app = express();

const database = require("./config/database.js");
database.connect();
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

const port = process.env.PORT || 8888;
const clientRouter = require("./routes/client/index.route.js");
app.use("/", clientRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
