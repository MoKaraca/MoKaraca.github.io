"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Loader2, Clock, CalendarClock } from "lucide-react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useLanguage } from "@/components/language-provider";
import { toast } from "sonner";

export default function AdminBorrowRequestsPage() {
  const { t } = useLanguage();
  const { data: requests, isLoading, mutate } = useSWR('/borrows?status=PENDING', api.get);
  const { data: extensions, isLoading: isLoadingExt, mutate: mutateExt } = useSWR('/borrows/extensions/pending', api.get);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingRequests = requests || [];
  const pendingExtensions = extensions || [];

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/borrows/${id}/approve`);
      toast.success(t("admin.requests.msg.approved"));
      mutate();
    } catch (e) {
      toast.error("Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/borrows/${id}/reject`);
      toast.success(t("admin.requests.msg.rejected"));
      mutate();
    } catch (e) {
      toast.error("Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveExt = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/borrows/extensions/${id}/approve`);
      toast.success("Extension approved");
      mutateExt();
    } catch (e) {
      toast.error("Failed to approve extension");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectExt = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/borrows/extensions/${id}/reject`);
      toast.success("Extension rejected");
      mutateExt();
    } catch (e) {
      toast.error("Failed to reject extension");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("admin.requests.title")}</h1>
        <p className="text-muted-foreground">{t("admin.requests.desc")}</p>
      </div>

      <Tabs defaultValue="borrows">
        <TabsList className="mb-4">
          <TabsTrigger value="borrows">Borrow Requests ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="extensions">Extension Requests ({pendingExtensions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="borrows">
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.requests.table.user")}</TableHead>
                  <TableHead>{t("admin.requests.table.book")}</TableHead>
                  <TableHead>{t("admin.requests.table.date")}</TableHead>
                  <TableHead>{t("admin.requests.table.status")}</TableHead>
                  <TableHead className="text-right">{t("admin.requests.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      {t("admin.requests.empty")}
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((req: any) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="font-medium">{req.user?.name}</div>
                        <div className="text-xs text-muted-foreground">{req.user?.email}</div>
                      </TableCell>
                      <TableCell className="font-medium">{req.book?.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400">
                          {t("admin.requests.status.pending")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(req.id)}
                            disabled={processingId === req.id}
                          >
                            <X className="w-4 h-4 mr-1" /> {t("admin.requests.action.reject")}
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-[var(--color-brand-green)] text-white hover:bg-[#15462a]"
                            onClick={() => handleApprove(req.id)}
                            disabled={processingId === req.id}
                          >
                            <Check className="w-4 h-4 mr-1" /> {t("admin.requests.action.approve")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="extensions">
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingExt ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : pendingExtensions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No pending extension requests.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingExtensions.map((ext: any) => (
                    <TableRow key={ext.id}>
                      <TableCell>
                        <div className="font-medium">{ext.user?.name}</div>
                        <div className="text-xs text-muted-foreground">{ext.user?.email}</div>
                      </TableCell>
                      <TableCell className="font-medium">{ext.borrowRecord?.book?.title}</TableCell>
                      <TableCell>
                        <p className="text-sm italic text-muted-foreground max-w-[250px] truncate">{ext.reason || "No reason provided."}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <CalendarClock className="w-4 h-4 mr-1" />
                          {new Date(ext.requestedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRejectExt(ext.id)}
                            disabled={processingId === ext.id}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-[var(--color-brand-green)] text-white hover:bg-[#15462a]"
                            onClick={() => handleApproveExt(ext.id)}
                            disabled={processingId === ext.id}
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
