const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Additional utils
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const candidateRouter = require("./routes/candidateRoutes");
const recruiterRouter = require("./routes/recruiterRoutes");
const companyRouter = require("./routes/companyRoutes");
const jobRouter = require("./routes/jobDetailRoutes");
// const ChatRoute = require("./routes/chatRoutes");
// const MessageRoute = require("./routes/messageRoutes");

// 1) INIT FUNCTIONS
const app = express();

app.enable("trust proxy");

const server = http.createServer(app);
const io = socketIO(server);

// Swagger Doc
app.use("/", swaggerUI.serve);
app.get("/", swaggerUI.setup(swaggerDocument));

// 2) BADY PARSERS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(compression());

// 3) ROUTES
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/recruiters", recruiterRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
// app.use("/api/v1/chat", ChatRoute);
// app.use("/api/v1/message", MessageRoute);

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});

// Socket.io
io.on("connection", (socket) => {
  console.log("Socket connected: ", socket.id);

  socket.on("join", async (data) => {
    console.log(`User ${data.userId} joined room ${data.jobId}`);
    socket.join(data.jobId);
  });

  socket.on("new-message", (data) => {
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected: ", socket.id);
  });
});

// app.all("*", (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
//   });

app.use(globalErrorHandler);

module.exports = app;
