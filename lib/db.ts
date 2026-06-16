import Dexie, { Table } from "dexie";

export interface VocabWord {
  id?: number;
  word: string;
  meaning: string;
  pronunciation?: string;
  exampleSentence?: string;
  synonyms?: string[];
  notes?: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  tags?: string[];
  isFavorite: boolean;
  xpAwarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flashcard {
  id?: number;
  wordId: number;
  front: string;
  back: string;
  difficulty?: "easy" | "medium" | "hard";
  nextReviewDate: Date;
  interval: number; // days
  repetitions: number;
  easeFactor: number;
  lastReviewedAt?: Date;
  createdAt: Date;
}

export interface GrammarTopic {
  id?: number;
  title: string;
  category: string;
  explanation: string;
  rules: string[];
  examples: string[];
  commonMistakes: string[];
  notes?: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface Sentence {
  id?: number;
  english: string;
  persian: string;
  notes?: string;
  category: string;
  isFavorite: boolean;
  tags?: string[];
  createdAt: Date;
}

export interface ReadingSession {
  id?: number;
  title: string;
  content: string;
  source?: string;
  wordsCount: number;
  readTime?: number; // minutes
  isCompleted: boolean;
  highlights?: Array<{ text: string; wordId?: number }>;
  createdAt: Date;
  completedAt?: Date;
}

export interface WritingEntry {
  id?: number;
  title: string;
  content: string;
  wordCount: number;
  grammarNotes?: string;
  mood?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SpeakingSession {
  id?: number;
  promptText: string;
  selfEvaluation?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  duration?: number; // seconds
  createdAt: Date;
}

export interface StudyPlan {
  id?: number;
  name: string;
  dayOfWeek: number; // 0-6
  tasks: Array<{
    type: "vocabulary" | "grammar" | "reading" | "writing" | "speaking" | "flashcards";
    description: string;
    targetCount?: number;
    targetMinutes?: number;
    isCompleted: boolean;
  }>;
  isActive: boolean;
  createdAt: Date;
}

export interface DailyStats {
  id?: number;
  date: string; // YYYY-MM-DD
  wordsLearned: number;
  flashcardsReviewed: number;
  grammarLessonsCompleted: number;
  readingMinutes: number;
  writingMinutes: number;
  speakingMinutes: number;
  xpEarned: number;
  streakDay: number;
}

export interface Achievement {
  id?: number;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  xpReward: number;
}

export interface UserProfile {
  id?: number;
  name: string;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  preferences: {
    theme: "dark" | "light" | "system";
    dailyGoalMinutes: number;
    dailyGoalWords: number;
  };
}

export interface FlashcardReviewLog {
  id?: number;
  flashcardId: number;
  rating: "easy" | "medium" | "hard";
  reviewedAt: Date;
}

class EnglishHubDB extends Dexie {
  vocabWords!: Table<VocabWord>;
  flashcards!: Table<Flashcard>;
  grammarTopics!: Table<GrammarTopic>;
  sentences!: Table<Sentence>;
  readingSessions!: Table<ReadingSession>;
  writingEntries!: Table<WritingEntry>;
  speakingSessions!: Table<SpeakingSession>;
  studyPlans!: Table<StudyPlan>;
  dailyStats!: Table<DailyStats>;
  achievements!: Table<Achievement>;
  userProfile!: Table<UserProfile>;
  flashcardReviewLogs!: Table<FlashcardReviewLog>;

