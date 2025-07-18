# Birthday Management System

## Overview

This is a frontend-only birthday management application built with React and TypeScript. The system allows users to manage birthday records, configure reminder settings, and set up notification services through an external API. It features a modern UI built with shadcn/ui components and Tailwind CSS, with full integration for external REST API backends.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Only Architecture
- **Frontend**: React SPA with TypeScript, built with Vite
- **External API**: Configurable external REST API backend
- **Shared**: Common schema and type definitions for API integration
- **Build System**: Vite for frontend development and production builds

### Project Structure
```
├── client/          # React frontend application
├── shared/          # Shared schemas and types
├── .env             # Environment variables for API configuration
└── dist/           # Build output
```

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with CSS variables
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot reload

### External API Integration
- **Configuration**: Environment variables for API base URL and authentication
- **Authentication**: Bearer token support for secured API endpoints
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Connection Status**: Real-time API connection monitoring
- **CORS Support**: Configurable for different API backend implementations

### Expected API Schema
The frontend expects these API endpoints:
- **birthdays**: Birthday records with optional year and comments
- **reminder_settings**: User preferences for reminder timing
- **notification_settings**: Configuration for external services (Telegram, Email, VK)
- **statistics**: Real-time birthday statistics and analytics

## Data Flow

### Birthday Management
1. User creates birthday via form → validated with Zod
2. POST request to external API → external server validates and stores
3. TanStack Query invalidates cache → UI updates
4. Statistics automatically recalculated from external API

### Settings Configuration
1. User modifies reminder/notification settings
2. PUT requests to external API endpoints
3. Real-time validation and form state management
4. Optimistic updates with error handling

### Expected API Endpoints
- `GET /api/birthdays` - Fetch all birthdays
- `POST /api/birthdays` - Create birthday record
- `PUT /api/birthdays/:id` - Update birthday record
- `DELETE /api/birthdays/:id` - Remove birthday
- `GET /api/birthdays/stats` - Get statistics
- `GET/PUT /api/reminder-settings` - Reminder configuration
- `GET/PUT /api/notification-settings` - Notification services
- `GET /health` - API health check (optional)

## External Dependencies

### Frontend Libraries
- **UI Framework**: React + shadcn/ui components
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form + Hookform Resolvers
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation
- **Routing**: Wouter for lightweight routing

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod integration
- **Session**: connect-pg-simple for PostgreSQL sessions
- **Validation**: Zod for request/response validation

### Development Tools
- **Build**: Vite for frontend, esbuild for backend
- **TypeScript**: Full type safety across the stack
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Development Mode
- Vite dev server with HMR for frontend
- tsx for backend development with auto-restart
- In-memory storage for rapid development
- Replit-specific development banner and debugging tools

### Production Build
1. `npm run build` creates optimized frontend bundle
2. Backend compiled to single ESM bundle via esbuild
3. Static assets served from Express
4. Database migrations run via `npm run db:push`

### Environment Configuration
- PostgreSQL connection via `DATABASE_URL`
- Separate development and production configurations
- Type-safe environment variable handling

### Database Management
- Drizzle Kit for schema management
- Migrations stored in `/migrations`
- Push-based deployment for schema changes
- PostgreSQL dialect with connection pooling

## Recent Changes (January 2025)

### Architecture Migration to Frontend-Only
- **External API Support**: Migrated from full-stack to frontend-only architecture
- **API Configuration**: Added environment variables for external API integration
- **Connection Monitoring**: Implemented real-time API connection status with health checks
- **Authentication**: Added Bearer token support for secured API endpoints
- **Error Handling**: Enhanced error handling for external API integration

### Technical Improvements
- Removed internal Express backend and database dependencies
- Added API configuration management with environment variables
- Implemented API connection status monitoring component
- Enhanced error handling for external API failures
- Added support for configurable API base URLs and authentication
- Maintained all existing UI components and functionality

### Environment Configuration
- `VITE_API_BASE_URL`: External API base URL (default: http://localhost:8000)
- `VITE_API_KEY`: Optional Bearer token for API authentication
- `VITE_API_TIMEOUT`: Request timeout in milliseconds

The architecture now focuses on frontend excellence with seamless integration to any compatible REST API backend, maintaining type safety and developer experience while providing flexibility for different API implementations.