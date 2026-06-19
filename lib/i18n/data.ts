import type { Dict } from "./types";

export const data = {
  en: {
    pageTitle: "Export / Import",
    pageSubtitle: "Backup and restore your data",
    invalidFile: "Invalid file — this file is not from English Hub",
    exportSuccess: "Backup file downloaded!",
    exportFailed: "Export failed",
    replaceSuccess: "Data replaced! Please refresh the page.",
    mergeSuccess: (words: number, sentences: number) =>
      `Import successful: ${words} words, ${sentences} sentences added`,
    importFailed: "Import failed — the file is corrupted",
    noWordsYet: "You don't have any words yet",
    wordListDownloaded: "Word list downloaded!",
    cards: {
      vocabulary: "Saved Words",
      sentences: "Sentences",
      grammar: "Grammar",
      writing: "Writings",
      speaking: "Speaking Sessions",
      reading: "Articles Read",
    },
    overview: {
      heading: "Data Stored in Your Browser",
      refresh: "Refresh",
    },
    exportSection: {
      heading: "Export",
      preparing: "Preparing...",
      fullBackupTitle: "Full Backup (JSON)",
      fullBackupDescFa: "Saves all words, sentences, grammar, writings, and stats",
      fullBackupDescEn: "Use to transfer to another browser or device",
      wordListTitle: "Word List (TXT)",
      wordListDesc: "Words with meanings only — printable or shareable",
    },
    importSection: {
      heading: "Import",
      modeLabel: "Import mode:",
      merge: {
        title: "Merge",
        desc: "Only new items are added, existing data is kept",
      },
      replace: {
        title: "Replace",
        desc: "All current data is cleared and replaced with the new file",
      },
      replaceWarning: "Warning: this action cannot be undone. All current data will be deleted.",
      processing: "Processing...",
      selectFile: "Choose JSON File",
      selectFileDesc: "Choose a previous backup file",
      selectFileNote: "Only .json files exported from this app",
    },
    infoNote:
      "Tip: to transfer your data to another browser, first take a full backup. Then open this same panel in the destination browser and import the JSON file. Your data stays 100% offline and stored in the browser.",
  },
  fa: {
    pageTitle: "خروجی / ورودی",
    pageSubtitle: "بکاپ و بازیابی داده‌ها",
    invalidFile: "فایل نامعتبر است — this file is not from English Hub",
    exportSuccess: "فایل بکاپ دانلود شد!",
    exportFailed: "خروجی گرفتن ناموفق بود",
    replaceSuccess: "داده‌ها جایگزین شدند! صفحه رو رفرش کن.",
    mergeSuccess: (words: number, sentences: number) =>
      `درون‌ریزی موفق: ${words} کلمه، ${sentences} جمله اضافه شد`,
    importFailed: "درون‌ریزی ناموفق بود — فایل خراب است",
    noWordsYet: "هنوز کلمه‌ای ندارید",
    wordListDownloaded: "لیست کلمات دانلود شد!",
    cards: {
      vocabulary: "کلمات ذخیره شده",
      sentences: "جملات",
      grammar: "گرامر",
      writing: "نوشته‌ها",
      speaking: "جلسات صحبت",
      reading: "مقاله‌های خوانده شده",
    },
    overview: {
      heading: "داده‌های ذخیره شده در مرورگر شما",
      refresh: "بازخوانی",
    },
    exportSection: {
      heading: "خروجی گرفتن — Export",
      preparing: "در حال آماده‌سازی...",
      fullBackupTitle: "بکاپ کامل — Full Backup (JSON)",
      fullBackupDescFa: "همه کلمات، جملات، گرامرها، نوشته‌ها و آمار رو ذخیره می‌کنه",
      fullBackupDescEn: "Use to transfer to another browser or device",
      wordListTitle: "لیست کلمات — Word List (TXT)",
      wordListDesc: "فقط کلمات با معنی — قابل پرینت یا اشتراک‌گذاری",
    },
    importSection: {
      heading: "وارد کردن داده — Import",
      modeLabel: "نحوه درون‌ریزی:",
      merge: {
        title: "ادغام — Merge",
        desc: "فقط موارد جدید اضافه می‌شه، داده‌های موجود حفظ می‌شن",
      },
      replace: {
        title: "جایگزینی — Replace",
        desc: "همه داده‌های فعلی پاک و با فایل جدید جایگزین می‌شه",
      },
      replaceWarning: "هشدار: این عملیات برگشت‌پذیر نیست. همه داده‌های فعلی پاک می‌شن.",
      processing: "در حال پردازش...",
      selectFile: "انتخاب فایل JSON",
      selectFileDesc: "فایل بکاپ قبلی رو انتخاب کن",
      selectFileNote: "Only .json files exported from this app",
    },
    infoNote:
      "💡 راهنما: برای انتقال داده‌ها به مرورگر دیگه، اول بکاپ کامل بگیر. بعد در مرورگر مقصد، همین پنل رو باز کن و فایل JSON رو import کن. داده‌ها ۱۰۰٪ آفلاین و در مرورگر ذخیره می‌شن.",
  },
} satisfies Dict<{
  pageTitle: string;
  pageSubtitle: string;
  invalidFile: string;
  exportSuccess: string;
  exportFailed: string;
  replaceSuccess: string;
  mergeSuccess: (words: number, sentences: number) => string;
  importFailed: string;
  noWordsYet: string;
  wordListDownloaded: string;
  cards: {
    vocabulary: string;
    sentences: string;
    grammar: string;
    writing: string;
    speaking: string;
    reading: string;
  };
  overview: {
    heading: string;
    refresh: string;
  };
  exportSection: {
    heading: string;
    preparing: string;
    fullBackupTitle: string;
    fullBackupDescFa: string;
    fullBackupDescEn: string;
    wordListTitle: string;
    wordListDesc: string;
  };
  importSection: {
    heading: string;
    modeLabel: string;
    merge: { title: string; desc: string };
    replace: { title: string; desc: string };
    replaceWarning: string;
    processing: string;
    selectFile: string;
    selectFileDesc: string;
    selectFileNote: string;
  };
  infoNote: string;
}>;
