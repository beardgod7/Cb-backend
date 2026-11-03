// server.ts
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const routes = require("./routes/index");

// Import models to ensure they are registered with Sequelize
require("./features/Authentication/model");
require("./features/Bookstore/model");
require("./features/Library/model");
require("./features/Museum/model");
require("./features/Films/model");
require("./features/Events/model");
require("./features/Booking/model");
require("./features/Payment/model");
require("./features/Travels/Tours/model");
require("./features/Travels/Trips/model");
require("./features/Podcast/model");
require("./features/Newsletter/model");
require("./features/Merchandise/model");
require("./features/Visits/model");
require("./features/Archives/model");
require("./features/Programmes/model");
require("./features/Archives/visitResource");
require("./features/Library/visitResource");
// Register feature booking handlers with the Payment registry.
require("./features/Payment/handlers");
require("./features/Merchandise/paymentHandler");
require("./features/Bookstore/paymentHandler");

const { errorHandler } = require("./middleware/errorhandler");
const client = require("prom-client");
const responseTime = require("response-time");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const server = http.createServer(app);


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

// Allowed frontend origins. In development (or when CORS_ALLOW_ALL=true) any
// origin is accepted; in production only the site's domains + localhost are.
const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://cbaac.gov.ng",
  "https://www.cbaac.gov.ng",
  ...envOrigins,
];

const allowAllCors =
  process.env.CORS_ALLOW_ALL === "true" ||
  process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin: function (origin, callback) {
      // Non-browser clients (no Origin header) and allowlisted origins pass.
      if (!origin || allowAllCors || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed from origin: " + origin));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "CBAAC API",
}));

// Routes
app.use("/v1/api", routes);

// Global error handler
app.use(errorHandler);

module.exports = { app, server };

