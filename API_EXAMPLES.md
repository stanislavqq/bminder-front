# API Integration Examples

This document provides practical examples of how to integrate with the Birthday Management System frontend.

## Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_KEY=your-api-key-here
VITE_API_TIMEOUT=30000
```

## Example API Implementations

### Node.js/Express Example

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));
app.use(express.json());

// Mock data
let birthdays = [];
let settings = {
  reminder: {
    id: 1,
    oneWeekBefore: false,
    threeDaysBefore: true,
    oneDayBefore: true,
    onBirthday: true,
    oneMonthBefore: false,
    timeOfDay: "10:00"
  },
  notification: {
    id: 1,
    service: "telegram",
    telegramBotToken: "",
    telegramChatId: "",
    emailAddress: null,
    vkAccessToken: null,
    vkUserId: null
  }
};

// Birthday endpoints
app.get('/api/birthdays', (req, res) => {
  res.json({ data: birthdays, success: true });
});

app.post('/api/birthdays', (req, res) => {
  const birthday = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  birthdays.push(birthday);
  res.status(201).json({ 
    data: birthday, 
    success: true,
    message: "Birthday created successfully"
  });
});

app.put('/api/birthdays/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = birthdays.findIndex(b => b.id === id);
  
  if (index === -1) {
    return res.status(404).json({ 
      message: "Birthday not found" 
    });
  }
  
  birthdays[index] = { ...birthdays[index], ...req.body };
  res.json({ 
    data: birthdays[index], 
    success: true,
    message: "Birthday updated successfully"
  });
});

app.delete('/api/birthdays/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = birthdays.findIndex(b => b.id === id);
  
  if (index === -1) {
    return res.status(404).json({ 
      message: "Birthday not found" 
    });
  }
  
  birthdays.splice(index, 1);
  res.json({ 
    success: true,
    message: "Birthday deleted successfully"
  });
});

app.get('/api/birthdays/stats', (req, res) => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const stats = {
    totalRecords: birthdays.length,
    upcomingBirthdays: birthdays.filter(b => {
      // Calculate upcoming birthdays logic here
      return false; // Simplified
    }).length,
    recordsWithoutYear: birthdays.filter(b => !b.hasYear).length,
    thisMonthBirthdays: birthdays.filter(b => {
      // Calculate this month birthdays logic here
      return false; // Simplified
    }).length
  };
  
  res.json({ data: stats, success: true });
});

// Settings endpoints
app.get('/api/reminder-settings', (req, res) => {
  res.json({ data: settings.reminder, success: true });
});

app.put('/api/reminder-settings', (req, res) => {
  settings.reminder = { ...settings.reminder, ...req.body };
  res.json({ 
    data: settings.reminder, 
    success: true,
    message: "Reminder settings updated successfully"
  });
});

app.get('/api/notification-settings', (req, res) => {
  res.json({ data: settings.notification, success: true });
});

app.put('/api/notification-settings', (req, res) => {
  settings.notification = { ...settings.notification, ...req.body };
  res.json({ 
    data: settings.notification, 
    success: true,
    message: "Notification settings updated successfully"
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    data: { 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    }, 
    success: true 
  });
});

app.listen(8000, () => {
  console.log('API server running on port 8000');
});
```

### Python/FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Birthday(BaseModel):
    id: Optional[int] = None
    firstName: str
    lastName: str
    birthDate: str
    hasYear: bool
    comment: Optional[str] = None
    createdAt: Optional[str] = None

class BirthdayStats(BaseModel):
    totalRecords: int
    upcomingBirthdays: int
    recordsWithoutYear: int
    thisMonthBirthdays: int

class ReminderSettings(BaseModel):
    id: Optional[int] = None
    oneWeekBefore: bool
    threeDaysBefore: bool
    oneDayBefore: bool
    onBirthday: bool
    oneMonthBefore: bool
    timeOfDay: str

class NotificationSettings(BaseModel):
    id: Optional[int] = None
    service: str
    telegramBotToken: Optional[str] = None
    telegramChatId: Optional[str] = None
    emailAddress: Optional[str] = None
    vkAccessToken: Optional[str] = None
    vkUserId: Optional[str] = None

