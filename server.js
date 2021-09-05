var PORT = process.env.PORT || 5000;
const http = require("http");

const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const user = require("./routes/userRoutes");

const cors = require("cors");

const server = http.Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));
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

app.use(bodyParser.json());

app.use("/api/user", user);

mongoose
  .connect(
    "mongodb+srv://test-user:dYhAk4afonQqbkJu@cluster0.1lno6.mongodb.net/QuizDB?retryWrites=true&w=majority"
  )
  .then(() => {
    server.listen(PORT, function () {
      console.log("Server started on port " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
