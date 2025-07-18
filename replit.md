# Birthday Management System

## Overview

This is a frontend-only birthday management application built with React and TypeScript. The system provides a complete user interface for managing birthday records, configuring reminder settings, and setting up notification services. The application is designed to work with any compatible external REST API backend, making it flexible and easily deployable in different environments.

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
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/            # Application pages
│   │   ├── lib/              # Utilities and API client
│   │   └── hooks/            # Custom React hooks
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.ts    # Tailwind CSS configuration
│   └── tsconfig.json         # TypeScript configuration
├── shared/                   # Shared schemas and types
├── .env                      # Environment variables for API configuration
├── .env.example             # Example environment configuration
└── dist/                    # Build output
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

### Documentation Updates (January 18, 2025)
- **Comprehensive Documentation**: Created complete documentation suite for frontend-only architecture
- **API Specification**: Added detailed API_SPEC.md with required endpoints and data formats
- **Integration Examples**: Created API_EXAMPLES.md with Node.js, Python, and PHP examples
- **Deployment Guide**: Added DEPLOYMENT.md with deployment instructions for multiple platforms
- **Quick Start Guide**: Created QUICKSTART.md for rapid project setup
- **Updated README**: Enhanced README.md with Russian language support and detailed setup instructions
- **Environment Configuration**: Cleaned up .env.example with proper defaults

## Quick Start

### Prerequisites
- Node.js 18+ installed
- A compatible external API backend (see API Requirements below)

### Installation and Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy the example environment file and configure your API settings:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API configuration:
   ```
   VITE_API_BASE_URL=http://your-api-server.com
   VITE_API_KEY=your-api-key-here
   VITE_API_TIMEOUT=30000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

### Production Build

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

## API Requirements

### Environment Configuration
- `VITE_API_BASE_URL`: External API base URL (required)
- `VITE_API_KEY`: Optional Bearer token for API authentication
- `VITE_API_TIMEOUT`: Request timeout in milliseconds (default: 30000)

### Required API Endpoints

Your external API must implement the following endpoints:

#### Birthday Management
- `GET /api/birthdays` - Fetch all birthday records
- `POST /api/birthdays` - Create a new birthday record
- `PUT /api/birthdays/:id` - Update an existing birthday record
- `DELETE /api/birthdays/:id` - Delete a birthday record
- `GET /api/birthdays/stats` - Get birthday statistics

#### Settings Management
- `GET /api/reminder-settings` - Get reminder preferences
- `PUT /api/reminder-settings` - Update reminder preferences
- `GET /api/notification-settings` - Get notification service settings
- `PUT /api/notification-settings` - Update notification service settings

#### Health Check (Optional)
- `GET /health` - API health check endpoint

### API Response Format

All endpoints should return JSON responses. The application handles both success and error responses:

**Success Response:**
```json
{
  "data": { /* response data */ },
  "success": true,
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "message": "Error description",
  "errors": [ /* validation errors if applicable */ ]
}
```

### Authentication

If your API requires authentication, set the `VITE_API_KEY` environment variable. The frontend will automatically include it as a Bearer token in all requests:

```
Authorization: Bearer your-api-key-here
```

### CORS Configuration

Ensure your API backend is configured to accept requests from your frontend domain. For development, allow requests from `http://localhost:5000`.

## Data Models

The frontend expects the following data structures from your API:

### Birthday Record
```typescript
interface Birthday {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;      // Format: YYYY-MM-DD or --MM-DD
  hasYear: boolean;
  comment?: string;
  createdAt?: string;
}
```

### Birthday Statistics
```typescript
interface BirthdayStats {
  totalRecords: number;
  upcomingBirthdays: number;
  recordsWithoutYear: number;
  thisMonthBirthdays: number;
}
```

### Reminder Settings
```typescript
interface ReminderSettings {
  id: number;
  oneWeekBefore: boolean;
  threeDaysBefore: boolean;
  oneDayBefore: boolean;
  onBirthday: boolean;
  oneMonthBefore: boolean;
  timeOfDay: string;       // Format: HH:MM
}
```

### Notification Settings
```typescript
interface NotificationSettings {
  id: number;
  service: string;         // "telegram", "email", "vk"
  telegramBotToken?: string;
  telegramChatId?: string;
  emailAddress?: string;
  vkAccessToken?: string;
  vkUserId?: string;
}
```

## Deployment

### Static Hosting
After building the application, deploy the contents of the `dist` folder to any static hosting service:

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Push the `dist` folder to your repository
- **AWS S3**: Upload the `dist` folder to an S3 bucket with static hosting

### Environment Variables in Production
Set your production environment variables in your hosting platform:
- `VITE_API_BASE_URL`: Your production API URL
- `VITE_API_KEY`: Your production API key (if required)

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check that `VITE_API_BASE_URL` is correctly set
   - Verify your API server is running and accessible
   - Check CORS configuration on your API server

2. **Authentication Errors**
   - Verify `VITE_API_KEY` is correctly set
   - Check that your API key is valid and has proper permissions

3. **Build Errors**
   - Ensure all environment variables are properly set
   - Clear node_modules and reinstall dependencies: `rm -rf node_modules && npm install`

### Development Tips

- Use the browser's developer tools to inspect network requests
- Check the API Status indicator in the application header
- Monitor the console for error messages
- Test API endpoints directly using tools like Postman or curl

The architecture focuses on frontend excellence with seamless integration to any compatible REST API backend, maintaining type safety and developer experience while providing flexibility for different API implementations.