# Mock data
birthdays = []
reminder_settings = ReminderSettings(
    id=1,
    oneWeekBefore=False,
    threeDaysBefore=True,
    oneDayBefore=True,
    onBirthday=True,
    oneMonthBefore=False,
    timeOfDay="10:00"
)
notification_settings = NotificationSettings(
    id=1,
    service="telegram",
    telegramBotToken="",
    telegramChatId="",
    emailAddress=None,
    vkAccessToken=None,
    vkUserId=None
)

@app.get("/api/birthdays")
async def get_birthdays():
    return {"data": birthdays, "success": True}

@app.post("/api/birthdays")
async def create_birthday(birthday: Birthday):
    birthday.id = len(birthdays) + 1
    birthday.createdAt = datetime.now().isoformat()
    birthdays.append(birthday.dict())
    return {
        "data": birthday.dict(),
        "success": True,
        "message": "Birthday created successfully"
    }

@app.put("/api/birthdays/{birthday_id}")
async def update_birthday(birthday_id: int, birthday: Birthday):
    for i, b in enumerate(birthdays):
        if b["id"] == birthday_id:
            birthdays[i] = {**b, **birthday.dict(exclude_unset=True)}
            return {
                "data": birthdays[i],
                "success": True,
                "message": "Birthday updated successfully"
            }
    raise HTTPException(status_code=404, detail="Birthday not found")

@app.delete("/api/birthdays/{birthday_id}")
async def delete_birthday(birthday_id: int):
    for i, b in enumerate(birthdays):
        if b["id"] == birthday_id:
            del birthdays[i]
            return {
                "success": True,
                "message": "Birthday deleted successfully"
            }
    raise HTTPException(status_code=404, detail="Birthday not found")

@app.get("/api/birthdays/stats")
async def get_stats():
    stats = BirthdayStats(
        totalRecords=len(birthdays),
        upcomingBirthdays=0,  # Simplified
        recordsWithoutYear=len([b for b in birthdays if not b["hasYear"]]),
        thisMonthBirthdays=0  # Simplified
    )
    return {"data": stats.dict(), "success": True}

@app.get("/api/reminder-settings")
async def get_reminder_settings():
    return {"data": reminder_settings.dict(), "success": True}

@app.put("/api/reminder-settings")
async def update_reminder_settings(settings: ReminderSettings):
    global reminder_settings
    reminder_settings = settings
    return {
        "data": reminder_settings.dict(),
        "success": True,
        "message": "Reminder settings updated successfully"
    }

@app.get("/api/notification-settings")
async def get_notification_settings():
    return {"data": notification_settings.dict(), "success": True}

@app.put("/api/notification-settings")
async def update_notification_settings(settings: NotificationSettings):
    global notification_settings
    notification_settings = settings
    return {
        "data": notification_settings.dict(),
        "success": True,
        "message": "Notification settings updated successfully"
    }

