"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeftRight, Clock, AlertTriangle } from "lucide-react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useLanguage } from "@/components/language-provider";
import { toast } from "sonner";

export default function AdminReturnsPage() {
  const { t } = useLanguage();
  // Fetch all borrows, then filter active/overdue
  const { data: allBorrows, isLoading, mutate } = useSWR('/borrows', api.get);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const activeBorrows = allBorrows?.filter((b: any) => 
    b.status === "ACTIVE" || b.status === "OVERDUE"
  ) || [];

  const handleReturn = async (id: string) => {
    setProcessingId(id);
    try {
      await api.post(`/borrows/${id}/return`);
      toast.success("Book returned successfully");
      mutate();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to return book");
    } finally {
      setProcessingId(null);
    }
  };

  const calculateDaysLeft = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("admin.returns.title")}</h1>
        <p className="text-muted-foreground">{t("admin.returns.desc")}</p>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="rtl:text-right">{t("admin.returns.table.student")}</TableHead>
              <TableHead className="rtl:text-right">{t("admin.returns.table.book")}</TableHead>
              <TableHead className="rtl:text-right">{t("admin.returns.table.borrow_date")}</TableHead>
              <TableHead className="rtl:text-right">{t("admin.returns.table.due_date")}</TableHead>
              <TableHead className="rtl:text-right">{t("admin.returns.table.status")}</TableHead>
              <TableHead className="text-right rtl:text-left">{t("admin.returns.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : activeBorrows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  {t("admin.returns.empty")}
                </TableCell>
              </TableRow>
            ) : (
              activeBorrows.map((req: any) => {
                const daysLeft = calculateDaysLeft(req.dueDate);
                const isLate = daysLeft < 0;

                return (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium">{req.user?.name}</div>
                      <div className="text-xs text-muted-foreground">{req.user?.email}</div>
                    </TableCell>
                    <TableCell className="font-medium">{req.book?.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(req.borrowedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center ${isLate ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                        {new Date(req.dueDate).toLocaleDateString()}
                        {isLate && <AlertTriangle className="w-4 h-4 ml-2" />}
                      </div>
                      <div className={`text-xs ${isLate ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {isLate ? `${Math.abs(daysLeft)} ${t("admin.returns.days_overdue")}` : `${daysLeft} ${t("admin.returns.days_left")}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        isLate 
                          ? "bg-red-50 text-red-700 border-red-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }>
                        {isLate ? t("admin.returns.overdue") : t("admin.returns.active")}
                      </Badge>
                      {req.isExtended && (
                         <Badge variant="secondary" className="ml-2 text-[10px]">{t("admin.returns.extended")}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        className="bg-[var(--color-brand-green)] text-white hover:bg-[#15462a]"
                        onClick={() => handleReturn(req.id)}
                        disabled={processingId === req.id}
                      >
                        <ArrowLeftRight className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" /> {t("admin.returns.action.return")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
