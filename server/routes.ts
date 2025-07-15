import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBirthdaySchema, insertReminderSettingsSchema, insertNotificationSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Birthday routes
  app.get("/api/birthdays", async (req, res) => {
    try {
      const birthdays = await storage.getBirthdays();
      res.json(birthdays);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch birthdays" });
    }
  });

  app.post("/api/birthdays", async (req, res) => {
    try {
      const validatedData = insertBirthdaySchema.parse(req.body);
      const birthday = await storage.createBirthday(validatedData);
      res.status(201).json(birthday);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid birthday data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create birthday" });
      }
    }
  });

  app.put("/api/birthdays/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid birthday ID" });
      }
      
      const validatedData = insertBirthdaySchema.parse(req.body);
      const birthday = await storage.updateBirthday(id, validatedData);
      res.json(birthday);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid birthday data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: "Birthday not found" });
      } else {
        res.status(500).json({ message: "Failed to update birthday" });
      }
    }
  });

  app.delete("/api/birthdays/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid birthday ID" });
      }
      
      await storage.deleteBirthday(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete birthday" });
    }
  });

  app.get("/api/birthdays/stats", async (req, res) => {
    try {
      const stats = await storage.getBirthdayStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch birthday statistics" });
    }
  });

  // Reminder settings routes
  app.get("/api/reminder-settings", async (req, res) => {
    try {
      const settings = await storage.getReminderSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminder settings" });
    }
  });

  app.put("/api/reminder-settings", async (req, res) => {
    try {
      const validatedData = insertReminderSettingsSchema.parse(req.body);
      const settings = await storage.updateReminderSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid reminder settings", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update reminder settings" });
      }
    }
  });

  // Notification settings routes
  app.get("/api/notification-settings", async (req, res) => {
    try {
      const settings = await storage.getNotificationSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  app.put("/api/notification-settings", async (req, res) => {
    try {
      const validatedData = insertNotificationSettingsSchema.parse(req.body);
      const settings = await storage.updateNotificationSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid notification settings", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update notification settings" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
