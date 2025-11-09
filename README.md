# VTB Backend API

A comprehensive backend API for managing events, bookings, films, library, museum, and travel services.

## Features

- **Event Management** - Create, manage, and publish events with registration capabilities
- **Booking System** - Handle event registrations, volunteers, and sponsors
- **Film Screenings** - Manage films and screening schedules
- **Library System** - Book catalog and reading visit management
- **Museum** - Artifact management with rental and collaboration features
- **Travel Services** - Tours and trips booking system
- **Payment Integration** - Support for Paystack, Flutterwave, and Stripe
- **Authentication** - JWT-based authentication with role-based access control

## Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file with your configuration (see `.env.example`)

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

## API Documentation

Interactive API documentation is available via Swagger UI:

**Local Development:**
```
http://localhost:8000/api-docs
```

The Swagger documentation provides:
- Complete API endpoint reference
- Request/response schemas
- Interactive testing interface
- Authentication examples

For detailed setup information, see [SWAGGER_SETUP.md](./SWAGGER_SETUP.md)

## API Endpoints

### Base URL
```
http://localhost:8000/v1/api
```

### Main Modules

- `/auth` - Authentication and user management
- `/events` - Event management (Admin)
- `/event` - Public event viewing
- `/eventbooking` - Event registration and bookings
- `/films` - Film screenings
- `/library` - Library books and visits
- `/museum` - Museum artifacts
- `/travels/tours` - Travel tours
- `/travels/trips` - Travel trips
- `/payment` - Payment processing

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database (via Sequelize ORM)
- **JWT** - Authentication
- **Swagger** - API documentation
- **Cloudinary** - Image storage
- **SendGrid** - Email service
- **Stripe/Paystack/Flutterwave** - Payment processing

## Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Swagger Setup Guide](./SWAGGER_SETUP.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Library Module](./LIBRARY_MODULE_DOCUMENTATION.md)
- [Museum Module](./MUSEUM_MODULE_DOCUMENTATION.md)
- [Travels Module](./TRAVELS_MODULE_DOCUMENTATION.md)

## License

ISC
