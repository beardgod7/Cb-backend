// server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { Server as SocketIO } from "socket.io";
import responseTime from "response-time";
import client from "prom-client";
import dotenv from "dotenv";
import routes from "./routes/index";
import { errorHandler } from "./middleware/errorhandler";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ------------------
// CORS Configuration
// ------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  // "https://your-production-frontend.com",
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); // allow Postman, curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed from origin: " + origin));
  },
  credentials: true, // allow cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

// ------------------
// Socket.IO Setup
// ------------------
const io = new SocketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Attach io instance to requests
app.use((req, _res, next) => {
  (req as any).io = io;
  next();
});

// ------------------
// Prometheus Metrics
// ------------------
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [50, 100, 300, 500, 1000, 2000],
});
register.registerMetric(httpRequestDuration);

const httpRequestCount = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "code"],
});
register.registerMetric(httpRequestCount);

// Track response times
app.use(
  responseTime((req, res, time) => {
    if (req.route && req.route.path) {
      httpRequestDuration.labels(req.method, req.route.path, res.statusCode.toString()).observe(time);
      httpRequestCount.labels(req.method, req.route.path, res.statusCode.toString()).inc();
    }
  })
);

// Metrics endpoint for Prometheus scraping
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ------------------
// Middleware
// ------------------
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ------------------
// Routes
// ------------------
app.use("/v1/api", routes);

// ------------------
// Global Error Handler
// ------------------
app.use(errorHandler);

// ------------------
// Start Server
// ------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server, io };

