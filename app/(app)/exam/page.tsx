"use client";

import { useState, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Eye, Shuffle, RotateCcw, CheckCircle2, XCircle, BookOpen, MessageSquare } from "lucide-react";

type ExamMode = "words" | "sentences" | "both";
type CardItem = { id: string; question: string; answer: string; type: "word" | "sentence" };

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ExamPage() {
  const [mode, setMode] = useState<ExamMode>("both");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const vocabWords = useLiveQuery(() => db.vocabWords.toArray());
  const sentences = useLiveQuery(() => db.sentences.toArray());

  const buildDeck = useCallback((m: ExamMode) => {
    const deck: CardItem[] = [];
    if ((m === "words" || m === "both") && vocabWords) {
      vocabWords.forEach((w) =>
        deck.push({ id: `w-${w.id}`, question: w.word, answer: w.meaning, type: "word" })
      );
    }
    if ((m === "sentences" || m === "both") && sentences) {
      sentences.forEach((s) =>
        deck.push({ id: `s-${s.id}`, question: s.english, answer: s.persian, type: "sentence" })
      );
    }
    return shuffle(deck);
  }, [vocabWords, sentences]);

  const startExam = () => {
    const deck = buildDeck(mode);
    if (deck.length === 0) return;
    setCards(deck);
    setIndex(0);
    setRevealed(false);
    setCorrect(0);
    setWrong(0);
    setStarted(true);
    setFinished(false);
  };

  const handleAnswer = (gotIt: boolean) => {
    if (gotIt) setCorrect((c) => c + 1);
    else setWrong((w) => w + 1);

    if (index + 1 >= cards.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  };

  const card = cards[index];
  const total = cards.length;
  const pct = total > 0 ? Math.round(((correct + wrong) / total) * 100) : 0;

  /* ── Start screen ── */
  if (!started || finished) {
    return (
      <div>
        <Header title="Exam Mode" subtitle="Test yourself — no cheating!" />
        <div className="p-6 max-w-md mx-auto flex flex-col items-center gap-6 pt-12">
          {finished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full rounded-2xl border border-border bg-card p-6 text-center space-y-4"
            >
              <div className="text-4xl font-bold text-foreground">{correct}/{total}</div>
              <p className="text-sm text-muted-foreground">
                {correct} correct · {wrong} missed
              </p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${total > 0 ? (correct / total) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {correct / total >= 0.8
                  ? "Excellent! Keep it up!"
                  : correct / total >= 0.5
                  ? "Good progress. Review the ones you missed."
                  : "Keep practicing — you'll get there!"}
              </p>
            </motion.div>
          )}

          <div className="w-full space-y-3">
            <p className="text-sm font-medium text-foreground">What to test?</p>
            <div className="grid grid-cols-3 gap-2">
              {(["words", "sentences", "both"] as ExamMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-sm font-medium ${
                    mode === m
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "words" ? <BookOpen className="w-5 h-5" /> : m === "sentences" ? <MessageSquare className="w-5 h-5" /> : <Shuffle className="w-5 h-5" />}
                  <span className="capitalize">{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full text-xs text-muted-foreground space-y-1">
            {mode !== "sentences" && (
              <p className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                {vocabWords?.length ?? 0} vocabulary words available
              </p>
            )}
            {mode !== "words" && (
              <p className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                {sentences?.length ?? 0} sentences available
              </p>
            )}
          </div>

          <Button onClick={startExam} size="lg" className="w-full gap-2">
            <Shuffle className="w-4 h-4" />
            {finished ? "Try Again" : "Start Exam"}
          </Button>
        </div>
      </div>
    );
  }

  /* ── Exam screen ── */
  return (
    <div>
      <Header title="Exam Mode" subtitle={`${index + 1} / ${total}`} />

      <div className="p-6 max-w-lg mx-auto space-y-5 pt-8">
        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-green-400">{correct} correct</span>
            <span>{index + 1} / {total}</span>
            <span className="text-red-400">{wrong} missed</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Type badge */}
            <div className="flex items-center gap-2 px-5 pt-4 pb-2">
              {card.type === "word" ? (
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              ) : (
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span className="text-xs text-muted-foreground capitalize">{card.type}</span>
            </div>

            {/* Question */}
            <div className="px-5 pb-5">
              <p className={`font-bold text-foreground ${card.type === "sentence" ? "text-lg leading-relaxed" : "text-2xl"}`}>
                {card.question}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Answer */}
            <div className="px-5 py-5 min-h-[80px] flex items-center">
              {revealed ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-foreground fa ${card.type === "sentence" ? "text-base" : "text-lg font-semibold"}`}
                >
                  {card.answer}
                </motion.p>
              ) : (
                <Button
                  onClick={() => setRevealed(true)}
                  variant="outline"
                  className="gap-2 w-full"
                >
                  <Eye className="w-4 h-4" />
                  نمایش پاسخ / Show Answer
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              <Button
                onClick={() => handleAnswer(false)}
                variant="outline"
                className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
              >
                <XCircle className="w-4 h-4" />
                Missed
              </Button>
              <Button
                onClick={() => handleAnswer(true)}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                Got it!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quit button */}
        <div className="flex justify-center">
          <button
            onClick={() => { setStarted(false); setFinished(false); }}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart / Change mode
          </button>
        </div>
      </div>
    </div>
  );
}
