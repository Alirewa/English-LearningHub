import type { Dict } from "./types";

export const sentences = {
  en: {
    header: {
      title: "Sentences",
      subtitle: (n: number) => `${n} sentences saved`,
    },
    card: {
      copy: "Copy",
      favorite: "Favorite",
      copied: "Copied to clipboard",
    },
    toolbar: {
      searchPlaceholder: "Search sentences... / Search EN or FA",
      categoryPlaceholder: "Category",
      allCategories: "All categories",
      favorites: "Favorites",
      addSentence: "Add Sentence",
    },
    tabs: {
      all: (n: number) => `All (${n})`,
    },
    emptyState: {
      title: "No sentences found",
      withSearch: "Try different search terms",
      withoutSearch: "Add useful English sentences with Persian translations",
      addFirst: "Add First Sentence",
    },
    dialog: {
      title: "Add New Sentence",
      englishLabel: "English Sentence *",
      englishPlaceholder: "Could you please repeat that?",
      persianLabel: "Persian Translation *",
      persianPlaceholder: "می‌تونید دوباره بگید؟",
      notesLabel: "Notes",
      notesPlaceholder: "Usage notes or context...",
      categoryLabel: "Category",
      cancel: "Cancel",
      saving: "Saving...",
      save: "Add Sentence",
    },
    toasts: {
      requiredFields: "English and Persian fields are required",
      added: "Sentence added!",
      saveFailed: "Failed to save",
      deleted: "Deleted",
    },
  },
  fa: {
    header: {
      title: "جملات",
      subtitle: (n: number) => `${n} جمله ذخیره شده`,
    },
    card: {
      copy: "Copy",
      favorite: "Favorite",
      copied: "Copied to clipboard",
    },
    toolbar: {
      searchPlaceholder: "جستجو در جملات... / Search EN or FA",
      categoryPlaceholder: "Category",
      allCategories: "All categories",
      favorites: "Favorites",
      addSentence: "Add Sentence",
    },
    tabs: {
      all: (n: number) => `All (${n})`,
    },
    emptyState: {
      title: "No sentences found",
      withSearch: "Try different search terms",
      withoutSearch: "Add useful English sentences with Persian translations",
      addFirst: "Add First Sentence",
    },
    dialog: {
      title: "Add New Sentence",
      englishLabel: "English Sentence *",
      englishPlaceholder: "Could you please repeat that?",
      persianLabel: "Persian Translation *",
      persianPlaceholder: "می‌تونید دوباره بگید؟",
      notesLabel: "Notes",
      notesPlaceholder: "Usage notes or context...",
      categoryLabel: "Category",
      cancel: "Cancel",
      saving: "Saving...",
      save: "Add Sentence",
    },
    toasts: {
      requiredFields: "English and Persian fields are required",
      added: "Sentence added!",
      saveFailed: "Failed to save",
      deleted: "Deleted",
    },
  },
} satisfies Dict<{
  header: {
    title: string;
    subtitle: (n: number) => string;
  };
  card: {
    copy: string;
    favorite: string;
    copied: string;
  };
  toolbar: {
    searchPlaceholder: string;
    categoryPlaceholder: string;
    allCategories: string;
    favorites: string;
    addSentence: string;
  };
  tabs: {
    all: (n: number) => string;
  };
  emptyState: {
    title: string;
    withSearch: string;
    withoutSearch: string;
    addFirst: string;
  };
  dialog: {
    title: string;
    englishLabel: string;
    englishPlaceholder: string;
    persianLabel: string;
    persianPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    categoryLabel: string;
    cancel: string;
    saving: string;
    save: string;
  };
  toasts: {
    requiredFields: string;
    added: string;
    saveFailed: string;
    deleted: string;
  };
}>;
