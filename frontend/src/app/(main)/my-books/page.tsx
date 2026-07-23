"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CalendarClock, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";

import useSWR from "swr";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function MyBooksPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("active");

  const { data: borrows, error, isLoading, mutate } = useSWR('/borrows/my', api.get);

  const activeBorrows = borrows?.filter((b: any) => b.status === "ACTIVE" || b.status === "OVERDUE" || b.status === "DUE_SOON" || b.status === "PENDING") || [];
  const pastBorrows = borrows?.filter((b: any) => b.status === "RETURNED") || [];



  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
  };

  const calculateDaysLeft = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("borrows.title")}</h1>
        <p className="text-muted-foreground">{t("borrows.desc")}</p>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-muted/50 p-1">
          <TabsTrigger value="active" className="rounded-sm">{t("borrows.tab.active")}</TabsTrigger>
          <TabsTrigger value="history" className="rounded-sm">{t("borrows.tab.history")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : activeBorrows.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No active borrows</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeBorrows.map((borrow: any) => {
              const isPending = borrow.status === "PENDING";
              const daysLeft = isPending ? 0 : calculateDaysLeft(borrow.dueDate);
              const isDueSoon = !isPending && daysLeft <= 3;

              return (
                <Card key={borrow.id} className={`overflow-hidden border-muted/50 shadow-sm ${isDueSoon ? 'border-amber-500/30' : ''}`}>
                  <CardHeader className="pb-4 border-b bg-muted/20">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-16 bg-muted rounded-md flex items-center justify-center border shadow-sm">
                          <BookOpen className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                        <div>
                          <CardTitle className="text-lg line-clamp-1">{borrow.book?.title}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-1">{borrow.book?.author}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-5">
                    {isPending ? (
                      <div className="flex flex-col items-center justify-center py-6 text-amber-600 dark:text-amber-500 space-y-2">
                        <Clock className="w-8 h-8 animate-pulse opacity-50" />
                        <p className="font-medium">{t("borrows.status.pending") || "Pending Approval"}</p>
                        <p className="text-xs text-muted-foreground text-center">Your request is waiting for administrator approval.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> {t("borrows.borrowed")}</p>
                            <p className="text-sm font-medium">{formatDate(borrow.borrowedAt)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className={`text-xs uppercase flex items-center gap-1 ${isDueSoon ? 'text-amber-600 dark:text-amber-500 font-semibold' : 'text-muted-foreground'}`}>
                              <CalendarClock className="w-3 h-3" /> {t("borrows.due")}
                            </p>
                            <p className={`text-sm font-medium ${isDueSoon ? 'text-amber-600 dark:text-amber-500' : ''}`}>
                              {formatDate(borrow.dueDate)} {t("borrows.days_left").replace("{days}", String(daysLeft))}
                            </p>
                          </div>
                        </div>
                        
                        {borrow.extensionRequested && (
                          <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-2 text-sm">
                            {borrow.extensionStatus === "PENDING" ? (
                               <Clock className="w-4 h-4 text-amber-500 mt-0.5" />
                            ) : (
                               <CheckCircle2 className="w-4 h-4 text-[var(--color-brand-green)] mt-0.5" />
                            )}
                            <div>
                              <p className="font-medium text-foreground">{t("borrows.ext_req")}</p>
                              <p className="text-muted-foreground text-xs">{t("borrows.status")} {borrow.extensionStatus}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex gap-3 pt-2">
                      {!isPending && (
                        <Link href={`/reader/${borrow.bookId}`} className="flex-1">
                          <Button className="w-full bg-[var(--color-brand-green)] hover:bg-[#15462a] text-white">
                            {t("borrows.btn.read")}
                          </Button>
                        </Link>
                      )}
                      
                      {!borrow.extensionRequested && !isPending && daysLeft <= 7 && (
                        <Button variant="ghost" size="icon" className="border text-muted-foreground hover:text-[var(--color-brand-gold)] border-border" title="Request Extension">
                          <CalendarClock className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card className="border-muted/50 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="rtl:text-right">{t("borrows.table.book")}</TableHead>
                  <TableHead className="rtl:text-right">{t("borrows.table.borrow_date")}</TableHead>
                  <TableHead className="rtl:text-right">{t("borrows.table.return_date")}</TableHead>
                  <TableHead className="rtl:text-right">{t("borrows.table.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                ) : pastBorrows.map((borrow: any) => (
                  <TableRow key={borrow.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{borrow.book?.title}</p>
                      <p className="text-xs text-muted-foreground">{borrow.book?.author}</p>
                    </TableCell>
                    <TableCell>{formatDate(borrow.borrowedAt)}</TableCell>
                    <TableCell>{borrow.returnedAt ? formatDate(borrow.returnedAt) : "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted font-normal text-muted-foreground">
                        {borrow.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
