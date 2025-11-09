# Swagger API Documentation Setup

## Overview

Swagger/OpenAPI documentation has been successfully integrated into the VTB Backend API. This provides an interactive API documentation interface where you can explore and test all API endpoints.

## Accessing the Documentation

Once the server is running, you can access the Swagger UI at:

```
http://localhost:8000/api-docs
```

For production:
```
https://your-production-domain.com/api-docs
```

## Features

### Interactive API Testing
- Test API endpoints directly from the browser
- View request/response schemas
- See example payloads
- Test authentication with JWT tokens

### Comprehensive Documentation
The documentation covers all modules:
- **Authentication** - User registration, login, password reset
- **Events** - Event management (Admin) and public viewing
- **Event Bookings** - Registration, booking management, CSV exports
- **Albums** - Event photo albums
- **Films** - Film screenings and bookings
- **Library** - Books, categories, reading visits
- **Museum** - Artifacts, rentals, collaborations
- **Tours** - Travel tours booking and management
- **Trips** - Travel trips booking and management
- **Payment** - Payment processing and webhooks

## Using Authentication in Swagger

Many endpoints require authentication. To test protected endpoints:

1. First, use the `/auth/login` endpoint to get a JWT token
2. Click the "Authorize" button at the top of the Swagger UI
3. Enter your token in the format: `Bearer YOUR_TOKEN_HERE`
4. Click "Authorize"
5. Now you can test protected endpoints

## File Structure

```
src/
├── config/
│   └── swagger.js          # Swagger configuration
├── docs/
│   ├── auth.swagger.js     # Authentication endpoints
│   ├── events.swagger.js   # Admin event endpoints
│   ├── events-public.swagger.js  # Public event endpoints
│   ├── bookings.swagger.js # Event booking endpoints
│   ├── films.swagger.js    # Film endpoints
│   ├── library.swagger.js  # Library endpoints
│   ├── museum.swagger.js   # Museum endpoints
│   ├── travels.swagger.js  # Tours and trips endpoints
│   └── payment.swagger.js  # Payment endpoints
└── app.js                  # Swagger UI integration
```

## Customization

### Update API Information

Edit `src/config/swagger.js` to update:
- API title and description
- Version number
- Contact information
- Server URLs

### Add New Endpoints

To document new endpoints:

1. Create or update the appropriate file in `src/docs/`
2. Follow the JSDoc/Swagger annotation format
3. The documentation will automatically update on server restart

### Example Swagger Annotation

```javascript
/**
 * @swagger
 * /api/endpoint:
 *   post:
 *     summary: Brief description
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success response
 */
```

## Dependencies

The following packages were installed:
- `swagger-jsdoc` - Generates Swagger spec from JSDoc comments
- `swagger-ui-express` - Serves Swagger UI

## Development

When adding new features:
1. Create the route/controller as usual
2. Add Swagger documentation in the appropriate `src/docs/*.swagger.js` file
3. Test the documentation in Swagger UI
4. Ensure all request/response schemas are accurate

## Production Considerations

- Update the production server URL in `src/config/swagger.js`
- Consider adding authentication to the `/api-docs` endpoint if needed
- The Swagger UI is lightweight and can be safely deployed to production

## Troubleshooting

### Documentation not showing up
- Ensure the server is restarted after adding new documentation
- Check that the file path is included in `swagger.js` apis array
- Verify JSDoc syntax is correct

### Authentication not working
- Make sure you're using the format: `Bearer YOUR_TOKEN`
- Check that the token is valid and not expired
- Verify the endpoint requires the correct role

## Additional Resources

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express Documentation](https://github.com/scottie1984/swagger-ui-express)
