# Birthday Management System

## Overview

This is a full-stack birthday management application built with React, Express, and PostgreSQL. The system allows users to manage birthday records, configure reminder settings, and set up notification services. It features a modern UI built with shadcn/ui components and Tailwind CSS, with a REST API backend using Express and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Monorepo Structure
- **Frontend**: React SPA with TypeScript, built with Vite
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Shared**: Common schema and type definitions
- **Build System**: Vite for frontend, esbuild for backend

### Project Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared schemas and types
├── migrations/      # Database migrations
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

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for request validation
- **Session**: In-memory storage (development mode)

### Database Schema
Three main tables:
- **birthdays**: Stores birthday records with optional year and comments
- **reminder_settings**: User preferences for reminder timing
- **notification_settings**: Configuration for external services (Telegram, Email, VK)

## Data Flow

### Birthday Management
1. User creates birthday via form → validated with Zod
2. POST /api/birthdays → server validates and stores
3. TanStack Query invalidates cache → UI updates
4. Statistics automatically recalculated

### Settings Configuration
1. User modifies reminder/notification settings
2. PUT requests to respective endpoints
3. Real-time validation and form state management
4. Optimistic updates with error handling

### API Endpoints
- `GET /api/birthdays` - Fetch all birthdays
- `POST /api/birthdays` - Create birthday record
- `PUT /api/birthdays/:id` - Update birthday record
- `DELETE /api/birthdays/:id` - Remove birthday
- `GET /api/birthdays/stats` - Get statistics
- `GET/PUT /api/reminder-settings` - Reminder configuration
- `GET/PUT /api/notification-settings` - Notification services

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

### Added Comments and Editing Features
- **Comment Field**: Added optional comment field to birthday records for additional information
- **Inline Editing**: Implemented direct table editing with save/cancel functionality
- **Enhanced UI**: Added edit and save icons with proper color coding (blue for edit, green for save, red for delete)
- **Form Validation**: Maintained Zod validation for all CRUD operations
- **Improved UX**: Fixed React re-render issues in settings components using useEffect

### Technical Improvements
- Extended birthday schema with comment field
- Added PUT endpoint for updating birthday records
- Implemented inline editing with React Hook Form
- Enhanced birthday table with edit/save/cancel actions
- Updated storage interface with updateBirthday method
- Fixed form reset loops in settings components

The architecture prioritizes developer experience with hot reloading, type safety, and rapid iteration while maintaining production-ready patterns for deployment.