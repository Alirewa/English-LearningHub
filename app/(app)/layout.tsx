"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DesktopSidebar, MobileSidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/layout/command-palette";
import { db, seedGrammarTopics, seedSentences, seedUserProfile } from "@/lib/db";
import { Toaster } from "sonner";
import { useAppStore } from "@/lib/store";

export const MobileMenuContext = createContext<() => void>(() => {});
export const useMobileMenu = () => useContext(MobileMenuContext);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    async function init() {
      await seedUserProfile();
      await seedGrammarTopics();
      await seedSentences();

      const profile = await db.userProfile.orderBy("id").first();
      if (!profile) return;

      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (profile.lastActiveDate === today) return;

      const newStreak = profile.lastActiveDate === yesterday ? profile.streak + 1 : 1;
      await db.userProfile.update(profile.id!, {
        lastActiveDate: today,
        streak: newStreak,
        longestStreak: Math.max(profile.longestStreak, newStreak),
      });
    }
    init();
  }, []);

  return (
    <MobileMenuContext.Provider value={() => setMobileOpen(true)}>
      <div className="flex h-screen overflow-hidden bg-background">
        <DesktopSidebar />
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <CommandPalette />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "oklch(0.135 0.006 264)",
              border: "1px solid oklch(1 0 0 / 0.08)",
              color: "oklch(0.95 0 0)",
            },
          }}
        />
      </div>
    </MobileMenuContext.Provider>
  );
}
