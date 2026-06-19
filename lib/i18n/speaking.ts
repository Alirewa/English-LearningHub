import type { Dict } from "./types";

export const speaking = {
  en: {
    header: {
      title: "Speaking",
      subtitle: (n: number) => `${n} sessions completed`,
    },
    session: {
      tipsTitle: "Tips:",
      tips: [
        "Speak for at least 2 minutes",
        "Use varied vocabulary and grammar structures",
        "Don't worry about mistakes — focus on fluency",
        "Record yourself if you can",
      ],
      ratingLabel: "Rate your performance",
      notesLabel: "Notes & Review",
      notesPlaceholder: "How did it go? What vocabulary did you use? What could you improve?",
      newPrompt: "New Topic",
      saving: "Saving...",
      saveSession: "Save Session",
    },
    start: {
      title: "Ready to practice speaking?",
      description: "Grab a random topic or pick one from the list below",
      randomPrompt: "Random Topic",
    },
    library: {
      title: "Prompt Library",
    },
    recent: {
      title: "Recent Sessions",
    },
    toasts: {
      saved: (xp: number) => `+${xp} XP! Speaking session saved.`,
      saveFailed: "Failed to save session",
    },
  },
  fa: {
    header: {
      title: "Speaking",
      subtitle: (n: number) => `${n} جلسه انجام شده`,
    },
    session: {
      tipsTitle: "نکته‌ها:",
      tips: [
        "حداقل ۲ دقیقه صحبت کن",
        "از واژگان و ساختارهای گرامری متنوع استفاده کن",
        "نگران اشتباه نباش — روی روان بودن تمرکز کن",
        "اگه می‌تونی صدای خودت رو ضبط کن",
      ],
      ratingLabel: "امتیاز عملکردت",
      notesLabel: "یادداشت و بازنگری",
      notesPlaceholder: "چطور پیش رفت؟ چه واژگانی استفاده کردی؟ چی رو می‌تونی بهتر کنی؟",
      newPrompt: "موضوع جدید",
      saving: "در حال ذخیره...",
      saveSession: "ذخیره جلسه",
    },
    start: {
      title: "آماده‌ای تمرین مکالمه کنی؟",
      description: "یه موضوع تصادفی بگیر یا از لیست پایین یکی رو انتخاب کن",
      randomPrompt: "موضوع تصادفی",
    },
    library: {
      title: "کتابخانه موضوع‌ها — Prompts",
    },
    recent: {
      title: "جلسه‌های اخیر — Recent",
    },
    toasts: {
      saved: (xp: number) => `+${xp} XP! جلسه صحبت ذخیره شد.`,
      saveFailed: "ذخیره جلسه ناموفق بود",
    },
  },
} satisfies Dict<{
  header: {
    title: string;
    subtitle: (n: number) => string;
  };
  session: {
    tipsTitle: string;
    tips: string[];
    ratingLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    newPrompt: string;
    saving: string;
    saveSession: string;
  };
  start: {
    title: string;
    description: string;
    randomPrompt: string;
  };
  library: {
    title: string;
  };
  recent: {
    title: string;
  };
  toasts: {
    saved: (xp: number) => string;
    saveFailed: string;
  };
}>;
