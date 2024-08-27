require("dotenv").config();
const express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");

var flash = require("express-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");

const app = express();

const database = require("./config/database.js");
const systemConfig = require("./config/system.js");
database.connect();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(methodOverride("_method"));

app.use(cookieParser("admin"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.use(express.static(`${__dirname}/public`));

const port = process.env.PORT || 8888;

const clientRouter = require("./routes/client/index.route.js");
app.use("/", clientRouter);
const adminRouter = require("./routes/admin/index.route.js");
app.use("/", adminRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
