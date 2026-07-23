"use client";

import { useState, useEffect } from "react";

import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun, Search, LogOut, Settings, User as UserIcon, Globe, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useSocket } from "@/lib/hooks/useSocket";
import { toast } from "sonner";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const getLocalizedMessage = (type: string, englishMsg: string, language: string) => {
    const match = englishMsg.match(/"([^"]+)"/);
    const bookTitle = match ? match[1] : '';
    
    if (language === 'en') return englishMsg;
  
    switch(type) {
      case 'DUE_REMINDER':
        if (englishMsg.includes('7 days')) return `كتابك المستعار "${bookTitle}" يستحق الإرجاع خلال 7 أيام.`;
        if (englishMsg.includes('3 days')) return `تذكير: كتابك المستعار "${bookTitle}" يستحق الإرجاع خلال 3 أيام.`;
        if (englishMsg.includes('tomorrow')) return `كتابك المستعار "${bookTitle}" يجب إرجاعه غداً.`;
        break;
      case 'DUE_TODAY':
        return `كتابك المستعار "${bookTitle}" يجب إرجاعه اليوم.`;
      case 'OVERDUE':
        return `انتهت فترة استعارة "${bookTitle}". يرجى إرجاعه فوراً.`;
      case 'SYSTEM':
        if (englishMsg.includes('expired')) return 'انتهت فترة العقوبة. يمكنك الآن استعارة الكتب مجدداً.';
        if (englishMsg.includes('Penalty Applied')) return 'قمت بإرجاع كتاب متأخراً. تم تطبيق عقوبة حرمان من الاستعارة لمدة 30 يوماً.';
        break;
      case 'BOOK_RETURNED':
        return `تم تسجيل إرجاعك لكتاب "${bookTitle}" بنجاح.`;
      case 'EXTENSION_APPROVED':
        const dateMatch = englishMsg.match(/is (.*)\./);
        const date = dateMatch ? dateMatch[1] : '';
        return `تمت الموافقة على طلب تمديد استعارة "${bookTitle}". تاريخ الاستحقاق الجديد هو ${date}.`;
      case 'EXTENSION_REJECTED':
        return `تم رفض طلب تمديد استعارة "${bookTitle}".`;
    }
    return englishMsg;
  };

  const { liveNotifications, clearNotifications } = useSocket();
  const { data: pastNotifications, mutate } = useSWR(user ? '/notifications' : null, api.get);

  useEffect(() => {
    setMounted(true);
    
    const handleNewNotification = (e: any) => {
      const data = e.detail;
      toast.success(data.title, {
        description: data.message,
      });
    };

    window.addEventListener('new-notification', handleNewNotification);
    return () => window.removeEventListener('new-notification', handleNewNotification);
  }, []);

  const allNotifications = [...liveNotifications, ...(pastNotifications || [])];
  const unreadCount = allNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    if (!id) return;
    try {
      await api.patch(`/notifications/${id}/read`);
      mutate();
    } catch(e) {}
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 gap-4">
        <div className="flex-1 flex items-center gap-2">
          {/* Spacer */}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 rtl:gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="rounded-full font-bold"
            title="Toggle Language"
          >
            {language === "en" ? "AR" : "EN"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {mounted ? (
              theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-full outline-none hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-brand-gold)]" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal flex justify-between items-center">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-[var(--color-brand-green)]/10 text-[var(--color-brand-green)] px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {allNotifications.length > 0 ? (
                  allNotifications.slice(0, 10).map((notif: any, i: number) => (
                    <DropdownMenuItem key={notif.id || `live-${i}`} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => handleMarkAsRead(notif.id)}>
                      <div className="flex w-full justify-between gap-2">
                        <span className={`font-semibold text-sm ${!notif.read ? 'text-[var(--color-brand-green)]' : ''}`}>{t(`notif.${notif.type}.title`) || notif.title}</span>
                        {!notif.read && <span className="h-2 w-2 rounded-full bg-[var(--color-brand-gold)] mt-1 shrink-0" />}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 line-clamp-2">{getLocalizedMessage(notif.type, notif.message, language)}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
                <AvatarFallback className="bg-[var(--color-brand-green)] text-white">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive rtl:flex-row-reverse">
                <LogOut className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                <span>{t("action.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
