import React, { useState } from "react";

// External API configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  apiKey: import.meta.env.VITE_API_KEY || "",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000", 10),
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // Birthday endpoints
  birthdays: "/api/birthdays",
  birthdayById: (id: number) => `/api/birthdays/${id}`,
  birthdayStats: "/api/birthdays/stats",
  
  // Settings endpoints
  reminderSettings: "/api/reminder-settings",
  notificationSettings: "/api/notification-settings",
};

// Error handling for API responses
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Response types for common API operations
export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

// Connection status hook
export const useAPIConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/health`, {
        method: "GET",
        headers: API_CONFIG.apiKey ? { Authorization: `Bearer ${API_CONFIG.apiKey}` } : {},
      });
      setIsConnected(response.ok);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  React.useEffect(() => {
    checkConnection();
  }, []);

  return { isConnected, isChecking, checkConnection };
};