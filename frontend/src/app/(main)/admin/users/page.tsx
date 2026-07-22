"use client";

import { useLanguage } from "@/components/language-provider";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Users className="w-8 h-8 text-[var(--color-brand-green)]" />
          {t("admin.users.title")}
        </h1>
        <p className="text-muted-foreground">{t("admin.users.desc")}</p>
      </div>

      <div className="text-center py-24 bg-muted/20 rounded-xl border border-dashed border-border/50">
        <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-1">{t("admin.users.coming_soon")}</h3>
        <p className="text-muted-foreground text-sm">{t("admin.users.coming_soon_desc")}</p>
      </div>
    </div>
  );
}
