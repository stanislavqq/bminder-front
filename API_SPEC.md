# API Specification

This document describes the API endpoints that the Birthday Management System frontend expects from the external backend.

## Base URL

All API endpoints are relative to the base URL configured in `VITE_API_BASE_URL` environment variable.

## Authentication

If authentication is required, include the API key as a Bearer token in the Authorization header:

```
Authorization: Bearer {VITE_API_KEY}
```

## Common Response Format

All endpoints should return JSON responses with the following structure:

### Success Response
```json
{
  "data": { /* endpoint-specific data */ },
  "success": true,
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": [ /* Array of validation errors (optional) */ ]
}
```

## Endpoints

### Birthday Management

#### GET /api/birthdays
Retrieve all birthday records.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "birthDate": "1990-05-15",
      "hasYear": true,
      "comment": "Colleague from work",
      "createdAt": "2025-01-01T12:00:00Z"
    },
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "birthDate": "--12-25",
      "hasYear": false,
      "comment": null,
      "createdAt": "2025-01-02T14:30:00Z"
    }
  ],
  "success": true
}
```

#### POST /api/birthdays
Create a new birthday record.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-05-15",
  "hasYear": true,
  "comment": "Colleague from work"
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-05-15",
    "hasYear": true,
    "comment": "Colleague from work",
    "createdAt": "2025-01-01T12:00:00Z"
  },
  "success": true,
  "message": "Birthday record created successfully"
}
```

#### PUT /api/birthdays/:id
Update an existing birthday record.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-05-15",
  "hasYear": true,
  "comment": "Updated comment"
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-05-15",
    "hasYear": true,
    "comment": "Updated comment",
    "createdAt": "2025-01-01T12:00:00Z"
  },
  "success": true,
  "message": "Birthday record updated successfully"
}
```

#### DELETE /api/birthdays/:id
Delete a birthday record.

**Response:**
```json
{
  "success": true,
  "message": "Birthday record deleted successfully"
}
```

#### GET /api/birthdays/stats
Get birthday statistics.

**Response:**
```json
{
  "data": {
    "totalRecords": 25,
    "upcomingBirthdays": 3,
    "recordsWithoutYear": 8,
    "thisMonthBirthdays": 2
  },
  "success": true
}
```

### Settings Management

#### GET /api/reminder-settings
Get reminder settings.

**Response:**
```json
{
  "data": {
    "id": 1,
    "oneWeekBefore": false,
    "threeDaysBefore": true,
    "oneDayBefore": true,
    "onBirthday": true,
    "oneMonthBefore": false,
    "timeOfDay": "10:00"
  },
  "success": true
}
```

#### PUT /api/reminder-settings
Update reminder settings.

**Request Body:**
```json
{
  "oneWeekBefore": false,
  "threeDaysBefore": true,
  "oneDayBefore": true,
  "onBirthday": true,
  "oneMonthBefore": false,
  "timeOfDay": "10:00"
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "oneWeekBefore": false,
    "threeDaysBefore": true,
    "oneDayBefore": true,
    "onBirthday": true,
    "oneMonthBefore": false,
    "timeOfDay": "10:00"
  },
  "success": true,
  "message": "Reminder settings updated successfully"
}
```

#### GET /api/notification-settings
Get notification settings.

**Response:**
```json
{
  "data": {
    "id": 1,
    "service": "telegram",
    "telegramBotToken": "bot123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "telegramChatId": "123456789",
    "emailAddress": null,
    "vkAccessToken": null,
    "vkUserId": null
  },
  "success": true
}
```

#### PUT /api/notification-settings
Update notification settings.

**Request Body:**
```json
{
  "service": "telegram",
  "telegramBotToken": "bot123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "telegramChatId": "123456789",
  "emailAddress": null,
  "vkAccessToken": null,
  "vkUserId": null
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "service": "telegram",
    "telegramBotToken": "bot123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "telegramChatId": "123456789",
    "emailAddress": null,
    "vkAccessToken": null,
    "vkUserId": null
  },
  "success": true,
  "message": "Notification settings updated successfully"
}
```

### Health Check

#### GET /health
Check API health status (optional endpoint).

**Response:**
```json
{
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-01T12:00:00Z",
    "version": "1.0.0"
  },
  "success": true
}
```

## Data Types

### Birthday Record
```typescript
interface Birthday {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;      // Format: YYYY-MM-DD or --MM-DD (without year)
  hasYear: boolean;
  comment?: string | null;
  createdAt?: string;     // ISO 8601 format
}
```

### Birthday Statistics
```typescript
interface BirthdayStats {
  totalRecords: number;
  upcomingBirthdays: number;      // Birthdays in next 7 days
  recordsWithoutYear: number;     // Records with hasYear: false
  thisMonthBirthdays: number;     // Birthdays in current month
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
  timeOfDay: string;              // Format: HH:MM (24-hour)
}
```

### Notification Settings
```typescript
interface NotificationSettings {
  id: number;
  service: "telegram" | "email" | "vk";
  telegramBotToken?: string | null;
  telegramChatId?: string | null;
  emailAddress?: string | null;
  vkAccessToken?: string | null;
  vkUserId?: string | null;
}
```

## Error Handling

### HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Validation Errors
When validation fails, return a 400 status with detailed error information:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "firstName",
      "message": "First name is required"
    },
    {
      "field": "birthDate",
      "message": "Invalid date format"
    }
  ]
}
```

## CORS Configuration

The API must be configured to accept requests from the frontend domain. For development, allow requests from `http://localhost:5000`.

Example CORS headers:
```
Access-Control-Allow-Origin: http://localhost:5000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## Date Format Specifications

### Birth Date Format
- **With year**: `YYYY-MM-DD` (e.g., "1990-05-15")
- **Without year**: `--MM-DD` (e.g., "--12-25")

### ISO 8601 Timestamps
- **Format**: `YYYY-MM-DDTHH:MM:SS.sssZ`
- **Example**: `2025-01-01T12:00:00.000Z`

### Time of Day Format
- **Format**: `HH:MM` (24-hour format)
- **Example**: `10:00`, `14:30`