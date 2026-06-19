import type { Dict } from "./types";

export const dashboard = {
  en: {
    title: "Dashboard",
    greeting: {
      morning: "Good morning",
      noon: "Good afternoon",
      evening: "Good evening",
      defaultName: "Learner",
    },
    banner: {
      streakDays: "day streak",
      level: (n: number) => `Level ${n}`,
      toLevel: (n: number) => `to level ${n}`,
      xpToNext: (xp: number) => `${xp} XP to next level`,
    },
    sections: {
      todayProgress: "Today's Progress",
      weeklyActivity: "Weekly Activity",
      allTime: "All Time",
      quickAccess: "Quick Access",
      recentWords: "Recent Words",
    },
    stats: {
      wordsLearned: "Words Learned",
      flashcards: "Flashcards",
      grammar: "Grammar",
      reading: "Reading",
      minutes: "min",
      xpEarned: "XP Earned",
      dueCards: "Due Cards",
    },
    allTimeStats: {
      totalWords: "Total Words",
      flashcards: "Flashcards",
      grammarCompleted: "Grammar Completed",
      totalXp: "Total XP",
    },
    quickActions: {
      addWord: {
        label: "Add New Word",
        description: "Expand your vocabulary",
      },
      reviewFlashcards: {
        label: (n: number) => `Review Flashcards (${n} due)`,
        description: "Practice with spaced repetition",
      },
      studyGrammar: {
        label: "Study Grammar",
        description: "Learn grammar rules",
      },
      journal: {
        label: "Daily Journal",
        description: "Write your thoughts in English",
      },
      speakingPractice: {
        label: "Speaking Practice",
        description: "Random topics to talk about",
      },
      aiTools: {
        label: "AI Tools",
        description: "Grammar check, sentence explanation",
      },
    },
    viewAll: "View all",
  },
  fa: {
    title: "Dashboard",
    greeting: {
      morning: "صبح بخیر",
      noon: "ظهر بخیر",
      evening: "عصر بخیر",
      defaultName: "زبان‌آموز",
    },
    banner: {
      streakDays: "روز پیاپی",
      level: (n: number) => `سطح ${n}`,
      toLevel: (n: number) => `تا سطح ${n}`,
      xpToNext: (xp: number) => `${xp} XP تا سطح بعدی`,
    },
    sections: {
      todayProgress: "پیشرفت امروز",
      weeklyActivity: "فعالیت هفتگی",
      allTime: "کل دوران",
      quickAccess: "دسترسی سریع",
      recentWords: "کلمات اخیر",
    },
    stats: {
      wordsLearned: "کلمات یادگرفته",
      flashcards: "فلش‌کارت",
      grammar: "گرامر",
      reading: "خواندن",
      minutes: "دقیقه",
      xpEarned: "XP کسب‌شده",
      dueCards: "کارت موعددار",
    },
    allTimeStats: {
      totalWords: "کل کلمات",
      flashcards: "فلش‌کارت",
      grammarCompleted: "گرامر انجام‌شده",
      totalXp: "کل XP",
    },
    quickActions: {
      addWord: {
        label: "افزودن کلمه جدید",
        description: "واژگانت رو گسترش بده",
      },
      reviewFlashcards: {
        label: (n: number) => `مرور فلش‌کارت (${n} موعددار)`,
        description: "تمرین با تکرار فاصله‌دار",
      },
      studyGrammar: {
        label: "مطالعه گرامر",
        description: "یادگیری قواعد گرامری",
      },
      journal: {
        label: "دفترچه روزانه",
        description: "افکارت رو به انگلیسی بنویس",
      },
      speakingPractice: {
        label: "تمرین مکالمه",
        description: "موضوع‌های تصادفی برای صحبت",
      },
      aiTools: {
        label: "ابزارهای هوش مصنوعی",
        description: "بررسی گرامر، توضیح جمله",
      },
    },
    viewAll: "مشاهده همه",
  },
} satisfies Dict<{
  title: string;
  greeting: {
    morning: string;
    noon: string;
    evening: string;
    defaultName: string;
  };
  banner: {
    streakDays: string;
    level: (n: number) => string;
    toLevel: (n: number) => string;
    xpToNext: (xp: number) => string;
  };
  sections: {
    todayProgress: string;
    weeklyActivity: string;
    allTime: string;
    quickAccess: string;
    recentWords: string;
  };
  stats: {
    wordsLearned: string;
    flashcards: string;
    grammar: string;
    reading: string;
    minutes: string;
    xpEarned: string;
    dueCards: string;
  };
  allTimeStats: {
    totalWords: string;
    flashcards: string;
    grammarCompleted: string;
    totalXp: string;
  };
  quickActions: {
    addWord: { label: string; description: string };
    reviewFlashcards: { label: (n: number) => string; description: string };
    studyGrammar: { label: string; description: string };
    journal: { label: string; description: string };
    speakingPractice: { label: string; description: string };
    aiTools: { label: string; description: string };
  };
  viewAll: string;
}>;
