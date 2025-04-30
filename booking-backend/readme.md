# Hospital Booking System Backend

A robust and secure backend system for managing hospital bookings, built with modern technologies and best practices.

## Project Architecture

### Technology Stack

- **Runtime Environment**: Node.js with TypeScript for type safety and better developer experience
- **Web Framework**: Express.js for its minimalist, flexible approach and extensive middleware ecosystem
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations and easy schema management
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies for secure session management
- **API Security**: CORS configuration with specific origin and credentials support

### Project Structure

```
src/
├── config/         # Environment configuration
├── controllers/    # Request handlers
├── middlewares/    # Custom middleware functions
├── routes/         # API route definitions
└── index.ts        # Application entry point
```

## Database Design

The application uses a PostgreSQL database with the following core models:

- **User**: Manages user accounts with role-based access control
- **Hospital**: Stores hospital information and services
- **Service**: Represents medical services offered by hospitals
- **Booking**: Handles appointment bookings with status tracking

## API Structure

### Authentication Endpoints

```
POST /auth/register   # Create new user account
POST /auth/login      # User authentication
POST /auth/logout     # End user session
GET  /auth/me         # Get current user details
```

### Hospital Management

```
GET    /hospitals             # List all hospitals
GET    /hospitals/:id/services # Get hospital services
POST   /hospitals             # Create new hospital (Admin)
PUT    /hospitals/:id         # Update hospital details (Admin)
DELETE /hospitals/:id         # Remove hospital (Admin)
```

### Booking Management

```
GET    /bookings     # List user bookings
POST   /bookings     # Create new booking
PUT    /bookings/:id # Update booking status
```

## Security Measures

1. **Authentication**: 
   - JWT tokens stored in HTTP-only cookies
   - Secure password hashing with bcrypt
   - Role-based access control

2. **API Security**:
   - CORS configuration with specific origin
   - Request validation
   - Error handling middleware

## Database Migration and Seeding

### Migrations

The project uses Prisma Migrate for database schema management:

1. Generate a new migration:
   ```bash
   npx prisma migrate dev --name migration_name
   ```

2. Apply migrations to production:
   ```bash
   npx prisma migrate deploy
   ```

3. View migration history:
   ```bash
   npx prisma migrate status
   ```
4. Fresh migration if you want to reset the database:
   ```bash
   npx prisma migrate dev --name init
   ```

### Database Seeding

Seeding is handled through Prisma's seeding functionality:

1. Run database seeding:
   ```bash
   npx prisma db seed
   ```

2. Location of seed files:
   ```
   prisma/
   └── seed.ts    # Database seeding script
   ```

## Docker Configuration

The project includes Docker configuration for both development and production:

- Multi-container setup with Docker Compose
- Separate containers for application and database
- Volume mapping for persistent data
- Environment variable management

## Technology Choices Rationale

1. **Express.js**: 
   - Lightweight and flexible
   - Extensive middleware ecosystem
   - Easy to scale and maintain

2. **Prisma ORM**:
   - Type-safe database queries
   - Automatic migrations
   - Excellent TypeScript support
   - Schema-first approach

3. **PostgreSQL**:
   - ACID compliance
   - Rich feature set
   - Excellent performance
   - Strong community support

4. **TypeScript**:
   - Enhanced code quality
   - Better developer experience
   - Improved maintainability
   - Excellent tooling support

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```env
   PORT=9001
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/booking_db
   JWT_SECRET=your-secret-key
   CLIENT_URL=http://localhost:3000
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Testing

### Test Structure

```
src/
├── __tests__/        # Integration tests
├── controllers/
│   └── __tests__/    # Controller unit tests
└── middlewares/
    └── __tests__/    # Middleware unit tests
```

### Running Tests

1. Run all tests:
   ```bash
   npm test
   ```

2. Run tests in watch mode during development:
   ```bash
   npm run test:watch
   ```

3. Run tests with coverage report:
   ```bash
   npm run test:coverage
   ```

### Testing Guidelines

1. **Unit Tests**:
   - Test individual components in isolation
   - Mock external dependencies
   - Focus on edge cases and error handling

2. **Integration Tests**:
   - Test API endpoints end-to-end
   - Use test database
   - Verify request/response cycles

3. **Test Database**:
   - Separate test database configuration
   - Automated cleanup after tests
   - Seeding test data before runs

### Coverage Requirements

- Minimum 80% code coverage
- 100% coverage for critical paths
- Regular CI/CD pipeline checks

## Docker Deployment

1. Configure environment:
   - Copy `.env.example` to `.env`
   - Update environment variables for production

2. Build Docker images:
   ```bash
   docker-compose build
   ```

3. Start containers in detached mode:
   ```bash
   docker-compose up -d
   ```

4. Initialize database:
   ```bash
   # Apply database migrations
   docker-compose exec app npx prisma migrate deploy
   
   # Run database seeding (if needed)
   docker-compose exec app npx prisma db seed
   ```

5. Monitor container logs:
   ```bash
   docker-compose logs -f
   ```

6. Access the API at:
   ```
   http://localhost:9001
   ```

7. Stop and cleanup:
   ```bash
   # Stop containers
   docker-compose down
   
   # Remove volumes (if needed)
   docker-compose down -v
   ```