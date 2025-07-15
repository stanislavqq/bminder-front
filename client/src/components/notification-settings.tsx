import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Save, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertNotificationSettingsSchema, type NotificationSettings, type InsertNotificationSettings } from "@shared/schema";

export default function NotificationSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<NotificationSettings>({
    queryKey: ['/api/notification-settings'],
  });

  const form = useForm<InsertNotificationSettings>({
    resolver: zodResolver(insertNotificationSettingsSchema),
    defaultValues: {
      service: "telegram",
      telegramBotToken: "",
      telegramChatId: "",
      emailAddress: "",
      vkAccessToken: "",
      vkUserId: "",
    },
  });

  // Reset form when settings are loaded
  useEffect(() => {
    if (settings && !form.formState.isDirty) {
      form.reset(settings);
    }
  }, [settings, form]);

  const selectedService = form.watch("service");

  const updateMutation = useMutation({
    mutationFn: async (data: InsertNotificationSettings) => {
      return await apiRequest("PUT", "/api/notification-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-settings'] });
      toast({
        title: "Успешно!",
        description: "Настройки уведомлений сохранены.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки уведомлений.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertNotificationSettings) => {
    updateMutation.mutate(data);
  };

  const handleTestNotification = () => {
    toast({
      title: "Тестовое уведомление",
      description: "Функция тестирования уведомлений будет реализована в будущем.",
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            Сервисы уведомлений
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center p-4 border border-slate-200 rounded-lg">
                <Skeleton className="h-4 w-4 rounded-full mr-4" />
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded mr-3" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  const services = [
    {
      value: "telegram",
      label: "Telegram Bot",
      description: "Уведомления через Telegram бота",
      icon: MessageCircle,
      color: "text-blue-500",
    },
    {
      value: "email",
      label: "Email",
      description: "Уведомления по электронной почте",
      icon: Mail,
      color: "text-emerald-500",
    },
    {
      value: "vk",
      label: "ВКонтакте",
      description: "Уведомления через ВКонтакте",
      icon: MessageCircle,
      color: "text-blue-600",
    },
  ];

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-600" />
          Сервисы уведомлений
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <p className="text-sm text-slate-600 mb-4">
                Выберите сервис для отправки уведомлений о днях рождения:
              </p>
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-4"
                      >
                        {services.map((service) => (
                          <div key={service.value} className="flex items-center space-x-3">
                            <RadioGroupItem
                              value={service.value}
                              id={service.value}
                              className="mt-1"
                            />
                            <label
                              htmlFor={service.value}
                              className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200 cursor-pointer flex-1"
                            >
                              <service.icon className={`h-8 w-8 ${service.color} mr-3`} />
                              <div>
                                <span className="text-sm font-medium text-slate-900">
                                  {service.label}
                                </span>
                                <p className="text-xs text-slate-500">{service.description}</p>
                              </div>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Service-specific configuration */}
            {selectedService === "telegram" && (
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-900 mb-3">
                  Настройка Telegram Bot
                </h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="telegramBotToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Token</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456789:AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRsst"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telegramChatId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chat ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456789"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {selectedService === "email" && (
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Настройка Email</h3>
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email адрес</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your-email@example.com"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {selectedService === "vk" && (
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-900 mb-3">
                  Настройка ВКонтакте
                </h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="vkAccessToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Token</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="vk1.a.AbCdEfGhIjKlMnOpQrStUvWxYz"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vkUserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456789"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
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
              <Button
                type="button"
                variant="outline"
                onClick={handleTestNotification}
                className="w-full md:w-auto"
              >
                <Send className="h-4 w-4 mr-2" />
                Тестовое уведомление
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