  constructor() {
    super("EnglishLearningHub");

    this.version(1).stores({
      vocabWords: "++id, word, category, difficulty, isFavorite, createdAt",
      flashcards: "++id, wordId, nextReviewDate, difficulty, createdAt",
      grammarTopics: "++id, category, isCompleted",
      sentences: "++id, category, isFavorite, createdAt",
      readingSessions: "++id, isCompleted, createdAt",
      writingEntries: "++id, createdAt, updatedAt",
      speakingSessions: "++id, createdAt",
      studyPlans: "++id, dayOfWeek, isActive",
      dailyStats: "++id, date",
      achievements: "++id, unlockedAt",
      userProfile: "++id",
      flashcardReviewLogs: "++id, flashcardId, reviewedAt",
    });
  }
}

export const db = new EnglishHubDB();

// Seed default grammar topics
export async function seedGrammarTopics() {
  const count = await db.grammarTopics.count();
  if (count > 0) return;

  const topics: Omit<GrammarTopic, "id">[] = [
    {
      title: "Present Simple",
      category: "Tenses",
      explanation: "The present simple tense is used to express habitual actions, general truths, and permanent states.",
      rules: [
        "Add -s or -es for third person singular (he/she/it)",
        "Use do/does for questions and negatives",
        "For stative verbs, prefer present simple over continuous",
      ],
      examples: [
        "I work every day.",
        "She plays the piano.",
        "Water boils at 100°C.",
        "Do you speak English?",
      ],
      commonMistakes: [
        "He work (should be: He works)",
        "Does she works? (should be: Does she work?)",
      ],
      notes: "Also used for scheduled future events: 'The train leaves at 8 AM.'",
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      title: "Past Simple",
      category: "Tenses",
      explanation: "Used to talk about completed actions in the past.",
      rules: [
        "Regular verbs: add -ed",
        "Irregular verbs: learn by heart",
        "Use did for questions and negatives",
      ],
      examples: [
        "I visited Paris last year.",
        "She didn't come to the party.",
        "Did you see that movie?",
      ],
      commonMistakes: [
        "I did go (in simple past without emphasis, use: I went)",
        "Did you went? (should be: Did you go?)",
      ],
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      title: "Present Perfect",
      category: "Tenses",
      explanation: "Connects past actions to the present moment.",
      rules: [
        "Form: have/has + past participle",
        "Use with: just, already, yet, ever, never, for, since",
        "Don't use with specific past time expressions",
      ],
      examples: [
        "I have just finished my homework.",
        "Have you ever been to Japan?",
        "She has worked here for 5 years.",
      ],
      commonMistakes: [
        "I have seen him yesterday (use past simple with 'yesterday')",
        "I have went (should be: I have gone)",
      ],
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      title: "Modal Verbs",
      category: "Modal Verbs",
      explanation: "Modal verbs express ability, possibility, permission, obligation, and more.",
      rules: [
        "No -s in third person: He can (not cans)",
        "Followed by bare infinitive",
        "No 'to' after modal (except ought to, used to)",
      ],
      examples: [
        "You must wear a seatbelt. (obligation)",
        "She can speak three languages. (ability)",
        "It might rain tomorrow. (possibility)",
        "Could you help me? (polite request)",
      ],
      commonMistakes: [
        "He can to swim (remove 'to')",
        "She musts go (no -s on modals)",
      ],
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      title: "Passive Voice",
      category: "Passive Voice",
      explanation: "Used when the action is more important than who performs it.",
      rules: [
        "Form: be + past participle",
        "The agent is introduced with 'by'",
        "Every tense can be made passive",
      ],
      examples: [
        "The book was written by Hemingway.",
        "English is spoken worldwide.",
        "The project will be completed next week.",
      ],
      commonMistakes: [
        "The letter was wrote (should be: written)",
        "It was builded (should be: built)",
      ],
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      title: "Conditionals",
      category: "Conditionals",
      explanation: "Conditional sentences express cause and effect or hypothetical situations.",
      rules: [
        "Zero: If + present, present (general truths)",
        "First: If + present, will + infinitive (real possibility)",
        "Second: If + past, would + infinitive (unreal/hypothetical)",
        "Third: If + past perfect, would have + past participle (past hypothetical)",
      ],
      examples: [
        "If you heat ice, it melts. (zero)",
        "If it rains, I will stay home. (first)",
        "If I had a car, I would drive to work. (second)",
        "If I had studied harder, I would have passed. (third)",
      ],
      commonMistakes: [
        "If I will come... (no 'will' in the if-clause of first conditional)",
        "If I would have... (no 'would' in the if-clause of third conditional)",
      ],
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      title: "Articles",
      category: "Articles",
      explanation: "Articles (a, an, the) signal whether a noun is specific or general.",
      rules: [
        "'a' before consonant sounds, 'an' before vowel sounds",
        "'the' for specific or previously mentioned nouns",
        "No article for plural/uncountable nouns in general statements",
      ],
      examples: [
        "I saw a dog. The dog was barking.",
        "She is an engineer.",
        "I love music. (no article for general)",
        "The sun rises in the east.",
      ],
      commonMistakes: [
        "She is a honest person (should be: an honest)",
        "He plays the football (no article with sports)",
      ],
      isCompleted: false,
      createdAt: new Date(),
    },
    {
      title: "Gerunds and Infinitives",
      category: "Gerunds and Infinitives",
      explanation: "Gerunds (-ing forms) and infinitives (to + verb) serve as nouns.",
      rules: [
        "Some verbs take gerunds: enjoy, avoid, finish, mind",
        "Some verbs take infinitives: want, hope, plan, decide",
        "Some verbs take both: like, love, hate, begin, start",
      ],
      examples: [
        "I enjoy swimming. (gerund after enjoy)",
        "She wants to learn English. (infinitive after want)",
        "He started learning / to learn. (both possible)",
      ],
      commonMistakes: [
        "I enjoy to swim (should be: enjoy swimming)",
        "She avoided to go (should be: avoided going)",
      ],
      isCompleted: false,
      createdAt: new Date(),
    },
  ];

  await db.grammarTopics.bulkAdd(topics);
}

// Seed default sentences
export async function seedSentences() {
  const count = await db.sentences.count();
  if (count > 0) return;

  const sentences: Omit<Sentence, "id">[] = [
    { english: "Could you please repeat that?", persian: "می‌تونید دوباره بگید؟", category: "Daily Life", isFavorite: false, createdAt: new Date() },
    { english: "I'd like to make a reservation.", persian: "می‌خوام یه رزرو انجام بدم.", category: "Travel", isFavorite: false, createdAt: new Date() },
    { english: "Let's schedule a meeting.", persian: "بیاید یه جلسه برنامه‌ریزی کنیم.", category: "Work", isFavorite: false, createdAt: new Date() },
    { english: "Could you walk me through the process?", persian: "می‌تونید مراحل رو برام توضیح بدید؟", category: "Work", isFavorite: false, createdAt: new Date() },
    { english: "I'm not sure I follow.", persian: "مطمئن نیستم درست متوجه شدم.", category: "Daily Life", isFavorite: false, createdAt: new Date() },
    { english: "Could you give me a hand?", persian: "می‌تونید کمکم کنید؟", category: "Daily Life", isFavorite: false, createdAt: new Date() },
    { english: "What are the check-in hours?", persian: "ساعت‌های چک‌این چیه؟", category: "Travel", isFavorite: false, createdAt: new Date() },
    { english: "I'd appreciate your feedback.", persian: "ممنون می‌شم نظرتون رو بگید.", category: "Business", isFavorite: false, createdAt: new Date() },
    { english: "Can you tell me more about your experience?", persian: "می‌تونید بیشتر درباره تجربه‌تون بگید؟", category: "Interview", isFavorite: false, createdAt: new Date() },
    { english: "I'm currently pursuing a degree in...", persian: "در حال تحصیل در رشته... هستم.", category: "University", isFavorite: false, createdAt: new Date() },
    { english: "Could you recommend a good restaurant nearby?", persian: "می‌تونید یه رستوران خوب در نزدیکی معرفی کنید؟", category: "Travel", isFavorite: false, createdAt: new Date() },
    { english: "I'll get back to you shortly.", persian: "به زودی خبرتون می‌کنم.", category: "Business", isFavorite: false, createdAt: new Date() },
    { english: "How do I debug this issue?", persian: "چطور این مشکل رو دیباگ کنم؟", category: "Technology", isFavorite: false, createdAt: new Date() },
    { english: "Nice to meet you!", persian: "از آشنایی‌تون خوشحالم!", category: "Social", isFavorite: false, createdAt: new Date() },
    { english: "What's the best way to get there?", persian: "بهترین راه رسیدن به اونجا چیه؟", category: "Travel", isFavorite: false, createdAt: new Date() },
  ];

  await db.sentences.bulkAdd(sentences);
}

// Seed default user profile
export async function seedUserProfile() {
  const count = await db.userProfile.count();
  if (count > 0) return;

  await db.userProfile.add({
    name: "Learner",
    level: 1,
    xp: 0,
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString().split("T")[0],
    preferences: {
      theme: "dark",
      dailyGoalMinutes: 30,
      dailyGoalWords: 10,
    },
  });
}

// Helper: get today's stats
export async function getTodayStats(): Promise<DailyStats> {
  const today = new Date().toISOString().split("T")[0];
  const existing = await db.dailyStats.where("date").equals(today).first();
  if (existing) return existing;

  const profile = await db.userProfile.orderBy("id").first();
  const newStats: Omit<DailyStats, "id"> = {
    date: today,
    wordsLearned: 0,
    flashcardsReviewed: 0,
    grammarLessonsCompleted: 0,
    readingMinutes: 0,
    writingMinutes: 0,
    speakingMinutes: 0,
    xpEarned: 0,
    streakDay: profile?.streak ?? 0,
  };
  const id = await db.dailyStats.add(newStats);
  return { ...newStats, id };
}

// Helper: update today's stats
export async function updateTodayStats(updates: Partial<Omit<DailyStats, "id" | "date">>) {
  const today = new Date().toISOString().split("T")[0];
  const existing = await db.dailyStats.where("date").equals(today).first();
  if (existing?.id) {
    await db.dailyStats.update(existing.id, updates);
  } else {
    await getTodayStats();
    const fresh = await db.dailyStats.where("date").equals(today).first();
    if (fresh?.id) await db.dailyStats.update(fresh.id, updates);
  }
}

// SM-2 Spaced Repetition Algorithm
export function calculateNextReview(
  flashcard: Pick<Flashcard, "interval" | "repetitions" | "easeFactor">,
  rating: "easy" | "medium" | "hard"
) {
  const qualityMap = { easy: 5, medium: 3, hard: 1 };
  const q = qualityMap[rating];

  let { interval, repetitions, easeFactor } = flashcard;

  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return { interval, repetitions, easeFactor, nextReviewDate };
}

// XP rewards
export const XP_REWARDS = {
  wordAdded: 5,
  flashcardReviewed: 2,
  grammarCompleted: 20,
  readingCompleted: 15,
  writingEntry: 10,
  speakingSession: 10,
  dailyStreak: 5,
};
