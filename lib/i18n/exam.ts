import type { Dict } from "./types";

export const exam = {
  en: {
    pageTitle: "Exam Mode",
    pageSubtitle: "Test yourself — no cheating!",
    progressLabel: (index: number, total: number) => `${index} / ${total}`,
    resultsSummary: (correct: number, wrong: number) => `${correct} correct · ${wrong} missed`,
    feedback: {
      excellent: "Excellent! Keep it up!",
      good: "Good progress. Review the ones you missed.",
      keepPracticing: "Keep practicing — you'll get there!",
    },
    whatToTest: "What to test?",
    modes: {
      words: "Words",
      sentences: "Sentences",
      both: "Both",
    },
    wordsAvailable: (n: number) => `${n} vocabulary words available`,
    sentencesAvailable: (n: number) => `${n} sentences available`,
    startExam: "Start Exam",
    tryAgain: "Try Again",
    correctLabel: (n: number) => `${n} correct`,
    missedLabel: (n: number) => `${n} missed`,
    showAnswer: "Show Answer",
    missed: "Missed",
    gotIt: "Got it!",
    restartChangeMode: "Restart / Change mode",
  },
  fa: {
    pageTitle: "حالت آزمون",
    pageSubtitle: "خودت رو امتحان کن — تقلب ممنوع!",
    progressLabel: (index: number, total: number) => `${index} / ${total}`,
    resultsSummary: (correct: number, wrong: number) => `${correct} درست · ${wrong} غلط`,
    feedback: {
      excellent: "عالی بود! همینطور ادامه بده!",
      good: "پیشرفت خوبی داشتی. مواردی که اشتباه زدی رو دوباره مرور کن.",
      keepPracticing: "به تمرین ادامه بده — به‌زودی پیشرفت می‌کنی!",
    },
    whatToTest: "چی رو می‌خوای امتحان کنی؟",
    modes: {
      words: "کلمات",
      sentences: "جملات",
      both: "هر دو",
    },
    wordsAvailable: (n: number) => `${n} کلمه واژگان موجود است`,
    sentencesAvailable: (n: number) => `${n} جمله موجود است`,
    startExam: "شروع آزمون",
    tryAgain: "تلاش دوباره",
    correctLabel: (n: number) => `${n} درست`,
    missedLabel: (n: number) => `${n} غلط`,
    showAnswer: "نمایش پاسخ",
    missed: "غلط",
    gotIt: "درست بود!",
    restartChangeMode: "شروع دوباره / تغییر حالت",
  },
} satisfies Dict<{
  pageTitle: string;
  pageSubtitle: string;
  progressLabel: (index: number, total: number) => string;
  resultsSummary: (correct: number, wrong: number) => string;
  feedback: {
    excellent: string;
    good: string;
    keepPracticing: string;
  };
  whatToTest: string;
  modes: {
    words: string;
    sentences: string;
    both: string;
  };
  wordsAvailable: (n: number) => string;
  sentencesAvailable: (n: number) => string;
  startExam: string;
  tryAgain: string;
  correctLabel: (n: number) => string;
  missedLabel: (n: number) => string;
  showAnswer: string;
  missed: string;
  gotIt: string;
  restartChangeMode: string;
}>;
