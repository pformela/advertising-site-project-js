require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const path = require("path");

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/auth", require("./routes/authRoutes"));
app.use("/ad", require("./routes/adRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/chat", require("./routes/chatRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

const server = app.listen(4000, () => {
  console.log("Listening on port %s...", server.address().port);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms = {};
const users = {};

io.on("connection", (socket) => {
  const socketId = socket.handshake.auth.userId;
  socket.join(socketId);

  users[socketId] = socket;

  socket.on("sendMessage", (data) => {
    const { ad, roomId, username, senderId, receiverId, message, createdAt } =
      data;
    if (!(roomId in rooms)) {
      rooms[roomId] = {};
      if (users[senderId]) users[senderId].join(roomId);
      if (users[receiverId]) users[receiverId].join(roomId);

      if (users[receiverId])
        users[receiverId].emit("getMessage", {
          ad,
          roomId,
          username,
          senderId,
          receiverId,
          message,
          createdAt,
          type: "receiver",
        });
    } else {
      if (users[receiverId])
        users[receiverId].emit("getMessage", {
          ad,
          roomId,
          username,
          senderId,
          receiverId,
          message,
          createdAt,
          type: "receiver",
        });
    }
  });
});
