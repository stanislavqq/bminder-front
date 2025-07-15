import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBirthdaySchema, type InsertBirthday } from "@shared/schema";
import { formatDateForInput } from "@/lib/date-utils";

const formSchema = insertBirthdaySchema.extend({
  birthDate: insertBirthdaySchema.shape.birthDate,
});

export default function BirthdayForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [skipYear, setSkipYear] = useState(false);

  const form = useForm<InsertBirthday>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      hasYear: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBirthday) => {
      return await apiRequest("POST", "/api/birthdays", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/birthdays'] });
      queryClient.invalidateQueries({ queryKey: ['/api/birthdays/stats'] });
      form.reset();
      setSkipYear(false);
      toast({
        title: "Успешно!",
        description: "Запись о дне рождения добавлена.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить запись о дне рождении.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBirthday) => {
    const formattedData = {
      ...data,
      hasYear: !skipYear,
      birthDate: skipYear ? `--${data.birthDate.slice(5)}` : data.birthDate,
    };
    createMutation.mutate(formattedData);
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          Добавить новую запись
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя *</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия *</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванов" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата рождения *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (skipYear && value) {
                            // Remove year prefix for display
                            value = `2000-${value.slice(5)}`;
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipYear"
                checked={skipYear}
                onCheckedChange={(checked) => {
                  setSkipYear(checked as boolean);
                  if (checked) {
                    form.setValue("hasYear", false);
                  } else {
                    form.setValue("hasYear", true);
                  }
                }}
              />
              <label
                htmlFor="skipYear"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Не указывать год
              </label>
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full md:w-auto"
            >
              {createMutation.isPending ? (
                <>Добавление...</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
