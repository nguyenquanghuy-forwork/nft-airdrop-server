const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const http = require("http");
const socketIo = require("socket.io");

const routerServer = http.createServer();
const io = socketIo(routerServer, {
  cors: {
    origin: "http://localhost:3000", // Địa chỉ frontend của bạn
    methods: ["GET", "POST"],
  },
});

let intervalId; // Variable to store the interval ID for stopping it later

// Function to call the external API
async function callApi() {
  try {
    const response = await fetch(
      "https://api.hamsterkombatgame.io/clicker/tap",
      {
        headers: {
          accept: "application/json",
          "accept-language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
          authorization:
            "Bearer 1724848252899dLeFhDked4rremhpjxUP2vVMiguCGcL6kZHDZ6K2eLux6EISMf3IfmjdzYhaiNI15863255841",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://hamsterkombatgame.io/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
          count: 10,
          availableTaps: 3485,
          timestamp: 1724851043,
        }),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("API response:", data);
    // Gửi dữ liệu đến tất cả các client WebSocket
    if (io) {
      io.emit("message", data);
    } else {
      console.error("WebSocket connection is not available.");
    }
  } catch (error) {
    console.error("Error calling API:", error);
  }
}

// Endpoint to start API calls
router.get("/start-api-calls", (req, res) => {
  if (!intervalId) {
    intervalId = setInterval(callApi, 1000); // Call the API every 1 second
    console.log("Started API calls every 1 second.");
    res.json({ message: "API calls started." });
  } else {
    res.json({ message: "API calls are already running." });
  }
});

// Endpoint to stop API calls
router.post("/stop-api-calls", (req, res) => {
  if (intervalId) {
    clearInterval(intervalId); // Clear the interval to stop API calls
    intervalId = null;
    console.log("Stopped API calls.");
    res.json({ message: "API calls stopped." });
  } else {
    res.json({ message: "API calls are not running." });
  }
});

module.exports = router;
