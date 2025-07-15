import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cake, Users, Bell, Send } from "lucide-react";
import StatisticsCards from "@/components/statistics-cards";
import BirthdayForm from "@/components/birthday-form";
import BirthdayTable from "@/components/birthday-table";
import ReminderSettings from "@/components/reminder-settings";
import NotificationSettings from "@/components/notification-settings";

export default function Home() {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Cake className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-slate-900">Управление днями рождения</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-500">
                Сегодня: <span className="font-medium">{currentDate}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="birthdays" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="birthdays" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Дни рождения
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Настройки напоминаний
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Сервисы уведомлений
            </TabsTrigger>
          </TabsList>

          <TabsContent value="birthdays" className="space-y-8">
            <StatisticsCards />
            <BirthdayForm />
            <BirthdayTable />
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
