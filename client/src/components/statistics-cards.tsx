import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, HelpCircle, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { BirthdayStats } from "@shared/schema";

export default function StatisticsCards() {
  const { data: stats, isLoading } = useQuery<BirthdayStats>({
    queryKey: ['/api/birthdays/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="text-center text-slate-500">
              Не удалось загрузить статистику
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cards = [
    {
      title: "Всего записей",
      value: stats.totalRecords,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Ближайшие (7 дней)",
      value: stats.upcomingBirthdays,
      icon: Calendar,
      color: "text-emerald-600",
    },
    {
      title: "Без года",
      value: stats.recordsWithoutYear,
      icon: HelpCircle,
      color: "text-amber-600",
    },
    {
      title: "Этот месяц",
      value: stats.thisMonthBirthdays,
      icon: CalendarDays,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">
                    {card.title}
                  </dt>
                  <dd className="text-2xl font-semibold text-slate-900">
                    {card.value}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
