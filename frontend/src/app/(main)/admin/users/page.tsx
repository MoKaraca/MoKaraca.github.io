"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Users, Loader2, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { data: users, isLoading, mutate } = useSWR('/admin/users', api.get);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      toast.success("Account status updated");
      mutate();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Users className="w-8 h-8 text-[var(--color-brand-green)]" />
          {t("admin.users.title")}
        </h1>
        <p className="text-muted-foreground">{t("admin.users.desc")}</p>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Warnings</TableHead>
              <TableHead>Active Penalties</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.accountStatus === 'ACTIVE' ? 'outline' : 'destructive'}>
                      {user.accountStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${user.warnings.length >= 2 ? 'text-red-500' : ''}`}>
                      {user.warnings.length} / 3
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.penalties.length > 0 ? (
                      <span className="text-red-500 text-sm">{user.penalties.length} Active</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {user.accountStatus !== 'ACTIVE' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600"
                          onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}
                          disabled={processingId === user.id}
                        >
                          Reinstate
                        </Button>
                      )}
                      {user.accountStatus !== 'RESTRICTED' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleUpdateStatus(user.id, 'RESTRICTED')}
                          disabled={processingId === user.id}
                        >
                          Restrict
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
