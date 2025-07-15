import { 
  birthdays, 
  reminderSettings, 
  notificationSettings,
  type Birthday, 
  type InsertBirthday,
  type ReminderSettings,
  type InsertReminderSettings,
  type NotificationSettings,
  type InsertNotificationSettings,
  type BirthdayStats
} from "@shared/schema";

export interface IStorage {
  // Birthday operations
  getBirthdays(): Promise<Birthday[]>;
  getBirthday(id: number): Promise<Birthday | undefined>;
  createBirthday(birthday: InsertBirthday): Promise<Birthday>;
  deleteBirthday(id: number): Promise<void>;
  getBirthdayStats(): Promise<BirthdayStats>;
  
  // Reminder settings operations
  getReminderSettings(): Promise<ReminderSettings>;
  updateReminderSettings(settings: InsertReminderSettings): Promise<ReminderSettings>;
  
  // Notification settings operations
  getNotificationSettings(): Promise<NotificationSettings>;
  updateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
}

export class MemStorage implements IStorage {
  private birthdays: Map<number, Birthday>;
  private reminderSettings: ReminderSettings;
  private notificationSettings: NotificationSettings;
  private currentBirthdayId: number;

  constructor() {
    this.birthdays = new Map();
    this.currentBirthdayId = 1;
    
    // Default reminder settings
    this.reminderSettings = {
      id: 1,
      oneWeekBefore: true,
      threeDaysBefore: false,
      oneDayBefore: true,
      onBirthday: true,
      oneMonthBefore: false,
      timeOfDay: "10:00",
    };
    
    // Default notification settings
    this.notificationSettings = {
      id: 1,
      service: "telegram",
      telegramBotToken: null,
      telegramChatId: null,
      emailAddress: null,
      vkAccessToken: null,
      vkUserId: null,
    };
  }

  async getBirthdays(): Promise<Birthday[]> {
    return Array.from(this.birthdays.values()).sort((a, b) => {
      // Sort by month and day for upcoming birthdays
      const aDate = new Date(a.hasYear ? a.birthDate : `2000-${a.birthDate.slice(2)}`);
      const bDate = new Date(b.hasYear ? b.birthDate : `2000-${b.birthDate.slice(2)}`);
      return aDate.getMonth() - bDate.getMonth() || aDate.getDate() - bDate.getDate();
    });
  }

  async getBirthday(id: number): Promise<Birthday | undefined> {
    return this.birthdays.get(id);
  }

  async createBirthday(insertBirthday: InsertBirthday): Promise<Birthday> {
    const id = this.currentBirthdayId++;
    const birthday: Birthday = {
      ...insertBirthday,
      id,
      createdAt: new Date(),
    };
    this.birthdays.set(id, birthday);
    return birthday;
  }

  async deleteBirthday(id: number): Promise<void> {
    this.birthdays.delete(id);
  }

  async getBirthdayStats(): Promise<BirthdayStats> {
    const allBirthdays = Array.from(this.birthdays.values());
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    
    let upcomingBirthdays = 0;
    let recordsWithoutYear = 0;
    let thisMonthBirthdays = 0;
    
    allBirthdays.forEach(birthday => {
      if (!birthday.hasYear) {
        recordsWithoutYear++;
      }
      
      const birthDate = new Date(birthday.hasYear ? birthday.birthDate : `2000-${birthday.birthDate.slice(2)}`);
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();
      
      // Check if birthday is in current month
      if (birthMonth === currentMonth) {
        thisMonthBirthdays++;
      }
      
      // Check if birthday is in next 7 days
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const thisYearBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }
      
      if (thisYearBirthday <= nextWeek) {
        upcomingBirthdays++;
      }
    });
    
    return {
      totalRecords: allBirthdays.length,
      upcomingBirthdays,
      recordsWithoutYear,
      thisMonthBirthdays,
    };
  }

  async getReminderSettings(): Promise<ReminderSettings> {
    return this.reminderSettings;
  }

  async updateReminderSettings(settings: InsertReminderSettings): Promise<ReminderSettings> {
    this.reminderSettings = { ...this.reminderSettings, ...settings };
    return this.reminderSettings;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    return this.notificationSettings;
  }

  async updateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    this.notificationSettings = { ...this.notificationSettings, ...settings };
    return this.notificationSettings;
  }
}

export const storage = new MemStorage();
