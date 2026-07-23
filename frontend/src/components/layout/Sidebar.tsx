"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  BookOpen,
  Library,
  Clock,
  Bookmark,
  LayoutDashboard,
  Users,
  Settings,
  BookMarked,
  Inbox,
  ArrowLeftRight
} from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/language-provider";

const mainNavItems = [
  { title: "nav.home", icon: Library, href: "/home" },
  { title: "nav.browse", icon: BookOpen, href: "/books" },
  { title: "nav.borrows", icon: Clock, href: "/my-books" },
  { title: "nav.bookmarks", icon: Bookmark, href: "/bookmarks" },
];

const adminNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Requests", icon: Inbox, href: "/admin/requests" },
  { title: "Returns", icon: ArrowLeftRight, href: "/admin/returns" },
  { title: "nav.manage_books", icon: BookMarked, href: "/admin/books" },
  { title: "nav.users", icon: Users, href: "/admin/users" },
  { title: "nav.settings", icon: Settings, href: "/admin/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { t } = useLanguage();
  
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <div className="hidden border-r bg-card/50 md:block w-64 lg:w-72 flex-shrink-0 h-[calc(100vh)] sticky top-0 flex flex-col">
      {/* Branding */}
      <div className="h-16 flex items-center px-6 border-b pt-2 pb-2">
        <Link href="/home" className="flex items-center gap-3 font-semibold">
          <div className="w-10 h-10 relative bg-white/10 rounded-xl flex items-center justify-center rtl:ml-2 shadow-sm border border-border/50">
            <Image src="/logo.png" alt="Logo" width={28} height={28} />
          </div>
          <span className="text-[var(--color-brand-green)] tracking-tight text-lg">{t("app.title")}</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 py-6 px-4">
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
              {t("nav.library")}
            </h4>
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname.startsWith(item.href) ? "bg-[var(--color-brand-green)] text-white hover:bg-[var(--color-brand-green)] hover:text-white shadow-sm" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4 rtl:ml-2" />
                {t(item.title)}
              </Link>
            ))}
          </div>

          {isAdmin && (
            <div className="space-y-1 mt-6">
              <h4 className="px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                {t("nav.admin")}
              </h4>
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)) ? "bg-[var(--color-brand-gold)] text-white hover:bg-[var(--color-brand-gold)] hover:text-white shadow-sm" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 rtl:ml-2" />
                  {t(item.title)}
                </Link>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
