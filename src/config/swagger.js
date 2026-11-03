const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CBAAC API",
      version: "1.0.0",
      description: "CBAAC backend API for payments, merchandise, archives, library, museum, travels, events, films, podcasts and programmes.",
      contact: {
        name: "API Support",
        email: "info@cbaac.gov.ng",
      },
    },
    servers: [
      {
        url: "http://localhost:6000/v1/api",
        description: "Development server",
      },
      {
        url: "https://cb-backend-qwxd.onrender.com/v1/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Access denied. No token provided.",
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: "User does not have permission to perform this action",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Forbidden: You do not have permission to perform this action.",
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Resource not found",
                  },
                },
              },
            },
          },
        },
        BadRequestError: {
          description: "Invalid request parameters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid request parameters",
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Internal Server Error",
                  },
                  error: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
      {
        name: "Events",
        description: "Event management endpoints (Admin)",
      },
      {
        name: "Events - Public",
        description: "Public event viewing endpoints",
      },
      {
        name: "Event Bookings",
        description: "Event registration and booking management",
      },
      {
        name: "Albums",
        description: "Event album management",
      },
      {
        name: "Films",
        description: "Film and screening management",
      },
      {
        name: "Library - Public",
        description: "Public library browsing and reading visit booking",
      },
      {
        name: "Library - Admin",
        description: "Library management endpoints (Admin)",
      },
      {
        name: "Museum",
        description: "Museum artifacts and rental management",
      },
      {
        name: "Tours",
        description: "Travel tours booking and management",
      },
      {
        name: "Trips",
        description: "Travel trips booking and management",
      },
      {
        name: "Payment",
        description: "Payment processing endpoints",
      },
      {
        name: "Bookstore - Public",
        description: "Public bookstore browsing endpoints",
      },
      {
        name: "Bookstore - Admin",
        description: "Bookstore management endpoints (Admin)",
      },
      {
        name: "Podcasts",
        description: "Podcast management and browsing endpoints",
      },
      {
        name: "Accounts & Profile",
        description: "Sign-up, OTP verification, profile, password and addresses",
      },
      {
        name: "Newsletter",
        description: "Newsletter subscription (subscribe/confirm/unsubscribe) and admin list/export",
      },
      {
        name: "Merchandise & Orders",
        description: "Shop products, cart quote, orders and fulfilment",
      },
      {
        name: "Visits",
        description: "Reading/archive visit booking shared by Library and Archives",
      },
      {
        name: "Archives",
        description: "Archive collections, items, paged reader and admin CRUD",
      },
      {
        name: "Programmes",
        description: "Programmes and yearly editions (e.g. Black History Month)",
      },
      {
        name: "Payment",
        description: "Payment initialize/verify, bank transfer and webhooks",
      },
      {
        name: "Health",
        description: "Service health check",
      },
    ],
  },
  apis: [
    "./src/docs/*.swagger.js",
    "./src/features/*/route.js",
    "./src/features/*/routes.js",
    "./src/features/Travels/*/route.js",
    "./src/routes/index.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
