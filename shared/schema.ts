import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const birthdays = pgTable("birthdays", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthDate: text("birth_date").notNull(), // Format: YYYY-MM-DD or --MM-DD for no year
  hasYear: boolean("has_year").notNull().default(true),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reminderSettings = pgTable("reminder_settings", {
  id: serial("id").primaryKey(),
  oneWeekBefore: boolean("one_week_before").notNull().default(false),
  threeDaysBefore: boolean("three_days_before").notNull().default(false),
  oneDayBefore: boolean("one_day_before").notNull().default(false),
  onBirthday: boolean("on_birthday").notNull().default(false),
  oneMonthBefore: boolean("one_month_before").notNull().default(false),
  timeOfDay: text("time_of_day").notNull().default("10:00"),
});

export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  service: text("service").notNull().default("telegram"), // telegram, email, vk
  telegramBotToken: text("telegram_bot_token"),
  telegramChatId: text("telegram_chat_id"),
  emailAddress: text("email_address"),
  vkAccessToken: text("vk_access_token"),
  vkUserId: text("vk_user_id"),
});

export const insertBirthdaySchema = createInsertSchema(birthdays).omit({
  id: true,
  createdAt: true,
});

export const insertReminderSettingsSchema = createInsertSchema(reminderSettings).omit({
  id: true,
});

export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).omit({
  id: true,
});

export type InsertBirthday = z.infer<typeof insertBirthdaySchema>;
export type Birthday = typeof birthdays.$inferSelect;
export type InsertReminderSettings = z.infer<typeof insertReminderSettingsSchema>;
export type ReminderSettings = typeof reminderSettings.$inferSelect;
export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;
export type NotificationSettings = typeof notificationSettings.$inferSelect;

// For statistics
export type BirthdayStats = {
  totalRecords: number;
  upcomingBirthdays: number;
  recordsWithoutYear: number;
  thisMonthBirthdays: number;
};
