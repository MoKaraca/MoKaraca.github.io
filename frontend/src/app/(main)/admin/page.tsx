"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ArrowUpRight, ArrowDownRight, Clock, BookMarked, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from "@/components/language-provider";
import useSWR from "swr";
import { api } from "@/lib/api";

const COLORS = ['#1B5E3A', '#B8955A', '#F5F1EB', '#111111'];

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const { data: stats, isLoading, error } = useSWR('/admin/stats', api.get);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-brand-green)]" />
      </div>
    );
  }

  if (error || !stats) {
    return <div className="p-8 text-red-500">Failed to load statistics</div>;
  }
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("admin.title")}</h1>
        <p className="text-muted-foreground">{t("admin.desc")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.stats.total")}</CardTitle>
            <BookOpen className="h-4 w-4 text-[var(--color-brand-green)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600 dark:text-green-400">
              <ArrowUpRight className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" /> +12 this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.stats.active")}</CardTitle>
            <BookMarked className="h-4 w-4 text-[var(--color-brand-green)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBorrows}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600 dark:text-green-400">
              <ArrowUpRight className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" /> +18% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.stats.users")}</CardTitle>
            <Users className="h-4 w-4 text-[var(--color-brand-green)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-red-600 dark:text-red-400">
              <ArrowDownRight className="h-3 w-3 mr-1 rtl:mr-0 rtl:ml-1" /> -2% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.stats.overdue")}</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueBooks}</div>
            <p className="text-xs text-muted-foreground mt-1 text-amber-600">
              {t("admin.stats.attention")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-border/50">
          <CardHeader>
            <CardTitle>{t("admin.charts.trends")}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.borrowTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="borrows" stroke="var(--color-brand-green)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-brand-green)" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle>{t("admin.charts.category")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 flex-wrap mt-4">
              {stats.categoryDistribution.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground">
                    {t(
                      entry.name === "CS" ? "cat.cs" :
                      entry.name === "Engineering" ? "cat.engineering" :
                      entry.name === "Literature" ? "cat.literature" :
                      entry.name === "Business" ? "cat.business" : entry.name
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
