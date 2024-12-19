require("dotenv").config();
const express = require("express");
const moment = require("moment");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");

var flash = require("express-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");

const app = express();

const database = require("./config/database.js");
const systemConfig = require("./config/system.js");

const http = require("http");
const { Server } = require("socket.io");
// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End SocketIO

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
app.locals.moment = moment;
app.use(express.static(`${__dirname}/public`));
// TinyMCE
var path = require("path");
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
const port = process.env.PORT || 8888;

const clientRouter = require("./routes/client/index.route.js");
app.use("/", clientRouter);
const adminRouter = require("./routes/admin/index.route.js");
app.use("/", adminRouter);
app.get("*", (req, res) => {
  res.render("client/pages/user/otp-password", {
    pageTitle: "404 Not Found",
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
