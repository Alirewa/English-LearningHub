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
  interval: number;
  repetitions: number;
  easeFactor: number;
  lastReviewedAt?: Date;
  createdAt: Date;
}

export interface GrammarTopic {
  id?: number;
  title: string;         // English title
  titleFa: string;       // Persian title
  category: string;
  explanation: string;   // English explanation
  explanationFa: string; // Persian explanation
  usagesFa: string;      // Persian usages
  formula: string;       // English formula
  formulaFa: string;     // Persian formula
  keyNotesFa: string;    // Persian key notes
  rules: string[];       // English rules array
  examples: string[];    // Examples
  commonMistakes: string[];
  summaryFa: string;     // Persian summary
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
  readTime?: number;
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
  duration?: number;
  createdAt: Date;
}

export interface StudyPlan {
  id?: number;
  name: string;
  dayOfWeek: number;
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
  date: string;
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

// 21 bilingual grammar topics from user's personal study list
const GRAMMAR_TOPICS_DATA: Omit<GrammarTopic, "id">[] = [
  {
    title: "Possessive Adjectives & Pronouns",
    titleFa: "ضمایر ملکی و صفات ملکی",
    category: "Pronouns",
    explanation: "Possessive adjectives and pronouns show ownership. Adjectives come before a noun; pronouns replace a noun to avoid repetition.",
    explanationFa: "صفات ملکی و ضمایر ملکی برای نشان دادن مالکیت استفاده می‌شوند. صفات ملکی همیشه قبل از اسم می‌آیند اما ضمایر ملکی به تنهایی می‌آیند و جانشین اسم می‌شوند.",
    usagesFa: "نشان دادن مالکیت مستقیم (This is my book) و جایگزینی اسم برای جلوگیری از تکرار (This book is mine). کاربرد در آیلتس برای بالا رفتن نمره انسجام.",
    formula: "Adjective: my/your/his/her/its/our/their + Noun | Pronoun: mine/yours/his/hers/ours/theirs (standalone)",
    formulaFa: "I → my → mine | You → your → yours | He → his → his | She → her → hers. نکته: it فقط صفت ملکی its دارد و ضمیر ملکی ندارد.",
    keyNotesFa: "ضمیر ملکی هرگز اسم بعد از خود قبول نمی‌کند (mine book غلط است). هرگز از آپاستروف برای صفت ملکی its استفاده نکنید.",
    rules: [
      "Possessive adjective + noun: 'my book', 'her car'",
      "Possessive pronoun stands alone: 'The book is mine'",
      "'its' = possessive adjective (no apostrophe); 'it's' = it is",
    ],
    examples: [
      "Every student must bring their own laptop.",
      "The laptop on the table is mine, not yours.",
      "She lent me her notes. Mine were incomplete.",
    ],
    commonMistakes: [
      "❌ mine book → ✅ my book (adjective needs a noun)",
      "❌ The cat licked it's paw → ✅ its paw",
    ],
    summaryFa: "صفات ملکی همیشه به یک اسم می‌چسبند؛ ضمایر ملکی جانشین اسم می‌شوند. دقت به تفاوت its و it's در آیلتس حیاتی است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Countable Nouns",
    titleFa: "اسامی قابل شمارش",
    category: "Nouns",
    explanation: "Nouns we can count as separate units. They have singular and plural forms.",
    explanationFa: "اسم‌هایی که می‌توانیم آن‌ها را به عنوان واحدهای مجزا بشماریم و حالت مفرد و جمع دارند.",
    usagesFa: "اشاره به یک شیء (I have a car) و بیش از یک مورد (She has three cars).",
    formula: "Singular: a/an + Noun | Plural: Noun + s/es (regular) or irregular (man→men)",
    formulaFa: "حالت مفرد (a/an + Noun)، جمع باقاعده (+s/es) و بی‌قاعده (man → men).",
    keyNotesFa: "اسم مفرد قابل شمارش هرگز در جمله بدون حرف تعریف (a/an) نمی‌آید.",
    rules: [
      "Use a/an with singular countable nouns",
      "Use many/few with plurals",
      "Irregular plurals must be memorised: child→children, tooth→teeth",
    ],
    examples: [
      "I read an interesting article yesterday.",
      "People have different opinions.",
      "There are three children in the park.",
    ],
    commonMistakes: [
      "❌ I have car → ✅ I have a car",
      "❌ much books → ✅ many books",
    ],
    summaryFa: "همیشه به حروف تعریفی مثل a/an نیاز دارند. برای تعداد زیاد از many و تعداد کم از a few استفاده می‌کنیم.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Uncountable Nouns",
    titleFa: "اسامی غیر قابل شمارش",
    category: "Nouns",
    explanation: "Nouns that cannot be counted as individual units (water, money). Always singular; no plural form.",
    explanationFa: "اسم‌هایی که نمی‌توانیم تکی بشماریم (مثل آب، پول). همیشه مفرد هستند و جمع ندارند.",
    usagesFa: "اشاره به مایعات، مواد، گازها و مفاهیم کلی (I need some water).",
    formula: "No a/an | Singular verb always | Quantifiers: much / a little / some / a lot of",
    formulaFa: "همیشه بدون حروف تعریف a/an و همراه با فعل مفرد. نشان‌دهنده‌های مقدار: much, a little, some.",
    keyNotesFa: "جمع بستن این اسامی غلط است (informations غلط است).",
    rules: [
      "Never use a/an before uncountable nouns",
      "Verb is always singular: 'The news is good'",
      "Use much/little (not many/few) for quantity",
    ],
    examples: [
      "The news is very good today.",
      "Money does not buy happiness.",
      "I need some advice.",
    ],
    commonMistakes: [
      "❌ informations → ✅ information",
      "❌ a furniture → ✅ a piece of furniture",
      "❌ many advices → ✅ much advice",
    ],
    summaryFa: "هرگز جمع بسته نمی‌شوند و فعل آن‌ها مفرد است. اطلاعات، اخبار، مبلمان همیشه غیرقابل شمارش‌اند.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Present Continuous",
    titleFa: "حال استمراری",
    category: "Tenses",
    explanation: "Used for actions happening right now or temporary situations.",
    explanationFa: "برای کارهایی که در همین لحظه در حال انجام‌اند یا شرایط موقتی استفاده می‌شود.",
    usagesFa: "کارهای در حال انجام در لحظه صحبت و شرایط موقت (She is living in London for a few months).",
    formula: "Subject + am/is/are + Verb-ing",
    formulaFa: "Subject + am/is/are + Verb(ing).",
    keyNotesFa: "افعال حسی، احساسی و ذهنی (مثل know, love, believe) نباید استمراری شوند.",
    rules: [
      "Add -ing to the base verb (double consonant if needed: run→running)",
      "Stative/mental verbs (know, want, love) are NOT used in continuous",
      "Also used for planned future: 'I am meeting him tomorrow'",
    ],
    examples: [
      "I am reading a book right now.",
      "The climate is changing rapidly.",
      "She is living in London for a few months.",
    ],
    commonMistakes: [
      "❌ I am knowing the answer → ✅ I know the answer",
      "❌ She is haveing fun → ✅ She is having fun",
    ],
    summaryFa: "مناسب برای موقعیت‌های موقتی و روندهای در حال تغییر. افعال ذهنی در این ساختار جای ندارند.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Simple Future",
    titleFa: "آینده ساده",
    category: "Tenses",
    explanation: "Used for predictions, spontaneous decisions, and promises about the future.",
    explanationFa: "برای اتفاقاتی که هنوز رخ نداده‌اند (پیش‌بینی، قول، تصمیم لحظه‌ای).",
    usagesFa: "پیش‌بینی بر اساس حدس (It will rain tomorrow) و تصمیم لحظه‌ای (I will answer).",
    formula: "Subject + will + Verb (base form) | Negative: won't + Verb",
    formulaFa: "Subject + will + Verb (base form).",
    keyNotesFa: "فعل اصلی همیشه کاملاً ساده می‌آید. نباید از to قبل از فعل استفاده کرد (He will to go غلط است).",
    rules: [
      "will + base verb (no -s, no -ing, no to)",
      "Use 'will' for spontaneous decisions made at the moment of speaking",
      "Use 'going to' for pre-planned future actions",
    ],
    examples: [
      "I will call you later.",
      "Technology will change our lives.",
      "I think it will rain tonight.",
    ],
    commonMistakes: [
      "❌ He will to go → ✅ He will go",
      "❌ She will goes → ✅ She will go",
    ],
    summaryFa: "برای برنامه‌های از پیش تعیین شده مناسب نیست. فعل اصلی بدون هیچ پسوندی استفاده می‌شود.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Simple Present",
    titleFa: "حال ساده",
    category: "Tenses",
    explanation: "Used for habits, routines, scientific facts, and permanent states.",
    explanationFa: "برای بیان عادت‌ها، روتین‌ها، حقایق علمی و شرایط دائمی.",
    usagesFa: "عادت‌ها (I wake up early) و حقایق علمی (Water boils at 100 degrees).",
    formula: "I/You/We/They + Verb | He/She/It + Verb+s/es | Negative: do/does + not + Verb",
    formulaFa: "Subject + Verb (s/es برای سوم شخص مفرد). منفی: do/does + not.",
    keyNotesFa: "فراموش کردن s یا es برای سوم شخص مفرد خطای رایجی است.",
    rules: [
      "Add -s/-es for third person singular (he/she/it)",
      "Use do/does for negatives and questions",
      "Also used for schedules: 'The train leaves at 8'",
    ],
    examples: [
      "The sun rises in the east.",
      "She works for an international company.",
      "Water boils at 100°C.",
    ],
    commonMistakes: [
      "❌ She work every day → ✅ She works every day",
      "❌ Does she works? → ✅ Does she work?",
    ],
    summaryFa: "در جملات مثبت حتماً به فعل سوم شخص مفرد s/es اضافه کنید. در حالت منفی و سوالی فعل ساده می‌آید.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Simple Past",
    titleFa: "گذشته ساده",
    category: "Tenses",
    explanation: "Used for completed actions that happened at a specific time in the past.",
    explanationFa: "برای کارهایی که در زمان مشخص در گذشته شروع و کاملاً تمام شده‌اند.",
    usagesFa: "کارهای تمام شده در یک زمان مشخص (I visited my friend yesterday).",
    formula: "Subject + Verb-ed (regular) / irregular form | Negative: did not + base verb | Question: Did + Subject + base verb?",
    formulaFa: "Subject + Verb (ed / irregular). منفی: did + not + Verb (base form).",
    keyNotesFa: "در جملات منفی و سوالی با did، فعل اصلی باید ساده بیاید (did not went غلط است).",
    rules: [
      "Regular: add -ed (walk→walked)",
      "Irregular: learn by heart (go→went, buy→bought)",
      "Never use 'did' with a past form: 'Did you went?' is wrong",
    ],
    examples: [
      "The company opened a new branch in 2020.",
      "Did you finish your project?",
      "She didn't come to the party.",
    ],
    commonMistakes: [
      "❌ Did you went? → ✅ Did you go?",
      "❌ I did not went → ✅ I did not go",
    ],
    summaryFa: "ارتباطی با زمان حال ندارد. نشانه زمانی (مثل دیروز، last year) کلید تشخیص آن است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Adverbs of Frequency",
    titleFa: "قیدهای تکرار",
    category: "Adverbs",
    explanation: "Show how often an action happens. Used mainly with simple present tense.",
    explanationFa: "نشان می‌دهند یک کار چند وقت یک‌بار انجام می‌شود. معمولاً با حال ساده می‌آیند.",
    usagesFa: "نشان دادن میزان تکرار عادت‌ها (I always wake up early).",
    formula: "Subject + adverb + main verb | Subject + to be + adverb",
    formulaFa: "قبل از فعل اصلی می‌آیند. اما بعد از افعال to be قرار می‌گیرند.",
    keyNotesFa: "قیدهایی مثل never یا hardly ever ذاتاً منفی‌اند و نباید با فعل منفی بیایند.",
    rules: [
      "Place before the main verb: 'I always eat breakfast'",
      "Place after 'to be': 'She is usually late'",
      "Order: always / usually / often / sometimes / rarely / never",
    ],
    examples: [
      "I always check my emails in the morning.",
      "She is usually late for meetings.",
      "He hardly ever goes to the gym.",
    ],
    commonMistakes: [
      "❌ I eat always breakfast → ✅ I always eat breakfast",
      "❌ I don't never lie → ✅ I never lie",
    ],
    summaryFa: "جایگاه درست آن‌ها قبل از فعل اصلی و بعد از افعال To be است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Infinitives",
    titleFa: "کاربرد مصدر",
    category: "Verb Forms",
    explanation: "The base form of a verb, usually with 'to'. Used to show purpose or after certain verbs.",
    explanationFa: "شکل پایه فعل معمولاً با to که برای نشان دادن هدف یا بعد از افعال خاص می‌آید.",
    usagesFa: "نشان دادن هدف و نیت (I study hard to pass) یا بعد از افعالی مثل decide و want.",
    formula: "to + base verb | Negative: not + to + verb | After: want, need, decide, plan, hope, try, manage",
    formulaFa: "to + Verb (base form). منفی: not + to + Verb.",
    keyNotesFa: "استفاده از for به جای to برای بیان هدف (for buy milk) غلط است.",
    rules: [
      "After verbs: want, decide, hope, plan, manage, try, need",
      "To show purpose: 'I go to the gym to stay fit'",
      "Negative infinitive: 'Try not to be late'",
    ],
    examples: [
      "I am learning English to get a better job.",
      "She decided to study abroad.",
      "He tried not to laugh.",
    ],
    commonMistakes: [
      "❌ I go to the shop for buy milk → ✅ to buy milk",
      "❌ She wants go → ✅ She wants to go",
    ],
    summaryFa: "برای نشان دادن هدف عالی است. برای منفی کردن مستقیماً not قبل از to می‌آید.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Modal Verbs",
    titleFa: "افعال کمکی وجهی",
    category: "Modal Verbs",
    explanation: "Auxiliary verbs (can, must, should, might…) expressing ability, obligation, permission, or possibility.",
    explanationFa: "افعالی (can, must, should) که توانایی، اجبار یا اجازه را نشان می‌دهند.",
    usagesFa: "بیان توانایی (I can speak) و اجبار (You must wear a seatbelt).",
    formula: "Subject + modal + base verb (no to, no -s)",
    formulaFa: "Subject + Modal Verb + Main Verb (base form).",
    keyNotesFa: "فعل اصلی بعد از آن‌ها همیشه ساده است (can to swim غلط است). هیچ پسوند s نمی‌گیرند.",
    rules: [
      "No -s in 3rd person: 'He can' (not 'He cans')",
      "Followed by bare infinitive (no 'to'): 'You must go'",
      "can=ability | must=strong obligation | should=advice | might=possibility",
    ],
    examples: [
      "You should eat more vegetables.",
      "It might rain later today.",
      "She can speak three languages.",
    ],
    commonMistakes: [
      "❌ He can to swim → ✅ He can swim",
      "❌ She musts go → ✅ She must go",
    ],
    summaryFa: "خودشان فعل کمکی هستند و نیازی به do/does ندارند. بهترین ساختار برای دادن پیشنهاد در آیلتس.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Past Continuous",
    titleFa: "گذشته استمراری",
    category: "Tenses",
    explanation: "Used for an action in progress at a specific past moment, or interrupted by another action.",
    explanationFa: "برای کاری که در یک زمان مشخص در گذشته در جریان بوده یا توسط کار دیگری قطع شده.",
    usagesFa: "کارهای همزمان در گذشته یا کاری که قطع شده (I was studying when the phone rang).",
    formula: "Subject + was/were + Verb-ing",
    formulaFa: "Subject + was/were + Verb(ing).",
    keyNotesFa: "معمولاً با when و while همراه است. افعال حسی نباید استمراری شوند.",
    rules: [
      "Use 'was' for I/he/she/it; 'were' for you/we/they",
      "Combined with simple past: 'I was cooking when she called'",
      "Two simultaneous past actions: 'While I was reading, he was watching TV'",
    ],
    examples: [
      "She was reading a book while he was cooking dinner.",
      "I was studying when the phone rang.",
      "It was raining when we left the house.",
    ],
    commonMistakes: [
      "❌ I were watching → ✅ I was watching",
      "❌ He was know the answer → ✅ He knew (stative verb)",
    ],
    summaryFa: "برای تصویرسازی پس‌زمینه داستان در گذشته عالی است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Present Perfect",
    titleFa: "ماضی نقلی / حال کامل",
    category: "Tenses",
    explanation: "Connects past actions to the present moment. The result of the action is still relevant now.",
    explanationFa: "پلی بین گذشته و حال؛ کارهایی که در گذشته انجام شده اما نتیجه آن در حال باقی است.",
    usagesFa: "بیان تجربیات زندگی (I have visited Paris) و کارهای اخیراً انجام شده.",
    formula: "Subject + have/has + Past Participle (V3) | Keywords: just, already, yet, ever, never, for, since",
    formulaFa: "Subject + have/has + Past Participle (V3).",
    keyNotesFa: "استفاده از زمان‌های دقیق مثل yesterday در این گرامر کاملاً غلط است.",
    rules: [
      "Use 'have' for I/you/we/they; 'has' for he/she/it",
      "Do NOT use with specific past times: yesterday, last year, in 2020",
      "'for' = duration; 'since' = starting point",
    ],
    examples: [
      "The population has increased significantly.",
      "I have just finished my homework.",
      "Have you ever been to Japan?",
    ],
    commonMistakes: [
      "❌ I have seen him yesterday → ✅ I saw him yesterday",
      "❌ I have went there → ✅ I have gone there",
    ],
    summaryFa: "تمرکز روی نتیجه در زمان حال است، نه زمان دقیق انجام کار.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Conditionals",
    titleFa: "جملات شرطی",
    category: "Conditionals",
    explanation: "Conditional sentences express cause and effect or hypothetical situations. Three main types.",
    explanationFa: "دارای بخش شرط (If) و بخش نتیجه. سه نوع اصلی دارند.",
    usagesFa: "نوع اول (واقعی)، نوع دوم (خیالی در حال)، نوع سوم (حسرت گذشته).",
    formula: "Type 1: If + present → will | Type 2: If + past → would | Type 3: If + past perfect → would have + V3",
    formulaFa: "نوع ۱ (حال ساده + آینده ساده)، نوع ۲ (گذشته ساده + would).",
    keyNotesFa: "فعل آینده ساز (will/would) هرگز بلافاصله بعد از if نمی‌آید.",
    rules: [
      "Type 1 (real): If + present simple, will + infinitive",
      "Type 2 (unreal present): If + past simple, would + infinitive",
      "Type 3 (unreal past): If + past perfect, would have + past participle",
    ],
    examples: [
      "If it rains, I will stay home. (Type 1)",
      "If I had a car, I would drive to work. (Type 2)",
      "If I had studied harder, I would have passed. (Type 3)",
    ],
    commonMistakes: [
      "❌ If I will come → ✅ If I come (no will in if-clause)",
      "❌ If I would have time → ✅ If I had time",
    ],
    summaryFa: "اگر جمله با If شروع شود ویرگول در وسط الزامی است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Compound Sentences",
    titleFa: "جملات مرکب",
    category: "Sentence Structure",
    explanation: "Two independent clauses joined by a coordinating conjunction (FANBOYS: for, and, nor, but, or, yet, so).",
    explanationFa: "اتصال دو جمله مستقل با کلمات ربط هم‌پایه (مثل and, but, so).",
    usagesFa: "اضافه کردن اطلاعات (and) و نشان دادن تضاد (but).",
    formula: "Independent clause + , + FANBOYS + Independent clause",
    formulaFa: "Ind. Clause + , + FANBOYS + Ind. Clause.",
    keyNotesFa: "اتصال دو جمله فقط با ویرگول (Run-on) غلط است؛ حتماً کلمه ربط نیاز است.",
    rules: [
      "Always use a comma before the conjunction",
      "Each clause must be able to stand alone as a sentence",
      "FANBOYS: for, and, nor, but, or, yet, so",
    ],
    examples: [
      "The test was difficult, but she passed it.",
      "I wanted to sleep, yet I had work to finish.",
      "He studied hard, so he got a high score.",
    ],
    commonMistakes: [
      "❌ I was tired, I went to bed. (comma splice) → ✅ I was tired, so I went to bed.",
      "❌ She is smart but however honest → only one connector needed",
    ],
    summaryFa: "گذاشتن یک ویرگول دقیقاً قبل از کلمه ربط دهنده الزامی است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Articles",
    titleFa: "حروف تعریف",
    category: "Articles",
    explanation: "a/an for indefinite singular nouns; the for specific or previously mentioned nouns.",
    explanationFa: "a/an برای اسم ناشناس مفرد و the برای اسم مشخص و شناخته شده.",
    usagesFa: "(a/an) برای اشاره اول و عمومی؛ (the) برای اسامی مشخص.",
    formula: "'a' before consonant sounds | 'an' before vowel sounds | 'the' = specific | Ø = general/plural/uncountable",
    formulaFa: "a قبل از صدای بی‌صدا، an قبل از صدای صدادار.",
    keyNotesFa: "ملاک a/an صدا است نه الفبا (مثل an hour). استفاده از a/an برای اسامی جمع غلط است.",
    rules: [
      "Sound rule: 'an hour' (h is silent); 'a university' (sounds like 'you')",
      "Use 'the' for second mention: 'I saw a dog. The dog was barking'",
      "No article for general concepts: 'I love music', 'Life is short'",
    ],
    examples: [
      "The sun rises in the east.",
      "She is an IELTS student.",
      "I saw a dog. The dog was friendly.",
    ],
    commonMistakes: [
      "❌ She is a honest person → ✅ an honest person",
      "❌ He plays the football → ✅ He plays football (sports: no article)",
    ],
    summaryFa: "برای مفاهیم کلی (تکنولوژی) نباید حرف تعریفی آورد (Zero Article).",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Prepositions",
    titleFa: "حروف اضافه",
    category: "Prepositions",
    explanation: "Words that show time, place, or direction relationships (in, on, at, by, for…).",
    explanationFa: "کلماتی برای مشخص کردن زمان، مکان یا جهت حرکت (in, on, at).",
    usagesFa: "مکان (on the table) و زمان (at nine o'clock).",
    formula: "AT: precise point (time/place) | ON: surfaces, days | IN: enclosed spaces, months, years",
    formulaFa: "at برای نقطه دقیق، on برای روزها/سطوح، in برای ماه‌ها/فضاهای بزرگ.",
    keyNotesFa: "بعد از حروف اضافه فقط اسم یا ضمیر می‌آید.",
    rules: [
      "at + exact time/place: 'at 5pm', 'at the station'",
      "on + day/date/surface: 'on Monday', 'on the table'",
      "in + month/year/country: 'in January', 'in France'",
    ],
    examples: [
      "We arrived at the station at midnight.",
      "The meeting is on Monday morning.",
      "It depends on the weather.",
    ],
    commonMistakes: [
      "❌ in Monday → ✅ on Monday",
      "❌ at the morning → ✅ in the morning",
    ],
    summaryFa: "حفظ کردن حروف اضافه اختصاصی که با افعال می‌آیند (مثل depends on) برای رایتینگ ضروری است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Comparatives & Superlatives",
    titleFa: "صفات مقایسه‌ای و عالی",
    category: "Adjectives",
    explanation: "Comparatives compare two things (-er/more); superlatives show the extreme in a group (-est/most).",
    explanationFa: "برای مقایسه دو چیز (er/more) یا نشان دادن برترین حالت در یک گروه (est/most).",
    usagesFa: "مقایسه نمودارها (رایتینگ تسک ۱) و مقایسه ایده‌ها.",
    formula: "Short adj: -er than / the -est | Long adj (2+ syllables): more … than / the most …",
    formulaFa: "Adjective + er + than / the + Adjective + est.",
    keyNotesFa: "آوردن more و پسوند er با هم (more taller) کاملاً غلط است.",
    rules: [
      "1-syllable: add -er/-est (tall→taller→tallest)",
      "2+ syllables: use more/most (beautiful→more beautiful→most beautiful)",
      "Irregular: good→better→best | bad→worse→worst | far→farther→farthest",
    ],
    examples: [
      "This building is taller than that one.",
      "She is the most intelligent student in class.",
      "Today was worse than yesterday.",
    ],
    commonMistakes: [
      "❌ more taller → ✅ taller",
      "❌ the most fastest → ✅ the fastest",
    ],
    summaryFa: "شکل بی‌قاعده کلمات (good → better → best) باید حفظ شود.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Relative Clauses",
    titleFa: "جمله‌واره‌های وصفی",
    category: "Sentence Structure",
    explanation: "Clauses that act like adjectives, introduced by who, which, that, whose, where.",
    explanationFa: "مجموعه‌ای از کلمات که مثل صفت عمل می‌کنند و با کلماتی مثل who, which شروع می‌شوند.",
    usagesFa: "ترکیب دو جمله برای جلوگیری از تکرار اسم.",
    formula: "Defining: Noun + who/that/which + clause | Non-defining: Noun + , who/which + clause ,",
    formulaFa: "who برای انسان، which/that برای اشیا، whose برای مالکیت.",
    keyNotesFa: "تکرار ضمیر داخل جمله‌واره غلط است (The laptop which I bought it... غلط است).",
    rules: [
      "who = for people | which = for things | that = either (defining only)",
      "whose = possessive: 'the man whose car was stolen'",
      "Non-defining clauses use commas and cannot use 'that'",
    ],
    examples: [
      "The man who lives next door is a doctor.",
      "This is the book that changed my life.",
      "My sister, who lives in Paris, is visiting us.",
    ],
    commonMistakes: [
      "❌ The laptop which I bought it is broken → ✅ The laptop which I bought is broken",
      "❌ The woman that, I met her, is nice → ✅ The woman that I met is nice",
    ],
    summaryFa: "ابزاری عالی برای پیچیده کردن جملات؛ that برای جمله‌واره‌های غیرضروری (بین دو ویرگول) استفاده نمی‌شود.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Adverbial Clauses",
    titleFa: "جمله‌واره‌های قیدی",
    category: "Sentence Structure",
    explanation: "Clauses that work like adverbs, showing time, cause, contrast, or condition.",
    explanationFa: "مثل قید عمل می‌کنند و زمان، علت یا تضاد را با کلماتی مثل although یا because بیان می‌کنند.",
    usagesFa: "نشان دادن تضاد (Although it rained...) و بیان علت (because she wanted...).",
    formula: "Conjunction + Subject + Verb , Main clause | Common conjunctions: because, although, while, when, since, if",
    formulaFa: "کلمه ربط + فاعل + فعل.",
    keyNotesFa: "استفاده همزمان از Although و but در یک جمله کاملاً غلط است.",
    rules: [
      "If adverbial clause comes first, use a comma after it",
      "although/even though = contrast | because/since = reason | while/when = time",
      "Never combine 'although' and 'but' in the same sentence",
    ],
    examples: [
      "While some people prefer cities, others choose rural areas.",
      "Although it rained, we enjoyed the trip.",
      "She studied hard because she wanted to pass.",
    ],
    commonMistakes: [
      "❌ Although he was tired, but he worked → ✅ Although he was tired, he worked",
      "❌ Because of she was late, → ✅ Because she was late,",
    ],
    summaryFa: "اگر جمله با کلمه ربط شروع شود، ویرگول در وسط الزامی است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Passive Voice",
    titleFa: "شکل مجهول افعال",
    category: "Passive Voice",
    explanation: "Used when the focus is on the action or the object, not the doer. Common in academic and formal writing.",
    explanationFa: "وقتی تمرکز روی مفعول (کار انجام شده) است نه فاعل.",
    usagesFa: "نامشخص بودن کننده کار، فرآیندهای کارخانه‌ای و گزارش‌های آکادمیک.",
    formula: "Object + to be (correct tense) + Past Participle (V3) | Agent: by + noun (optional)",
    formulaFa: "Object + To Be (متناسب با زمان) + Past Participle (V3).",
    keyNotesFa: "افعال بدون مفعول (مثل go) مجهول نمی‌شوند. جا انداختن فعل to be از اشتباهات رایج است.",
    rules: [
      "Every tense can be made passive by changing 'be': is/was/will be/has been…",
      "The agent ('by whom') is optional — omit when unknown or unimportant",
      "Intransitive verbs (arrive, go, die) cannot be made passive",
    ],
    examples: [
      "The window was broken yesterday.",
      "English is spoken all over the world.",
      "The project will be completed next week.",
    ],
    commonMistakes: [
      "❌ The letter was wrote → ✅ was written",
      "❌ It was builded → ✅ It was built",
    ],
    summaryFa: "برای رایتینگ تسک ۱ (Process) به شدت کاربردی است.",
    isCompleted: false,
    createdAt: new Date(),
  },
  {
    title: "Reported Speech",
    titleFa: "نقل قول غیر مستقیم",
    category: "Reported Speech",
    explanation: "Reporting what someone said without quoting their exact words. Verb tenses shift back one step.",
    explanationFa: "بازگو کردن حرف دیگران بدون تکرار دقیق کلمات. زمان افعال یک پله به عقب (گذشته) می‌رود.",
    usagesFa: "ارجاع به نظرات دیگران و گزارش کردن یک سوال.",
    formula: "said/told + (that) + backshifted clause | is→was | will→would | can→could | have→had",
    formulaFa: "تبدیل حال ساده به گذشته ساده، will به would و ...",
    keyNotesFa: "در نقل قول غیرمستقیم سوالات، جمله از حالت سوالی خارج شده و خبری می‌شود (بدون do/did).",
    rules: [
      "Tense backshift: present→past, past→past perfect, will→would",
      "Pronoun changes: 'I' becomes 'he/she', 'we' becomes 'they'",
      "Reported questions use normal (statement) word order with 'if/whether'",
    ],
    examples: [
      "She asked me if I spoke English.",
      "He said that he was tired.",
      "They told me they would call later.",
    ],
    commonMistakes: [
      "❌ He said me → ✅ He told me / He said to me",
      "❌ She asked where was he → ✅ She asked where he was",
    ],
    summaryFa: "زمان، ضمایر و قیدهای مکان/زمان با توجه به شرایط باید تغییر کنند.",
    isCompleted: false,
    createdAt: new Date(),
  },
];

export async function seedGrammarTopics() {
  const count = await db.grammarTopics.count();
  if (count >= 21) {
    const first = await db.grammarTopics.orderBy("id").first();
    if (first && "titleFa" in first && first.titleFa) return;
  }
  await db.grammarTopics.clear();
  await db.grammarTopics.bulkAdd(GRAMMAR_TOPICS_DATA);
}

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

export const XP_REWARDS = {
  wordAdded: 5,
  flashcardReviewed: 2,
  grammarCompleted: 20,
  readingCompleted: 15,
  writingEntry: 10,
  speakingSession: 10,
  dailyStreak: 5,
};
