import type { Dict } from "./types";

export const vocabulary = {
  en: {
    title: "Vocabulary",
    subtitle: (n: number) => `${n} words saved`,
    quickAdd: {
      label: "Quick Add",
      wordPlaceholder: "English word…",
      meaningPlaceholder: "Meaning / معنی…",
      add: "Add",
      hint: "Tab → jump to meaning · Enter → save · Flashcard created automatically",
    },
    search: {
      placeholder: "جستجو... / Search EN or FA",
      levelPlaceholder: "Level",
      allLevels: "All levels",
    },
    wordCount: (n: number) => (n === 1 ? `${n} word` : `${n} words`),
    empty: {
      title: "No words yet",
      description: "Use the Quick Add bar above to start",
    },
    card: {
      revealHint: "Click to reveal",
      showMeaning: "Show meaning",
    },
    editDialog: {
      title: "Edit Word",
      word: "Word",
      pronunciation: "Pronunciation",
      meaning: "Meaning",
      exampleSentence: "Example Sentence",
      synonyms: "Synonyms (comma separated)",
      difficulty: "Difficulty",
      category: "Category",
      notes: "Notes",
      cancel: "Cancel",
      update: "Update",
      saving: "Saving…",
    },
    toasts: {
      wordAdded: (word: string, xp: number) => `"${word}" added! +${xp} XP`,
      addFailed: "Failed to add word",
      wordMeaningRequired: "Word and meaning are required",
      wordUpdated: "Word updated!",
      saveFailed: "Failed to save",
      wordDeleted: "Word deleted",
    },
  },
  fa: {
    title: "واژگان",
    subtitle: (n: number) => `${n} کلمه ذخیره شده`,
    quickAdd: {
      label: "افزودن سریع",
      wordPlaceholder: "کلمه انگلیسی…",
      meaningPlaceholder: "معنی / Meaning…",
      add: "افزودن",
      hint: "Tab → برو به معنی · Enter → ذخیره · فلش‌کارت به‌طور خودکار ساخته می‌شه",
    },
    search: {
      placeholder: "جستجو... / Search EN or FA",
      levelPlaceholder: "سطح",
      allLevels: "همه سطوح",
    },
    wordCount: (n: number) => `${n} کلمه`,
    empty: {
      title: "هنوز کلمه‌ای نیست",
      description: "از نوار افزودن سریع بالا برای شروع استفاده کن",
    },
    card: {
      revealHint: "برای نمایش کلیک کن",
      showMeaning: "نمایش معنی",
    },
    editDialog: {
      title: "ویرایش کلمه",
      word: "کلمه",
      pronunciation: "تلفظ",
      meaning: "معنی",
      exampleSentence: "جمله نمونه",
      synonyms: "مترادف‌ها (با کاما جدا کن)",
      difficulty: "سطح دشواری",
      category: "دسته‌بندی",
      notes: "یادداشت‌ها",
      cancel: "انصراف",
      update: "به‌روزرسانی",
      saving: "در حال ذخیره…",
    },
    toasts: {
      wordAdded: (word: string, xp: number) => `"${word}" اضافه شد! +${xp} XP`,
      addFailed: "افزودن کلمه ناموفق بود",
      wordMeaningRequired: "کلمه و معنی الزامی هستند",
      wordUpdated: "کلمه به‌روزرسانی شد!",
      saveFailed: "ذخیره ناموفق بود",
      wordDeleted: "کلمه حذف شد",
    },
  },
} satisfies Dict<{
  title: string;
  subtitle: (n: number) => string;
  quickAdd: {
    label: string;
    wordPlaceholder: string;
    meaningPlaceholder: string;
    add: string;
    hint: string;
  };
  search: {
    placeholder: string;
    levelPlaceholder: string;
    allLevels: string;
  };
  wordCount: (n: number) => string;
  empty: {
    title: string;
    description: string;
  };
  card: {
    revealHint: string;
    showMeaning: string;
  };
  editDialog: {
    title: string;
    word: string;
    pronunciation: string;
    meaning: string;
    exampleSentence: string;
    synonyms: string;
    difficulty: string;
    category: string;
    notes: string;
    cancel: string;
    update: string;
    saving: string;
  };
  toasts: {
    wordAdded: (word: string, xp: number) => string;
    addFailed: string;
    wordMeaningRequired: string;
    wordUpdated: string;
    saveFailed: string;
    wordDeleted: string;
  };
}>;
