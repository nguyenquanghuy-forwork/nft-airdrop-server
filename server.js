const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const port = 3000;

// Khởi động server HTTP
const server = http.createServer(app);

// Khởi động socket.io và thiết lập CORS cho socket
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Địa chỉ frontend của bạn
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // Enable CORS for all routes

// Import các route
const hamsterRoute = require("./routes/hamster/hamster");

// Sử dụng các route
app.use(hamsterRoute);

// Lắng nghe sự kiện kết nối từ client WebSocket
io.on("connection", (socket) => {
  console.log("New client connected");
  // Gửi đến client kết nối
  socket.emit("message", { message: "Welcome to the server!" });

  // Gửi đến tất cả các client
  io.emit("message", { data: "New data from server" });
  // Xử lý sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Khởi động server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Xuất app và io để sử dụng ở nơi khác
module.exports = { app, io, server };
