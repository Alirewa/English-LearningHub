import type { Dict } from "./types";

export const nav = {
  en: {
    groups: {
      overview: "Overview",
      learning: "Learning",
      practice: "Practice",
      tools: "Tools",
    },
    items: {
      dashboard: "Dashboard",
      vocabulary: "Vocabulary",
      flashcards: "Flashcards",
      grammar: "Grammar",
      sentences: "Sentences",
      reading: "Reading",
      writing: "Writing",
      speaking: "Speaking",
      exam: "Exam Mode",
      planner: "Planner",
      aiTools: "AI Tools",
      data: "Export / Import",
    },
    today: "Today",
    tagline: "Personal Study",
  },
  fa: {
    groups: {
      overview: "نمای کلی",
      learning: "یادگیری",
      practice: "تمرین",
      tools: "ابزارها",
    },
    items: {
      dashboard: "داشبورد",
      vocabulary: "واژگان",
      flashcards: "فلش‌کارت",
      grammar: "گرامر",
      sentences: "جملات",
      reading: "خواندن",
      writing: "نوشتن",
      speaking: "صحبت کردن",
      exam: "حالت آزمون",
      planner: "برنامه‌ریز",
      aiTools: "ابزار هوش مصنوعی",
      data: "خروجی / ورودی",
    },
    today: "امروز",
    tagline: "مطالعه شخصی",
  },
} satisfies Dict<{
  groups: Record<"overview" | "learning" | "practice" | "tools", string>;
  items: Record<
    | "dashboard"
    | "vocabulary"
    | "flashcards"
    | "grammar"
    | "sentences"
    | "reading"
    | "writing"
    | "speaking"
    | "exam"
    | "planner"
    | "aiTools"
    | "data",
    string
  >;
  today: string;
  tagline: string;
}>;
