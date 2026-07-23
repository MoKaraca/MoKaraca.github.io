"use client";

import { useLanguage } from "@/components/language-provider";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldAlert, CheckCircle2, Bell, Clock, CalendarClock } from "lucide-react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { t } = useLanguage();
  const userStore = useAuthStore((state) => state.user);
  
  const { data: profile, isLoading } = useSWR('/users/me', api.get);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const warningsCount = profile?.warnings?.length || 0;
  const activePenalty = profile?.penalties?.[0];
  const isRestricted = profile?.accountStatus === 'RESTRICTED' || profile?.accountStatus === 'SUSPENDED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatarUrl} alt={profile?.name || "User"} />
                <AvatarFallback className="text-2xl bg-[var(--color-brand-green)] text-white">
                  {profile?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile?.name}</h2>
                <p className="text-muted-foreground">{profile?.email}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline" className="font-semibold">{profile?.role}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isRestricted ? "border-red-500 shadow-sm shadow-red-500/20" : activePenalty ? "border-amber-500" : ""}>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={isRestricted ? "destructive" : activePenalty ? "default" : "outline"} className={activePenalty && !isRestricted ? "bg-amber-500" : ""}>
                {profile?.accountStatus}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Warnings</span>
              <span className={`font-semibold ${warningsCount >= 2 ? 'text-red-500' : ''}`}>{warningsCount} / 3</span>
            </div>

            {activePenalty && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-4 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">Borrowing Suspended</p>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                      Until {new Date(activePenalty.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {isRestricted && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-4 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">Account Restricted</p>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                      Please contact an administrator to reinstate your privileges.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <CardTitle>Recent Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {profile?.notifications?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent notifications</p>
          ) : (
            <div className="space-y-4">
              {profile?.notifications?.map((notif: any) => (
                <div key={notif.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-full ${
                    notif.type.includes('DUE') ? 'bg-amber-100 text-amber-600' :
                    notif.type.includes('OVERDUE') ? 'bg-red-100 text-red-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {notif.type.includes('DUE') ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{notif.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
