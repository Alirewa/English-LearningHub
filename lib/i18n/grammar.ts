import type { Dict } from "./types";

export const grammar = {
  en: {
    header: {
      title: "Grammar Academy",
      subtitle: (completed: number, total: number) => `${completed}/${total} lessons · Offline`,
    },
    progress: {
      label: "Your Progress",
      summary: (pct: number, remaining: number) => `${pct}% complete — ${remaining} lessons remaining`,
    },
    search: {
      placeholder: "Search... (FA/EN)",
    },
    filters: {
      all: "All Topics",
    },
    emptyState: "No results found",
    modal: {
      markDone: "Mark Done",
      completed: "Completed",
      definitionHeading: "Definition — تعریف",
      formulaHeading: "Formula — فرمول",
      usagesHeading: "کاربردها — Usages",
      rulesHeading: "Rules — قوانین",
      examplesHeading: "Examples — مثال‌ها",
      commonMistakesHeading: "اشتباهات رایج — Common Mistakes",
      summaryHeading: "جمع‌بندی — Summary",
      overviewTab: "Overview",
      pin: "Pin",
      unpin: "Unpin",
    },
    pinned: {
      label: "Pinned",
      sectionHeading: "Pinned Topics",
    },
    toasts: {
      lessonCompleted: (xp: number) => `+${xp} XP! Lesson completed.`,
      pinned: "Pinned to the top",
      unpinned: "Unpinned",
    },
  },
  fa: {
    header: {
      title: "آکادمی گرامر",
      subtitle: (completed: number, total: number) => `${completed}/${total} درس · آفلاین`,
    },
    progress: {
      label: "پیشرفت شما",
      summary: (pct: number, remaining: number) => `${pct}% تکمیل شده — ${remaining} درس باقی مانده`,
    },
    search: {
      placeholder: "جستجو... (FA/EN)",
    },
    filters: {
      all: "همه موضوعات",
    },
    emptyState: "موردی یافت نشد",
    modal: {
      markDone: "Mark Done",
      completed: "Completed",
      definitionHeading: "Definition — تعریف",
      formulaHeading: "Formula — فرمول",
      usagesHeading: "کاربردها — Usages",
      rulesHeading: "Rules — قوانین",
      examplesHeading: "Examples — مثال‌ها",
      commonMistakesHeading: "اشتباهات رایج — Common Mistakes",
      summaryHeading: "جمع‌بندی — Summary",
      overviewTab: "کلی",
      pin: "پین کردن",
      unpin: "برداشتن پین",
    },
    pinned: {
      label: "پین‌شده",
      sectionHeading: "موضوعات پین‌شده",
    },
    toasts: {
      lessonCompleted: (xp: number) => `+${xp} XP! درس تموم شد.`,
      pinned: "به بالای لیست پین شد",
      unpinned: "پین برداشته شد",
    },
  },
} satisfies Dict<{
  header: {
    title: string;
    subtitle: (completed: number, total: number) => string;
  };
  progress: {
    label: string;
    summary: (pct: number, remaining: number) => string;
  };
  search: {
    placeholder: string;
  };
  filters: {
    all: string;
  };
  emptyState: string;
  modal: {
    markDone: string;
    completed: string;
    definitionHeading: string;
    formulaHeading: string;
    usagesHeading: string;
    rulesHeading: string;
    examplesHeading: string;
    commonMistakesHeading: string;
    summaryHeading: string;
    overviewTab: string;
    pin: string;
    unpin: string;
  };
  pinned: {
    label: string;
    sectionHeading: string;
  };
  toasts: {
    lessonCompleted: (xp: number) => string;
    pinned: string;
    unpinned: string;
  };
}>;
