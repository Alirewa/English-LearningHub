import type { Dict } from "./types";

export const common = {
  en: {
    search: "Search...",
    toggleTheme: "Toggle theme",
    switchToPersian: "Switch to Persian",
    switchToEnglish: "Switch to English",
    openNavigation: "Open navigation",
    commandPalette: {
      title: "Search",
      description: "Search pages, words, and sentences",
      placeholder: "Search pages, words, sentences...",
      searching: "Searching...",
      noResults: "No results found",
      words: "Words",
      sentences: "Sentences",
      navigate: "Navigate",
    },
  },
  fa: {
    search: "جستجو...",
    toggleTheme: "تغییر پوسته",
    switchToPersian: "تغییر به فارسی",
    switchToEnglish: "تغییر به انگلیسی",
    openNavigation: "باز کردن منو",
    commandPalette: {
      title: "جستجو",
      description: "صفحات، کلمات و جملات رو جستجو کن",
      placeholder: "جستجو در صفحات، کلمات، جملات...",
      searching: "در حال جستجو...",
      noResults: "نتیجه‌ای یافت نشد",
      words: "کلمات",
      sentences: "جملات",
      navigate: "ناوبری",
    },
  },
} satisfies Dict<{
  search: string;
  toggleTheme: string;
  switchToPersian: string;
  switchToEnglish: string;
  openNavigation: string;
  commandPalette: {
    title: string;
    description: string;
    placeholder: string;
    searching: string;
    noResults: string;
    words: string;
    sentences: string;
    navigate: string;
  };
}>;
