# Hospital Booking Frontend

A modern, user-friendly hospital booking system built with Next.js and TypeScript, featuring a robust authentication system and intuitive booking management.

## Technology Stack

### Core Technologies

- **Next.js 15.3.1**: Chosen for its powerful features including:
  - Server-side rendering capabilities
  - Built-in routing system
  - API routes for backend integration
  - Enhanced development experience with Turbopack

- **TypeScript**: Implemented for enhanced code reliability and better developer experience through:
  - Static type checking
  - Improved code maintainability
  - Better IDE support and code documentation

### State Management & Form Handling

- **Redux Toolkit**: Selected for centralized state management:
  - Efficient handling of global application state
  - Built-in immutability checks
  - Simplified Redux configuration
  - Integration with React through react-redux

- **React Hook Form**: Implemented for efficient form handling:
  - Performance-optimized form validation
  - Reduced re-renders
  - Built-in error handling
  - Integration with Zod for schema validation

### UI Components & Styling

- **shadcn/ui**: Chosen for its modern, accessible components:
  - Built on Radix UI primitives
  - Customizable with Tailwind CSS
  - Consistent design language
  - Excellent accessibility support

- **Tailwind CSS**: Used for styling:
  - Utility-first approach
  - Rapid UI development
  - Easy customization
  - Responsive design support

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Base UI components
│   └── message/    # Message components
├── views/          # Page-specific components
│   ├── login/      # Login page components
│   └── register/   # Registration page components
├── services/       # API services
│   └── api/        # API integration
├── store/          # Redux store configuration
│   └── slices/     # Redux slices
├── lib/            # Utility functions
└── hooks/          # Custom React hooks
```

## Authentication Implementation

The authentication system is implemented using JWT (JSON Web Tokens) with the following features:

- Secure token-based authentication
- Protected routes
- Automatic token management
- Redux integration for global auth state

### Authentication Flow

1. **Registration**:
   - User submits registration form
   - Data validation using React Hook Form
   - API call to create account
   - Automatic login on successful registration

2. **Login**:
   - Email/password validation
   - JWT token storage
   - Redux state update
   - Redirect to protected routes

## Form Handling

Forms are implemented using React Hook Form with the following features:

- Form validation using Zod schemas
- Real-time error feedback
- Controlled inputs with performance optimization
- Integration with shadcn/ui components

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Docker Deployment

### Prerequisites

- Docker installed on your system
- Docker Compose (optional, for development environment)

### Docker Configuration

The project includes a multi-stage Dockerfile for optimized production builds:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### Build and Run

1. Build the Docker image:
```bash
docker build --no-cache --build-arg NEXT_PUBLIC_API_URL=your_api_url -t hospital-booking-frontend .
```

2. Run the container:
```bash
docker run -p 3000:3000 hospital-booking-frontend
```

### Environment Variables

Configure these environment variables for production deployment:

- `NODE_ENV`: Set to 'production' for production builds
- `NEXT_PUBLIC_API_URL`: Public API endpoint for client-side requests


## Best Practices

- **Type Safety**: Strict TypeScript configuration for better code quality
- **Component Architecture**: Modular and reusable component design
- **State Management**: Centralized Redux store for global state
- **Form Handling**: Efficient form management with React Hook Form
- **UI Components**: Consistent design with shadcn/ui
- **Styling**: Utility-first approach with Tailwind CSS