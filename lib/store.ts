import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  activeSection: string;

  // User preferences
  theme: "dark" | "light" | "system";
  language: "en" | "fa";

  // Session state
  currentFlashcardSession: {
    isActive: boolean;
    cardIds: number[];
    currentIndex: number;
    results: Array<{ cardId: number; rating: "easy" | "medium" | "hard" }>;
  };

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setLanguage: (language: "en" | "fa") => void;
  startFlashcardSession: (cardIds: number[]) => void;
  endFlashcardSession: () => void;
  advanceFlashcard: (rating: "easy" | "medium" | "hard") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      activeSection: "dashboard",
      theme: "dark",
      language: "en",
      currentFlashcardSession: {
        isActive: false,
        cardIds: [],
        currentIndex: 0,
        results: [],
      },

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setActiveSection: (section) => set({ activeSection: section }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),

      startFlashcardSession: (cardIds) =>
        set({
          currentFlashcardSession: {
            isActive: true,
            cardIds,
            currentIndex: 0,
            results: [],
          },
        }),

      endFlashcardSession: () =>
        set({
          currentFlashcardSession: {
            isActive: false,
            cardIds: [],
            currentIndex: 0,
            results: [],
          },
        }),

      advanceFlashcard: (rating) => {
        const { currentFlashcardSession } = get();
        const { currentIndex, cardIds, results } = currentFlashcardSession;
        set({
          currentFlashcardSession: {
            ...currentFlashcardSession,
            results: [...results, { cardId: cardIds[currentIndex], rating }],
            currentIndex: currentIndex + 1,
          },
        });
      },
    }),
    {
      name: "english-hub-app",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
