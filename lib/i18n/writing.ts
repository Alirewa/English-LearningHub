import type { Dict } from "./types";

export const writing = {
  en: {
    header: {
      title: "Writing",
      subtitle: (entries: number, words: number) => `${entries} entries · ${words} words`,
    },
    editor: {
      wordCount: (n: number) => `${n} words`,
      saving: "Saving...",
      save: "Save",
      titlePlaceholder: "Title (optional)",
      contentPlaceholder: "Write in English... What happened today? What are you thinking about? Practice is key to progress.",
      grammarNotesLabel: "Grammar Notes",
      grammarNotesPlaceholder: "Grammar tips, corrections, or anything you want to remember...",
    },
    toasts: {
      emptyContent: "Write something first!",
      updated: "Entry updated!",
      saved: (xp: number) => `+${xp} XP! Entry saved.`,
      saveFailed: "Failed to save",
      deleted: "Entry deleted",
    },
    cta: {
      title: "Daily Journal",
      description: "Write in English every day to improve your fluency. Even 5 minutes makes a difference.",
      newEntry: "New Entry",
    },
    stats: {
      entryCount: "Entries",
      totalWords: "Total Words",
      avgWords: "Avg. Words",
    },
    empty: {
      title: "No entries yet",
      description: "Start your English writing journey today",
      cta: "First Entry",
    },
    entry: {
      wordCount: (n: number) => `${n} words`,
    },
  },
  fa: {
    header: {
      title: "Writing",
      subtitle: (entries: number, words: number) => `${entries} نوشته · ${words} کلمه`,
    },
    editor: {
      wordCount: (n: number) => `${n} کلمه`,
      saving: "در حال ذخیره...",
      save: "ذخیره",
      titlePlaceholder: "عنوان (اختیاری)",
      contentPlaceholder: "به انگلیسی بنویس... امروز چی شد؟ به چی فکر می‌کنی؟ تمرین، کلید پیشرفته.",
      grammarNotesLabel: "یادداشت‌های گرامری — Grammar Notes",
      grammarNotesPlaceholder: "نکات گرامری، تصحیح‌ها یا هرچیزی که می‌خوای یادت بمونه...",
    },
    toasts: {
      emptyContent: "اول یه چیزی بنویس!",
      updated: "نوشته به‌روزرسانی شد!",
      saved: (xp: number) => `+${xp} XP! نوشته ذخیره شد.`,
      saveFailed: "ذخیره ناموفق بود",
      deleted: "نوشته حذف شد",
    },
    cta: {
      title: "دفترچه روزانه",
      description: "هر روز به انگلیسی بنویس تا روان‌تر بشی. حتی ۵ دقیقه هم فرق ایجاد می‌کنه.",
      newEntry: "نوشته جدید",
    },
    stats: {
      entryCount: "تعداد نوشته‌ها",
      totalWords: "مجموع کلمات",
      avgWords: "میانگین کلمات",
    },
    empty: {
      title: "هنوز نوشته‌ای نداری",
      description: "سفر نوشتن انگلیسیت رو از همین امروز شروع کن",
      cta: "اولین نوشته",
    },
    entry: {
      wordCount: (n: number) => `${n} کلمه`,
    },
  },
} satisfies Dict<{
  header: {
    title: string;
    subtitle: (entries: number, words: number) => string;
  };
  editor: {
    wordCount: (n: number) => string;
    saving: string;
    save: string;
    titlePlaceholder: string;
    contentPlaceholder: string;
    grammarNotesLabel: string;
    grammarNotesPlaceholder: string;
  };
  toasts: {
    emptyContent: string;
    updated: string;
    saved: (xp: number) => string;
    saveFailed: string;
    deleted: string;
  };
  cta: {
    title: string;
    description: string;
    newEntry: string;
  };
  stats: {
    entryCount: string;
    totalWords: string;
    avgWords: string;
  };
  empty: {
    title: string;
    description: string;
    cta: string;
  };
  entry: {
    wordCount: (n: number) => string;
  };
}>;
