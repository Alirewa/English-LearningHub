"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Trophy, Star, Flame, BookOpen, CreditCard, GraduationCap, PenLine, Mic, Lock } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  xpReward: number;
  check: (stats: {
    vocabCount: number;
    flashcardCount: number;
    grammarCompleted: number;
    writingCount: number;
    speakingCount: number;
    streak: number;
    totalXp: number;
  }) => boolean;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "first_word",
    name: "First Word",
    description: "Add your first vocabulary word",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    xpReward: 10,
    check: ({ vocabCount }) => vocabCount >= 1,
  },
  {
    id: "vocab_10",
    name: "Word Collector",
    description: "Learn 10 vocabulary words",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    xpReward: 25,
    check: ({ vocabCount }) => vocabCount >= 10,
  },
  {
    id: "vocab_50",
    name: "Vocabulary Builder",
    description: "Learn 50 vocabulary words",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/20",
    xpReward: 100,
    check: ({ vocabCount }) => vocabCount >= 50,
  },
  {
    id: "vocab_100",
    name: "Word Master",
    description: "Learn 100 vocabulary words",
    icon: BookOpen,
    color: "text-blue-300",
    bg: "bg-blue-400/20",
    xpReward: 250,
    check: ({ vocabCount }) => vocabCount >= 100,
  },
  {
    id: "first_flashcard",
    name: "Card Player",
    description: "Review your first flashcard",
    icon: CreditCard,
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    xpReward: 10,
    check: ({ flashcardCount }) => flashcardCount >= 1,
  },
  {
    id: "flashcard_50",
    name: "Review Champion",
    description: "Review 50 flashcards",
    icon: CreditCard,
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    xpReward: 75,
    check: ({ flashcardCount }) => flashcardCount >= 50,
  },
  {
    id: "grammar_first",
    name: "Grammar Student",
    description: "Complete your first grammar lesson",
    icon: GraduationCap,
    color: "text-green-400",
    bg: "bg-green-500/15",
    xpReward: 20,
    check: ({ grammarCompleted }) => grammarCompleted >= 1,
  },
  {
    id: "grammar_all",
    name: "Grammar Master",
    description: "Complete all grammar lessons",
    icon: GraduationCap,
    color: "text-green-300",
    bg: "bg-green-400/20",
    xpReward: 500,
    check: ({ grammarCompleted }) => grammarCompleted >= 8,
  },
  {
    id: "streak_3",
    name: "On Fire",
    description: "Maintain a 3-day learning streak",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    xpReward: 30,
    check: ({ streak }) => streak >= 3,
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    xpReward: 100,
    check: ({ streak }) => streak >= 7,
  },
  {
    id: "streak_30",
    name: "Unstoppable",
    description: "Maintain a 30-day streak",
    icon: Flame,
    color: "text-red-400",
    bg: "bg-red-500/15",
    xpReward: 500,
    check: ({ streak }) => streak >= 30,
  },
  {
    id: "writing_first",
    name: "First Entry",
    description: "Write your first journal entry",
    icon: PenLine,
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
    xpReward: 10,
    check: ({ writingCount }) => writingCount >= 1,
  },
  {
    id: "writing_10",
    name: "Daily Writer",
    description: "Write 10 journal entries",
    icon: PenLine,
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
    xpReward: 100,
    check: ({ writingCount }) => writingCount >= 10,
  },
  {
    id: "speaking_first",
    name: "First Words",
    description: "Complete your first speaking session",
    icon: Mic,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
    xpReward: 10,
    check: ({ speakingCount }) => speakingCount >= 1,
  },
  {
    id: "speaking_10",
    name: "Confident Speaker",
    description: "Complete 10 speaking sessions",
    icon: Mic,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
    xpReward: 100,
    check: ({ speakingCount }) => speakingCount >= 10,
  },
  {
    id: "xp_500",
    name: "Rising Star",
    description: "Earn 500 total XP",
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
    xpReward: 50,
    check: ({ totalXp }) => totalXp >= 500,
  },
  {
    id: "xp_2000",
    name: "XP Legend",
    description: "Earn 2000 total XP",
    icon: Trophy,
    color: "text-yellow-300",
    bg: "bg-yellow-400/15",
    xpReward: 200,
    check: ({ totalXp }) => totalXp >= 2000,
  },
];

export default function AchievementsPage() {
  const profile = useLiveQuery(() => db.userProfile.orderBy("id").first());
  const vocabCount = useLiveQuery(() => db.vocabWords.count());
  const flashcardCount = useLiveQuery(async () => {
    const logs = await db.flashcardReviewLogs.count();
    return logs;
  });
  const grammarCompleted = useLiveQuery(() =>
    db.grammarTopics.where("isCompleted").equals(1).count()
  );
  const writingCount = useLiveQuery(() => db.writingEntries.count());
  const speakingCount = useLiveQuery(() => db.speakingSessions.count());

  const stats = {
    vocabCount: vocabCount ?? 0,
    flashcardCount: flashcardCount ?? 0,
    grammarCompleted: grammarCompleted ?? 0,
    writingCount: writingCount ?? 0,
    speakingCount: speakingCount ?? 0,
    streak: profile?.streak ?? 0,
    totalXp: profile?.totalXp ?? 0,
  };

  const unlockedIds = ACHIEVEMENT_DEFS
    .filter((a) => a.check(stats))
    .map((a) => a.id);

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENT_DEFS.length;

  return (
    <div>
      <Header
        title="Achievements"
        subtitle={`${unlockedCount}/${totalCount} unlocked`}
      />

      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Progress Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-gradient-to-br from-yellow-500/5 to-card p-6 flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              {unlockedCount} of {totalCount} Achievements Unlocked
            </h3>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-yellow-400"
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {totalCount - unlockedCount} more to unlock
            </p>
          </div>
        </motion.div>

        {/* Unlocked */}
        {unlockedCount > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Unlocked
            </h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {ACHIEVEMENT_DEFS.filter((a) => unlockedIds.includes(a.id)).map((ach) => (
                <motion.div
                  key={ach.id}
                  variants={item}
                  className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center gap-3 hover:border-yellow-500/30 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ach.bg}`}>
                    <ach.icon className={`w-6 h-6 ${ach.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{ach.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ach.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    +{ach.xpReward} XP
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Locked */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Locked
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            {ACHIEVEMENT_DEFS.filter((a) => !unlockedIds.includes(a.id)).map((ach) => (
              <motion.div
                key={ach.id}
                variants={item}
                className="rounded-xl border border-border bg-card/50 p-4 flex flex-col items-center text-center gap-3 opacity-50"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{ach.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ach.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  +{ach.xpReward} XP
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
