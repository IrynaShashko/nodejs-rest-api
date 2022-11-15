// rU_YP5hCjhf_gXH;
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const ws = require("ws");
const wsServer = new ws.Server({ port: 5000 });
const { Server } = require("socket.io");
const { createServer } = require("http");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New frontend connection");
});
httpServer.listen(6000);

const sockets = [];

wsServer.on("connection", (socket) => {
  sockets.push(socket);
  console.log("New frontend connection");
  setTimeout(() => {
    socket.send("Welcome to web-socket server");
  }, 3000);

  sockets.forEach((item) => {
    if (item !== socket) {
      item.send("New member connect");
    }
  });
});

const tempDir = path.join(__dirname, "temp");
const contactsDir = path.join(__dirname, "public", "avatars");

const multerConfig = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 2048,
  },
});

const upload = multer({
  storage: multerConfig,
});

const dotenv = require("dotenv");
// require("dotenv").config();
dotenv.config();

const authRouter = require("./routes/api/auth");
const userRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");

const app = express();

app.post(
  "/api/avatars",
  upload.single("image", async (req, res) => {
    const { path: tempUpload, originalname } = req.file;
    const resultUpload = path.join(contactsDir, originalname);
    await fs.rename(tempUpload, resultUpload);
  })
);

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/contacts", contactsRouter);
app.use(express.static("public"));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});

module.exports = app;
