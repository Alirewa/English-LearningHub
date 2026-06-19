import type { Dict } from "./types";

export const aiTools = {
  en: {
    pageTitle: "AI Tools",
    pageSubtitle: "Powered by Claude AI",
    tabs: {
      explainer: "Sentence Analysis",
      grammar: "Grammar Check",
      vocab: "Vocabulary Builder",
      challenge: "Daily Challenge",
      conversation: "AI Conversation",
    },
    resultCard: {
      copyResult: "Copy result",
    },
    sentenceExplainer: {
      enterSentenceFirst: "Enter a sentence first",
      analysisFailed: "AI request failed. Check your API settings.",
      resultType: "Sentence Analysis",
      copied: "Copied!",
      label: "Enter a sentence to analyze",
      analyzeButton: "Analyze Sentence",
      analyzing: "Analyzing...",
      clear: "Clear",
    },
    grammarChecker: {
      enterTextFirst: "Enter some text to check",
      analysisFailed: "AI request failed",
      resultType: "Grammar Check",
      copied: "Copied!",
      label: "Enter text to check",
      placeholder: "Paste your English text here to check the grammar...",
      checkButton: "Check Grammar",
      checking: "Checking...",
    },
    vocabGenerator: {
      enterTopicFirst: "Enter a topic",
      analysisFailed: "AI request failed",
      resultType: (topic: string) => `Vocabulary: ${topic}`,
      copied: "Copied!",
      label: "Topic or context",
      placeholder: 'e.g. "business meetings", "travel vocabulary", "medical terms"...',
      generateButton: "Generate Vocabulary",
      generating: "Generating...",
    },
    dailyChallenge: {
      analysisFailed: "AI request failed",
      resultType: (today: string) => `Daily Challenge — ${today}`,
      copied: "Copied!",
      title: "English Daily Challenge",
      description: "Get a personalized challenge for today with vocabulary, grammar, speaking, and writing exercises",
      generateButton: "Generate Today's Challenge",
      generating: "Generating challenge...",
    },
    aiConversation: {
      analysisFailed: "AI request failed",
      copied: "Copied!",
      title: "AI Conversation Partner",
      description: "Practice English conversation with AI. Mistakes are corrected gently.",
      restart: "Start over",
      you: "You",
      placeholderEmpty: 'Start the conversation in English... e.g. "Hello! Can you help me practice my English?"',
      placeholderOngoing: "Type your message...",
      send: "Send",
      hint: "Enter to send, Shift+Enter for a new line",
    },
  },
  fa: {
    pageTitle: "ابزارهای هوش مصنوعی",
    pageSubtitle: "قدرت‌گرفته از Claude AI",
    tabs: {
      explainer: "تحلیل جمله",
      grammar: "بررسی گرامر",
      vocab: "ساخت واژگان",
      challenge: "چالش روزانه",
      conversation: "مکالمه هوش مصنوعی",
    },
    resultCard: {
      copyResult: "کپی نتیجه",
    },
    sentenceExplainer: {
      enterSentenceFirst: "اول یه جمله وارد کن",
      analysisFailed: "درخواست هوش مصنوعی ناموفق بود. تنظیمات API رو بررسی کن.",
      resultType: "تحلیل جمله",
      copied: "کپی شد!",
      label: "جمله‌ای برای تحلیل وارد کن",
      analyzeButton: "تحلیل جمله",
      analyzing: "در حال تحلیل...",
      clear: "پاک کردن",
    },
    grammarChecker: {
      enterTextFirst: "متنی برای بررسی وارد کن",
      analysisFailed: "درخواست هوش مصنوعی ناموفق بود",
      resultType: "بررسی گرامر",
      copied: "کپی شد!",
      label: "متن برای بررسی وارد کن",
      placeholder: "متن انگلیسی‌ت رو برای بررسی گرامر اینجا بذار...",
      checkButton: "بررسی گرامر",
      checking: "در حال بررسی...",
    },
    vocabGenerator: {
      enterTopicFirst: "یه موضوع وارد کن",
      analysisFailed: "درخواست هوش مصنوعی ناموفق بود",
      resultType: (topic: string) => `واژگان: ${topic}`,
      copied: "کپی شد!",
      label: "موضوع یا زمینه",
      placeholder: "مثلاً «جلسات کاری»، «واژگان سفر»، «اصطلاحات پزشکی»...",
      generateButton: "ساخت واژگان",
      generating: "در حال ساخت...",
    },
    dailyChallenge: {
      analysisFailed: "درخواست هوش مصنوعی ناموفق بود",
      resultType: (today: string) => `چالش روزانه — ${today}`,
      copied: "کپی شد!",
      title: "چالش روزانه انگلیسی",
      description: "یه چالش شخصی‌سازی‌شده برای امروز با تمرین‌های واژگان، گرامر، صحبت و نوشتن بگیر",
      generateButton: "ساخت چالش امروز",
      generating: "در حال ساخت چالش...",
    },
    aiConversation: {
      analysisFailed: "درخواست هوش مصنوعی ناموفق بود",
      copied: "کپی شد!",
      title: "همراه مکالمه هوش مصنوعی",
      description: "با هوش مصنوعی مکالمه انگلیسی تمرین کن. اشتباه‌ها با ملایمت اصلاح می‌شن.",
      restart: "شروع دوباره",
      you: "تو",
      placeholderEmpty: 'مکالمه رو به انگلیسی شروع کن... مثلاً "Hello! Can you help me practice my English?"',
      placeholderOngoing: "پیامت رو بنویس...",
      send: "ارسال",
      hint: "Enter برای ارسال، Shift+Enter برای خط جدید",
    },
  },
} satisfies Dict<{
  pageTitle: string;
  pageSubtitle: string;
  tabs: {
    explainer: string;
    grammar: string;
    vocab: string;
    challenge: string;
    conversation: string;
  };
  resultCard: {
    copyResult: string;
  };
  sentenceExplainer: {
    enterSentenceFirst: string;
    analysisFailed: string;
    resultType: string;
    copied: string;
    label: string;
    analyzeButton: string;
    analyzing: string;
    clear: string;
  };
  grammarChecker: {
    enterTextFirst: string;
    analysisFailed: string;
    resultType: string;
    copied: string;
    label: string;
    placeholder: string;
    checkButton: string;
    checking: string;
  };
  vocabGenerator: {
    enterTopicFirst: string;
    analysisFailed: string;
    resultType: (topic: string) => string;
    copied: string;
    label: string;
    placeholder: string;
    generateButton: string;
    generating: string;
  };
  dailyChallenge: {
    analysisFailed: string;
    resultType: (today: string) => string;
    copied: string;
    title: string;
    description: string;
    generateButton: string;
    generating: string;
  };
  aiConversation: {
    analysisFailed: string;
    copied: string;
    title: string;
    description: string;
    restart: string;
    you: string;
    placeholderEmpty: string;
    placeholderOngoing: string;
    send: string;
    hint: string;
  };
}>;
