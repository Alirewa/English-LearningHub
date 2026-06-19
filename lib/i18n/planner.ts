import type { Dict } from "./types";

export const planner = {
  en: {
    header: {
      title: "Planner",
      subtitle: "Plan your weekly English learning schedule",
    },
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    taskLabels: {
      vocabulary: "Vocabulary",
      grammar: "Grammar",
      reading: "Reading",
      writing: "Writing",
      speaking: "Speaking",
      flashcards: "Flashcards",
    },
    newPlan: "New Plan",
    today: (day: string) => `Today (${day})`,
    empty: {
      title: "No plans yet",
      description: "Build a weekly plan to stay consistent",
      cta: "First Plan",
    },
    dialog: {
      title: "Create Study Plan",
      nameLabel: "Plan Name",
      namePlaceholder: "e.g. Morning study session",
      dayLabel: "Day of Week",
      tasksLabel: "Tasks",
      taskDescPlaceholder: "Task description...",
      cancel: "Cancel",
      saving: "Saving...",
      create: "Create Plan",
    },
    toasts: {
      missingFields: "A plan name and at least one task are required",
      created: "Study plan created!",
      saveFailed: "Failed to save plan",
      deleted: "Plan deleted",
    },
  },
  fa: {
    header: {
      title: "Planner",
      subtitle: "برنامه هفتگی یادگیری انگلیسیت رو بچین",
    },
    days: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"],
    taskLabels: {
      vocabulary: "واژگان",
      grammar: "گرامر",
      reading: "خواندن",
      writing: "نوشتن",
      speaking: "صحبت",
      flashcards: "فلش‌کارت",
    },
    newPlan: "برنامه جدید",
    today: (day: string) => `امروز (${day})`,
    empty: {
      title: "هنوز برنامه‌ای نداری",
      description: "یه برنامه هفتگی بساز تا منظم پیش بری",
      cta: "اولین برنامه",
    },
    dialog: {
      title: "ساخت برنامه مطالعه",
      nameLabel: "نام برنامه",
      namePlaceholder: "مثلاً: جلسه مطالعه صبحگاهی",
      dayLabel: "روز هفته",
      tasksLabel: "تسک‌ها",
      taskDescPlaceholder: "شرح تسک...",
      cancel: "انصراف",
      saving: "در حال ذخیره...",
      create: "ساخت برنامه",
    },
    toasts: {
      missingFields: "نام برنامه و حداقل یک تسک لازم است",
      created: "برنامه مطالعه ساخته شد!",
      saveFailed: "ذخیره برنامه ناموفق بود",
      deleted: "برنامه حذف شد",
    },
  },
} satisfies Dict<{
  header: {
    title: string;
    subtitle: string;
  };
  days: string[];
  taskLabels: Record<
    "vocabulary" | "grammar" | "reading" | "writing" | "speaking" | "flashcards",
    string
  >;
  newPlan: string;
  today: (day: string) => string;
  empty: {
    title: string;
    description: string;
    cta: string;
  };
  dialog: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    dayLabel: string;
    tasksLabel: string;
    taskDescPlaceholder: string;
    cancel: string;
    saving: string;
    create: string;
  };
  toasts: {
    missingFields: string;
    created: string;
    saveFailed: string;
    deleted: string;
  };
}>;
