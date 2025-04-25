# Hospital Booking System (Prototype)

A prototype of a hospital booking system designed to demonstrate efficient management of hospital appointments.

### Key Features

- User authentication and authorization
- Appointment scheduling and management
- Responsive design for all devices

## Architecture

The project follows a microservices architecture with two main components:

### Frontend (`/booking-frontend`)

- Built with Next.js 15.3.1 and TypeScript
- Modern UI components using shadcn/ui and Tailwind CSS
- State management with Redux Toolkit
- Form handling with React Hook Form

### Backend (`/booking-backend`)

- RESTful API service
- Secure authentication system
- Booking management endpoints
- Environment-based configuration

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/rafiul1009/hospital-booking.git
   cd hospital-booking
   ```

2. Set up the backend:
   ```bash
   cd booking-backend
   npm install
   npm run dev
   ```

3. Set up the frontend:
   ```bash
   cd booking-frontend
   npm install
   npm run dev
   ```

## Deployment

### Backend Deployment

1. Build the backend:
   ```bash
   cd booking-backend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd booking-frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

Create `.env` files in both frontend and backend directories. Refer to the respective README files in each directory for required environment variables.

## Documentation

- For detailed frontend documentation, see [Frontend README](/booking-frontend/README.md)
- For detailed backend documentation, see [Backend README](/booking-backend/README.md)
