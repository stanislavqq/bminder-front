import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, List, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { calculateAge, calculateDaysUntilBirthday, formatBirthDate } from "@/lib/date-utils";
import { insertBirthdaySchema, type Birthday, type InsertBirthday } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function BirthdayTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [skipYear, setSkipYear] = useState(false);

  const { data: birthdays, isLoading } = useQuery<Birthday[]>({
    queryKey: ['/api/birthdays'],
  });

  const form = useForm<InsertBirthday>({
    resolver: zodResolver(insertBirthdaySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      hasYear: true,
      comment: "",
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/birthdays/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/birthdays'] });
      queryClient.invalidateQueries({ queryKey: ['/api/birthdays/stats'] });
      toast({
        title: "Успешно!",
        description: "Запись удалена.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить запись.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertBirthday }) => {
      return await apiRequest("PUT", `/api/birthdays/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/birthdays'] });
      queryClient.invalidateQueries({ queryKey: ['/api/birthdays/stats'] });
      setEditingId(null);
      setSkipYear(false);
      toast({
        title: "Успешно!",
        description: "Запись обновлена.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить запись.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (birthday: Birthday) => {
    setEditingId(birthday.id);
    setSkipYear(!birthday.hasYear);
    form.reset({
      firstName: birthday.firstName,
      lastName: birthday.lastName,
      birthDate: birthday.birthDate,
      hasYear: birthday.hasYear,
      comment: birthday.comment || "",
    });
  };

  const handleSave = (data: InsertBirthday) => {
    if (editingId) {
      const formattedData = {
        ...data,
        hasYear: !skipYear,
        birthDate: skipYear ? `--${data.birthDate.slice(5)}` : data.birthDate,
      };
      updateMutation.mutate({ id: editingId, data: formattedData });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setSkipYear(false);
    form.reset();
  };

  const getDaysUntilBadgeColor = (days: number) => {
    if (days <= 7) return "bg-red-100 text-red-800";
    if (days <= 30) return "bg-amber-100 text-amber-800";
    return "bg-emerald-100 text-emerald-800";
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5 text-blue-600" />
            Все записи
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!birthdays || birthdays.length === 0) {
    return (
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5 text-blue-600" />
            Все записи
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            Записи о днях рождения не найдены. Добавьте первую запись!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5 text-blue-600" />
          Все записи
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Имя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Фамилия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Дата рождения
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Возраст
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  До дня рождения
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Комментарий
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {birthdays.map((birthday) => {
                const age = calculateAge(birthday.birthDate, birthday.hasYear);
                const daysUntil = calculateDaysUntilBirthday(birthday.birthDate, birthday.hasYear);
                const isEditing = editingId === birthday.id;
                
                return (
                  <tr key={birthday.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {isEditing ? (
                        <Input
                          {...form.register("firstName")}
                          placeholder="Имя"
                          className="w-full"
                        />
                      ) : (
                        birthday.firstName
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {isEditing ? (
                        <Input
                          {...form.register("lastName")}
                          placeholder="Фамилия"
                          className="w-full"
                        />
                      ) : (
                        birthday.lastName
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            {...form.register("birthDate")}
                            type="date"
                            className="w-full"
                          />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`skipYear-${birthday.id}`}
                              checked={skipYear}
                              onCheckedChange={(checked) => {
                                setSkipYear(checked as boolean);
                                form.setValue("hasYear", !checked);
                              }}
                            />
                            <label
                              htmlFor={`skipYear-${birthday.id}`}
                              className="text-xs text-slate-500"
                            >
                              Без года
                            </label>
                          </div>
                        </div>
                      ) : (
                        formatBirthDate(birthday.birthDate, birthday.hasYear)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {age || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getDaysUntilBadgeColor(daysUntil)}>
                        {daysUntil === 0 ? "Сегодня!" : `${daysUntil} ${daysUntil === 1 ? "день" : daysUntil < 5 ? "дня" : "дней"}`}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {isEditing ? (
                        <Textarea
                          {...form.register("comment")}
                          placeholder="Комментарий..."
                          className="w-full min-h-[60px]"
                        />
                      ) : (
                        <div className="max-w-xs truncate" title={birthday.comment || ""}>
                          {birthday.comment || "—"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={form.handleSubmit(handleSave)}
                              disabled={updateMutation.isPending}
                              className="text-green-600 hover:text-green-900 hover:bg-green-50"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(birthday)}
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Вы уверены, что хотите удалить запись о дне рождения{" "}
                                    <strong>{birthday.firstName} {birthday.lastName}</strong>?
                                    Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(birthday.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
