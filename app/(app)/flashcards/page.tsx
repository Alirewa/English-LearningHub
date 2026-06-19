"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, calculateNextReview, XP_REWARDS, updateTodayStats } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, AlertCircle, Zap, RotateCcw, Trophy, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { flashcards } from "@/lib/i18n/flashcards";

function FlashCard({
  front,
  back,
  onRate,
  t,
}: {
  front: string;
  back: string;
  onRate: (rating: "easy" | "medium" | "hard") => void;
  t: (typeof flashcards)["en"];
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Card */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d", position: "relative", height: "240px" }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 rounded-2xl border border-border bg-card flex flex-col items-center justify-center p-8 text-center"
          >
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{t.card.wordLabel}</p>
            <h2 className="text-3xl font-bold text-foreground">{front}</h2>
            <p className="text-sm text-muted-foreground mt-4">{t.card.flipHint}</p>
          </div>

          {/* Back */}
          <div
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-card flex flex-col items-center justify-center p-8 text-center"
          >
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{t.card.meaningLabel}</p>
            <h2 className="text-xl font-semibold text-foreground fa">{back}</h2>
          </div>
        </motion.div>
      </div>

      {/* Hint */}
      {!flipped && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground"
        >
          {t.flipHintBelow}
        </motion.p>
      )}

      {/* Rating Buttons */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="flex gap-3 w-full"
          >
            <Button
              onClick={() => onRate("hard")}
              variant="outline"
              className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {t.rating.hard}
            </Button>
            <Button
              onClick={() => onRate("medium")}
              variant="outline"
              className="flex-1 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/50 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t.rating.medium}
            </Button>
            <Button
              onClick={() => onRate("easy")}
              variant="outline"
              className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50 gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t.rating.easy}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FlashcardsPage() {
  const language = useAppStore((s) => s.language);
  const t = flashcards[language];
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCards, setSessionCards] = useState<Array<{ id: number; front: string; back: string; interval: number; repetitions: number; easeFactor: number }>>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<Array<{ rating: "easy" | "medium" | "hard" }>>([]);
  const [sessionDone, setSessionDone] = useState(false);

  const dueCards = useLiveQuery(() =>
    db.flashcards.where("nextReviewDate").belowOrEqual(new Date()).toArray()
  );
  const totalCards = useLiveQuery(() => db.flashcards.count());
  const allCards = useLiveQuery(() => db.flashcards.orderBy("createdAt").reverse().limit(20).toArray());

  const startSession = (cards: typeof sessionCards) => {
    setSessionCards(cards);
    setCurrentIdx(0);
    setResults([]);
    setSessionDone(false);
    setSessionActive(true);
  };

  const startDueSession = () => {
    if (!dueCards || dueCards.length === 0) return;
    startSession(dueCards.map((c) => ({
      id: c.id!,
      front: c.front,
      back: c.back,
      interval: c.interval,
      repetitions: c.repetitions,
      easeFactor: c.easeFactor,
    })));
  };

  const startAllSession = () => {
    if (!allCards || allCards.length === 0) return;
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    startSession(shuffled.map((c) => ({
      id: c.id!,
      front: c.front,
      back: c.back,
      interval: c.interval,
      repetitions: c.repetitions,
      easeFactor: c.easeFactor,
    })));
  };

  const handleRate = async (rating: "easy" | "medium" | "hard") => {
    const card = sessionCards[currentIdx];
    const next = calculateNextReview(card, rating);

    await db.flashcards.update(card.id, {
      ...next,
      difficulty: rating,
      lastReviewedAt: new Date(),
    });
    await db.flashcardReviewLogs.add({ flashcardId: card.id, rating, reviewedAt: new Date() });

    // Award XP
    const profile = await db.userProfile.orderBy("id").first();
    if (profile?.id) {
      await db.userProfile.update(profile.id, {
        xp: (profile.xp ?? 0) + XP_REWARDS.flashcardReviewed,
        totalXp: (profile.totalXp ?? 0) + XP_REWARDS.flashcardReviewed,
      });
    }

    const newResults = [...results, { rating }];
    setResults(newResults);

    if (currentIdx + 1 >= sessionCards.length) {
      setSessionDone(true);
      await updateTodayStats({
        flashcardsReviewed: sessionCards.length,
        xpEarned: sessionCards.length * XP_REWARDS.flashcardReviewed,
      });
      toast.success(t.toasts.sessionComplete(sessionCards.length * XP_REWARDS.flashcardReviewed));
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const easyCount = results.filter((r) => r.rating === "easy").length;
  const mediumCount = results.filter((r) => r.rating === "medium").length;
  const hardCount = results.filter((r) => r.rating === "hard").length;

  if (sessionActive && !sessionDone) {
    const current = sessionCards[currentIdx];
    const progress = (currentIdx / sessionCards.length) * 100;

    return (
      <div>
        <Header title={t.session.title} />
        <div className="p-6 max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{currentIdx + 1} / {sessionCards.length}</span>
              <span>{t.session.percentDone(Math.round(progress))}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-green-400">✓ {easyCount}</span>
              <span className="text-yellow-400">↺ {mediumCount}</span>
              <span className="text-red-400">✗ {hardCount}</span>
            </div>
          </div>

          <FlashCard
            key={currentIdx}
            front={current.front}
            back={current.back}
            onRate={handleRate}
            t={t}
          />

          <Button
            variant="ghost"
            className="mt-6 text-muted-foreground"
            onClick={() => {
              setSessionActive(false);
              setSessionDone(false);
            }}
          >
            {t.session.endSession}
          </Button>
        </div>
      </div>
    );
  }

  if (sessionDone) {
    return (
      <div>
        <Header title={t.sessionDone.title} />
        <div className="p-6 max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">{t.sessionDone.congrats}</h2>
          <p className="text-muted-foreground mb-8">
            {t.sessionDone.cardsReviewed(sessionCards.length)}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
              <p className="text-2xl font-bold text-green-400">{easyCount}</p>
              <p className="text-xs text-green-400/70 mt-1">{t.sessionDone.easy}</p>
            </div>
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="text-2xl font-bold text-yellow-400">{mediumCount}</p>
              <p className="text-xs text-yellow-400/70 mt-1">{t.sessionDone.medium}</p>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-2xl font-bold text-red-400">{hardCount}</p>
              <p className="text-xs text-red-400/70 mt-1">{t.sessionDone.hard}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSessionActive(false)}
            >
              {t.sessionDone.back}
            </Button>
            {(dueCards?.length ?? 0) > 0 && (
              <Button className="flex-1" onClick={startDueSession}>
                {t.sessionDone.reviewMore}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={t.pageTitle}
        subtitle={t.subtitle(totalCards ?? 0, dueCards?.length ?? 0)}
      />

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalCards ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.home.stats.totalCards}</p>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">{dueCards?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.home.stats.dueToday}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {(totalCards ?? 0) - (dueCards?.length ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t.home.stats.learned}</p>
          </div>
        </div>

        {/* Session Start */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-1">{t.home.startSession.title}</h3>
          <p className="text-sm text-muted-foreground mb-5 fa">
            {t.home.startSession.description}
          </p>

          {totalCards === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground fa">
                {t.home.startSession.emptyDescription}
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={startDueSession}
                disabled={(dueCards?.length ?? 0) === 0}
                className="flex-1 gap-2"
              >
                <Zap className="w-4 h-4" />
                {t.home.startSession.reviewDue(dueCards?.length ?? 0)}
              </Button>
              <Button
                onClick={startAllSession}
                variant="outline"
                disabled={(totalCards ?? 0) === 0}
                className="flex-1 gap-2"
              >
                <BookOpen className="w-4 h-4" />
                {t.home.startSession.practiceAll}
              </Button>
            </div>
          )}
        </div>

        {/* Card List */}
        {allCards && allCards.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-4">{t.home.recentCards}</h3>
            <div className="space-y-2">
              {allCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-medium text-sm text-foreground truncate">{card.front}</span>
                    <span className="text-muted-foreground text-sm">→</span>
                    <span className="text-sm text-muted-foreground truncate fa">{card.back}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {card.difficulty && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          card.difficulty === "easy"
                            ? "bg-green-500/15 text-green-400"
                            : card.difficulty === "medium"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {card.difficulty}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(card.nextReviewDate) <= new Date() ? t.home.due : t.home.daysLeft(card.interval)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
