import type { Dict } from "./types";

export const flashcards = {
  en: {
    pageTitle: "Flashcards",
    subtitle: (total: number, due: number) => `${total} cards · ${due} due today`,
    card: {
      wordLabel: "Word",
      flipHint: "Tap to see meaning",
      meaningLabel: "Meaning",
    },
    flipHintBelow: "Tap the card to flip it",
    rating: {
      hard: "Hard",
      medium: "Medium",
      easy: "Easy",
    },
    session: {
      title: "Flashcard Review",
      percentDone: (n: number) => `${n}% done`,
      endSession: "End Session",
    },
    sessionDone: {
      title: "Session Complete!",
      congrats: "Well done!",
      cardsReviewed: (n: number) => `You reviewed ${n} cards`,
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      back: "Back",
      reviewMore: "Review More",
    },
    home: {
      stats: {
        totalCards: "Total Cards",
        dueToday: "Due Today",
        learned: "Learned",
      },
      startSession: {
        title: "Start Study Session",
        description: "Practice your flashcards with spaced repetition",
        emptyDescription: "Add words to automatically generate flashcards",
        reviewDue: (n: number) => `Review Today's Cards (${n})`,
        practiceAll: "Practice All Cards",
      },
      recentCards: "Recent Flashcards",
      due: "Due",
      daysLeft: (n: number) => `${n} days left`,
    },
    toasts: {
      sessionComplete: (xp: number) => `Session complete! +${xp} XP`,
    },
  },
  fa: {
    pageTitle: "فلش‌کارت",
    subtitle: (total: number, due: number) => `${total} کارت · ${due} برای امروز`,
    card: {
      wordLabel: "کلمه",
      flipHint: "برای دیدن معنی بزن",
      meaningLabel: "معنی",
    },
    flipHintBelow: "روی کارت بزن تا برگرده",
    rating: {
      hard: "سخت",
      medium: "متوسط",
      easy: "آسان",
    },
    session: {
      title: "مرور فلش‌کارت",
      percentDone: (n: number) => `${n}% انجام شد`,
      endSession: "پایان جلسه",
    },
    sessionDone: {
      title: "جلسه تمام شد!",
      congrats: "آفرین!",
      cardsReviewed: (n: number) => `${n} کارت مرور کردی`,
      easy: "آسان",
      medium: "متوسط",
      hard: "سخت",
      back: "بازگشت",
      reviewMore: "مرور بیشتر",
    },
    home: {
      stats: {
        totalCards: "کل کارت‌ها",
        dueToday: "برای امروز",
        learned: "یاد گرفته‌شده",
      },
      startSession: {
        title: "شروع جلسه مطالعه",
        description: "با تکرار فاصله‌دار فلش‌کارت‌هات رو تمرین کن",
        emptyDescription: "کلمه اضافه کن تا فلش‌کارت خودکار ساخته بشه",
        reviewDue: (n: number) => `مرور کارت‌های امروز (${n})`,
        practiceAll: "تمرین همه کارت‌ها",
      },
      recentCards: "فلش‌کارت‌های اخیر",
      due: "موعد",
      daysLeft: (n: number) => `${n} روز دیگه`,
    },
    toasts: {
      sessionComplete: (xp: number) => `جلسه تمام شد! +${xp} XP`,
    },
  },
} satisfies Dict<{
  pageTitle: string;
  subtitle: (total: number, due: number) => string;
  card: {
    wordLabel: string;
    flipHint: string;
    meaningLabel: string;
  };
  flipHintBelow: string;
  rating: {
    hard: string;
    medium: string;
    easy: string;
  };
  session: {
    title: string;
    percentDone: (n: number) => string;
    endSession: string;
  };
  sessionDone: {
    title: string;
    congrats: string;
    cardsReviewed: (n: number) => string;
    easy: string;
    medium: string;
    hard: string;
    back: string;
    reviewMore: string;
  };
  home: {
    stats: {
      totalCards: string;
      dueToday: string;
      learned: string;
    };
    startSession: {
      title: string;
      description: string;
      emptyDescription: string;
      reviewDue: (n: number) => string;
      practiceAll: string;
    };
    recentCards: string;
    due: string;
    daysLeft: (n: number) => string;
  };
  toasts: {
    sessionComplete: (xp: number) => string;
  };
}>;
