"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, CreditCard, MessageSquare,
  GraduationCap, FileText, PenLine, Mic, CalendarDays,
  BarChart3, Trophy, Sparkles, ChevronLeft, Flame, Star, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

const NAV_ITEMS = [
  {
    group: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    group: "Learn",
    items: [
      { href: "/vocabulary", label: "Vocabulary", icon: BookOpen },
      { href: "/flashcards", label: "Flashcards", icon: CreditCard },
      { href: "/grammar", label: "Grammar Academy", icon: GraduationCap },
      { href: "/sentences", label: "Sentences", icon: MessageSquare },
    ],
  },
  {
    group: "Practice",
    items: [
      { href: "/reading", label: "Reading", icon: FileText },
      { href: "/writing", label: "Writing", icon: PenLine },
      { href: "/speaking", label: "Speaking", icon: Mic },
    ],
  },
  {
    group: "Plan",
    items: [
      { href: "/planner", label: "Study Planner", icon: CalendarDays },
      { href: "/achievements", label: "Achievements", icon: Trophy },
      { href: "/ai-tools", label: "AI Tools", icon: Sparkles },
    ],
  },
];

function NavContent({
  onLinkClick,
  collapsed,
}: {
  onLinkClick?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const profile = useLiveQuery(() => db.userProfile.orderBy("id").first());
  const todayStr = new Date().toISOString().split("T")[0];
  const todayStats = useLiveQuery(() =>
    db.dailyStats.where("date").equals(todayStr).first()
  );

  const xpForNextLevel = (profile?.level ?? 1) * 200;
  const xpProgress = Math.min(((profile?.xp ?? 0) / xpForNextLevel) * 100, 100);

  return (
    <>
      {/* Profile XP bar */}
      {!collapsed && profile && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-foreground">
                Lv.{profile.level}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
              <span className="text-xs font-semibold text-orange-400">
                {profile.streak}d
              </span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">{profile.xp} XP</span>
            <span className="text-[10px] text-muted-foreground">{xpForNextLevel} XP</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onLinkClick}
                      title={collapsed ? label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all group",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Today XP */}
      {!collapsed && todayStats && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Today&apos;s XP</span>
            <span className="font-semibold text-primary">+{todayStats.xpEarned}</span>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Desktop Sidebar ── */
export function DesktopSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
          E
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col min-w-0"
            >
              <span className="text-sm font-semibold text-foreground truncate">English Hub</span>
              <span className="text-[10px] text-muted-foreground">Learning Dashboard</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className={cn(
            "ml-auto p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
            sidebarCollapsed && "rotate-180"
          )}
          title="Toggle sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <NavContent collapsed={sidebarCollapsed} />
    </motion.aside>
  );
}

/* ── Mobile Drawer Sidebar ── */
export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-sidebar border-r border-sidebar-border lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0">
                E
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-foreground truncate">English Hub</span>
                <span className="text-[10px] text-muted-foreground">Learning Dashboard</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <NavContent onLinkClick={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Legacy export for backwards compat ── */
export function Sidebar() {
  return <DesktopSidebar />;
}
