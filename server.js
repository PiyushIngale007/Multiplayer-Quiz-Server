var PORT = process.env.PORT || 5000;
const http = require("http");
const cookieParser = require("cookie-parser");

const express = require("express");
const url = process.env.MONGO_DB_CONNECTION_STRING;
const app = express();
if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in non prod environments
  require("dotenv").config();
}

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const user = require("./routes/userRoutes");
const cors = require("cors");
const passport = require("passport");
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(bodyParser.json());

const server = http.Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// const corsOpts = {
//   origin: "*",
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type"],
// };

// app.use(cors(corsOpts));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(passport.initialize());

let onlineUsers = 0;
io.on("connection", (client) => {
  console.log("User connected " + client.id);
  onlineUsers += 1;
  client.on("join", (data) => {
    console.log(data);
    client.emit("onlineUsers", onlineUsers);
    client.broadcast.emit("onlineUsers", onlineUsers);
  });

  client.on("pythonQuiz", (data) => {
    console.log(data);
  });
  client.on("disconnect", () => {
    console.log("disconnected");
    onlineUsers -= 1;
    client.broadcast.emit("newUserDisonnected", onlineUsers);
  });
});

app.use("/api/user", user);

mongoose
  .connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    server.listen(PORT, function () {
      console.log("Server started on port " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
