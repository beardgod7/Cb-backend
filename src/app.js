// server.ts
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const routes = require("./routes/index");
const { errorHandler } = require("./middleware/errorhandler");
const client = require("prom-client");
const responseTime = require("response-time");

const app = express();
const server = http.createServer(app);

// Setup Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: false,
  },
});

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Promethues connection
// Create and register Prometheus registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom Metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [50, 100, 300, 500, 1000, 2000], // in ms
});
register.registerMetric(httpRequestDurationMicroseconds);

const httpRequestCount = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "code"],
});
register.registerMetric(httpRequestCount);

// ⏱ Middleware to track response time per route
app.use(
  responseTime((req, res, time) => {
    if (req.route && req.route.path) {
      httpRequestDurationMicroseconds
        .labels(req.method, req.route.path, res.statusCode)
        .observe(time);
      httpRequestCount.labels(req.method, req.route.path, res.statusCode).inc();
    }
  })
);

// Allowed frontend origins
const allowedOrigins = [
  "*",
  "http://localhost:3000",
  //"https://your-production-frontend.com", // ✅ Replace with actual frontend production URL
];

// Proper CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from origin: " + origin));
      }
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Handle preflight requests// Metrics endpoint for Prometheus to scrape
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.options("*", cors());

// Middleware setup
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/v1/api", routes);

// Global error handler
app.use(errorHandler);

module.exports = { app, server };

