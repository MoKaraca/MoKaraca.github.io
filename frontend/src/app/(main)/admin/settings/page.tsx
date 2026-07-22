"use client";

import { useLanguage } from "@/components/language-provider";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8 text-[var(--color-brand-green)]" />
          System {t("nav.settings")}
        </h1>
        <p className="text-muted-foreground">Configure global application settings and library defaults.</p>
      </div>

      <div className="text-center py-24 bg-muted/20 rounded-xl border border-dashed border-border/50">
        <Settings className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-1">System Settings Module Coming Soon</h3>
        <p className="text-muted-foreground text-sm">This module is scheduled for a future update.</p>
      </div>
    </div>
  );
}