@app.get("/health")
async def health_check():
    return {
        "data": {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0"
        },
        "success": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### PHP/Laravel Example

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Enable CORS
header('Access-Control-Allow-Origin: http://localhost:5000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Mock data storage (use database in production)
$birthdays = [];
$reminderSettings = [
    'id' => 1,
    'oneWeekBefore' => false,
    'threeDaysBefore' => true,
    'oneDayBefore' => true,
    'onBirthday' => true,
    'oneMonthBefore' => false,
    'timeOfDay' => '10:00'
];
$notificationSettings = [
    'id' => 1,
    'service' => 'telegram',
    'telegramBotToken' => '',
    'telegramChatId' => '',
    'emailAddress' => null,
    'vkAccessToken' => null,
    'vkUserId' => null
];

// Birthday routes
Route::get('/api/birthdays', function () use ($birthdays) {
    return response()->json([
        'data' => $birthdays,
        'success' => true
    ]);
});

Route::post('/api/birthdays', function (Request $request) use (&$birthdays) {
    $birthday = $request->all();
    $birthday['id'] = count($birthdays) + 1;
    $birthday['createdAt'] = now()->toISOString();
    $birthdays[] = $birthday;
    
    return response()->json([
        'data' => $birthday,
        'success' => true,
        'message' => 'Birthday created successfully'
    ], 201);
});

Route::put('/api/birthdays/{id}', function (Request $request, $id) use (&$birthdays) {
    foreach ($birthdays as &$birthday) {
        if ($birthday['id'] == $id) {
            $birthday = array_merge($birthday, $request->all());
            return response()->json([
                'data' => $birthday,
                'success' => true,
                'message' => 'Birthday updated successfully'
            ]);
        }
    }
    
    return response()->json([
        'message' => 'Birthday not found'
    ], 404);
});

Route::delete('/api/birthdays/{id}', function ($id) use (&$birthdays) {
    foreach ($birthdays as $key => $birthday) {
        if ($birthday['id'] == $id) {
            unset($birthdays[$key]);
            return response()->json([
                'success' => true,
                'message' => 'Birthday deleted successfully'
            ]);
        }
    }
    
    return response()->json([
        'message' => 'Birthday not found'
    ], 404);
});

Route::get('/api/birthdays/stats', function () use ($birthdays) {
    $stats = [
        'totalRecords' => count($birthdays),
        'upcomingBirthdays' => 0, // Simplified
        'recordsWithoutYear' => count(array_filter($birthdays, fn($b) => !$b['hasYear'])),
        'thisMonthBirthdays' => 0 // Simplified
    ];
    
    return response()->json([
        'data' => $stats,
        'success' => true
    ]);
});

// Settings routes
Route::get('/api/reminder-settings', function () use ($reminderSettings) {
    return response()->json([
        'data' => $reminderSettings,
        'success' => true
    ]);
});

Route::put('/api/reminder-settings', function (Request $request) use (&$reminderSettings) {
    $reminderSettings = array_merge($reminderSettings, $request->all());
    return response()->json([
        'data' => $reminderSettings,
        'success' => true,
        'message' => 'Reminder settings updated successfully'
    ]);
});

Route::get('/api/notification-settings', function () use ($notificationSettings) {
    return response()->json([
        'data' => $notificationSettings,
        'success' => true
    ]);
});

Route::put('/api/notification-settings', function (Request $request) use (&$notificationSettings) {
    $notificationSettings = array_merge($notificationSettings, $request->all());
    return response()->json([
        'data' => $notificationSettings,
        'success' => true,
        'message' => 'Notification settings updated successfully'
    ]);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'data' => [
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0'
        ],
        'success' => true
    ]);
});
```

## Testing Your API

### Using curl

```bash
# Test health check
curl -X GET http://localhost:8000/health

# Get all birthdays
curl -X GET http://localhost:8000/api/birthdays

# Create a birthday
curl -X POST http://localhost:8000/api/birthdays \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-05-15",
    "hasYear": true,
    "comment": "Test birthday"
  }'

# Update a birthday
curl -X PUT http://localhost:8000/api/birthdays/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "birthDate": "1990-05-15",
    "hasYear": true,
    "comment": "Updated birthday"
  }'

# Delete a birthday
curl -X DELETE http://localhost:8000/api/birthdays/1

# Get birthday statistics
curl -X GET http://localhost:8000/api/birthdays/stats

# Get reminder settings
curl -X GET http://localhost:8000/api/reminder-settings

# Update reminder settings
curl -X PUT http://localhost:8000/api/reminder-settings \
  -H "Content-Type: application/json" \
  -d '{
    "oneWeekBefore": true,
    "threeDaysBefore": true,
    "oneDayBefore": true,
    "onBirthday": true,
    "oneMonthBefore": false,
    "timeOfDay": "09:00"
  }'
```

### Using Postman

1. Create a new collection called "Birthday API"
2. Add requests for each endpoint
3. Set the base URL to your API server
4. Add appropriate headers and request bodies
5. Test each endpoint to ensure compatibility

## Docker Example

Create a `docker-compose.yml` file for easy API testing:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./data:/app/data
    
  frontend:
    build: ./client
    ports:
      - "5000:5000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
    depends_on:
      - api
```

Then run:
```bash
docker-compose up
```

This will start both the API and frontend services for testing.