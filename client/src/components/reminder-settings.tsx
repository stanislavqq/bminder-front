import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Save, Calendar, CalendarDays, CalendarCheck, Cake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertReminderSettingsSchema, type ReminderSettings, type InsertReminderSettings } from "@shared/schema";

export default function ReminderSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<ReminderSettings>({
    queryKey: ['/api/reminder-settings'],
  });

  const form = useForm<InsertReminderSettings>({
    resolver: zodResolver(insertReminderSettingsSchema),
    defaultValues: {
      oneWeekBefore: false,
      threeDaysBefore: false,
      oneDayBefore: false,
      onBirthday: false,
      oneMonthBefore: false,
      timeOfDay: "10:00",
    },
  });

  // Reset form when settings are loaded
  if (settings && !form.formState.isDirty) {
    form.reset(settings);
  }

  const updateMutation = useMutation({
    mutationFn: async (data: InsertReminderSettings) => {
      return await apiRequest("PUT", "/api/reminder-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminder-settings'] });
      toast({
        title: "Успешно!",
        description: "Настройки напоминаний сохранены.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки напоминаний.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertReminderSettings) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Настройки напоминаний
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  const reminderOptions = [
    {
      name: "oneWeekBefore",
      label: "За неделю (7 дней)",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      name: "threeDaysBefore",
      label: "За 3 дня",
      icon: CalendarDays,
      color: "text-emerald-600",
    },
    {
      name: "oneDayBefore",
      label: "За день",
      icon: CalendarCheck,
      color: "text-amber-600",
    },
    {
      name: "onBirthday",
      label: "В день рождения",
      icon: Cake,
      color: "text-purple-600",
    },
    {
      name: "oneMonthBefore",
      label: "За месяц",
      icon: Calendar,
      color: "text-red-600",
    },
  ];

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Настройки напоминаний
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <p className="text-sm text-slate-600 mb-4">
                Выберите, за какое время до дня рождения присылать напоминания:
              </p>
              <div className="space-y-3">
                {reminderOptions.map((option) => (
                  <FormField
                    key={option.name}
                    control={form.control}
                    name={option.name as keyof InsertReminderSettings}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="flex items-center gap-2 text-sm font-normal">
                          <option.icon className={`h-4 w-4 ${option.color}`} />
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <FormField
                control={form.control}
                name="timeOfDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Время отправки напоминаний</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="12:00">12:00</SelectItem>
                        <SelectItem value="15:00">15:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                        <SelectItem value="20:00">20:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full md:w-auto"
            >
              {updateMutation.isPending ? (
                <>Сохранение...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить настройки
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
