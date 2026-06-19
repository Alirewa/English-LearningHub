import type { Dict } from "./types";

export const reading = {
  en: {
    header: {
      title: "Reading",
      subtitle: (completed: number, total: number) => `${completed}/${total} articles read`,
    },
    addArticle: "Add Article",
    stats: {
      saved: "Saved Articles",
      read: "Read",
      toRead: "To Read",
    },
    emptyState: {
      title: "No articles saved yet",
      description: "Save an article, blog post, or any English text to read and practice with",
      addFirst: "Add First Article",
    },
    list: {
      wordsCount: (n: number) => `${n} words`,
      read: "Read",
    },
    dialog: {
      title: "Add New Article",
      titleLabel: "Title *",
      titlePlaceholder: "Article title...",
      sourceLabel: "Source (optional)",
      sourcePlaceholder: "Website, book, newspaper...",
      contentLabel: "Content *",
      contentPlaceholder: "Paste the article text here...",
      wordsCount: (n: number) => `${n} words`,
      cancel: "Cancel",
      saving: "Saving...",
      save: "Save Article",
    },
    readingMode: {
      markAsRead: "Mark as Read",
      alreadyRead: "Read",
      source: (src: string) => `Source: ${src}`,
    },
    toasts: {
      requiredFields: "Title and content are required",
      saved: "Article saved!",
      saveFailed: "Failed to save",
      deleted: "Deleted",
      readingCompleted: (xp: number) => `+${xp} XP! Reading completed.`,
    },
  },
  fa: {
    header: {
      title: "خواندن",
      subtitle: (completed: number, total: number) => `${completed}/${total} مقاله خوانده شده`,
    },
    addArticle: "افزودن مقاله",
    stats: {
      saved: "مقاله‌های ذخیره‌شده",
      read: "خوانده‌شده",
      toRead: "برای خواندن",
    },
    emptyState: {
      title: "هنوز مقاله‌ای ذخیره نشده",
      description: "مقاله، پست وبلاگ یا هر متن انگلیسی رو ذخیره کن تا بخونی و تمرین کنی",
      addFirst: "اولین مقاله",
    },
    list: {
      wordsCount: (n: number) => `${n} کلمه`,
      read: "خواندن",
    },
    dialog: {
      title: "افزودن مقاله جدید",
      titleLabel: "عنوان *",
      titlePlaceholder: "عنوان مقاله...",
      sourceLabel: "منبع (اختیاری)",
      sourcePlaceholder: "وب‌سایت، کتاب، روزنامه...",
      contentLabel: "متن *",
      contentPlaceholder: "متن مقاله رو اینجا بچسبون...",
      wordsCount: (n: number) => `${n} کلمه`,
      cancel: "انصراف",
      saving: "در حال ذخیره...",
      save: "ذخیره مقاله",
    },
    readingMode: {
      markAsRead: "علامت‌گذاری به‌عنوان خوانده‌شده",
      alreadyRead: "خوانده شد",
      source: (src: string) => `منبع: ${src}`,
    },
    toasts: {
      requiredFields: "عنوان و متن الزامی هستند",
      saved: "مقاله ذخیره شد!",
      saveFailed: "ذخیره ناموفق بود",
      deleted: "حذف شد",
      readingCompleted: (xp: number) => `+${xp} XP! خواندن کامل شد.`,
    },
  },
} satisfies Dict<{
  header: {
    title: string;
    subtitle: (completed: number, total: number) => string;
  };
  addArticle: string;
  stats: {
    saved: string;
    read: string;
    toRead: string;
  };
  emptyState: {
    title: string;
    description: string;
    addFirst: string;
  };
  list: {
    wordsCount: (n: number) => string;
    read: string;
  };
  dialog: {
    title: string;
    titleLabel: string;
    titlePlaceholder: string;
    sourceLabel: string;
    sourcePlaceholder: string;
    contentLabel: string;
    contentPlaceholder: string;
    wordsCount: (n: number) => string;
    cancel: string;
    saving: string;
    save: string;
  };
  readingMode: {
    markAsRead: string;
    alreadyRead: string;
    source: (src: string) => string;
  };
  toasts: {
    requiredFields: string;
    saved: string;
    saveFailed: string;
    deleted: string;
    readingCompleted: (xp: number) => string;
  };
}>;
