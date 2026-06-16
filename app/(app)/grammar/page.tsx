"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, XP_REWARDS, updateTodayStats, type GrammarTopic } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, ChevronRight, GraduationCap, BookOpen,
  AlertTriangle, ChevronDown, X, Code2,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORY_COLORS: Record<string, string> = {
  "Tenses": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Modal Verbs": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "Passive Voice": "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  "Conditionals": "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Articles": "bg-pink-500/15 text-pink-400 border-pink-500/20",
  "Prepositions": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "Verb Forms": "bg-green-500/15 text-green-400 border-green-500/20",
  "Sentence Structure": "bg-rose-500/15 text-rose-400 border-rose-500/20",
  "Reported Speech": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  "Nouns": "bg-teal-500/15 text-teal-400 border-teal-500/20",
  "Adjectives": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Adverbs": "bg-lime-500/15 text-lime-400 border-lime-500/20",
  "Pronouns": "bg-violet-500/15 text-violet-400 border-violet-500/20",
};

function TopicDetail({ topic, onClose, onComplete }: {
  topic: GrammarTopic;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [showMistakes, setShowMistakes] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="fixed inset-0 z-20 bg-background overflow-y-auto lg:relative lg:inset-auto lg:z-auto"
    >
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">{topic.title}</p>
            {"titleFa" in topic && topic.titleFa && (
              <p className="text-xs text-muted-foreground fa">{topic.titleFa}</p>
            )}
          </div>
        </div>
        {!topic.isCompleted && (
          <Button onClick={onComplete} size="sm" className="gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            Mark Done
          </Button>
        )}
      </div>

      <div className="p-5 max-w-2xl mx-auto space-y-4 pb-10">
        {/* Category badge */}
        <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium ${CATEGORY_COLORS[topic.category] ?? "bg-muted text-muted-foreground border-border"}`}>
          {topic.category}
        </span>

        {/* Bilingual definition */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Definition
          </h3>
          <p className="text-sm text-foreground leading-relaxed">{topic.explanation}</p>
          {"explanationFa" in topic && topic.explanationFa && (
            <div className="pt-2 border-t border-border/60">
              <p className="fa text-sm text-muted-foreground">{topic.explanationFa}</p>
            </div>
          )}
        </div>

        {/* Formula */}
        {"formula" in topic && topic.formula && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Formula</h3>
            </div>
            <p className="text-sm font-mono text-foreground">{topic.formula}</p>
            {"formulaFa" in topic && topic.formulaFa && (
              <div className="pt-2 border-t border-primary/15">
                <p className="fa text-sm text-muted-foreground">{topic.formulaFa}</p>
              </div>
            )}
          </div>
        )}

        {/* Usages — Persian */}
        {"usagesFa" in topic && topic.usagesFa && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              کاربردها (Usages)
            </h3>
            <p className="fa text-sm text-foreground">{topic.usagesFa}</p>
          </div>
        )}

        {/* Rules */}
        {topic.rules && topic.rules.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Rules</h3>
            <ul className="space-y-2">
              {topic.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {topic.examples && topic.examples.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Examples</h3>
            <div className="space-y-2">
              {topic.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-muted/40">
                  <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground italic">&ldquo;{ex}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {topic.commonMistakes && topic.commonMistakes.length > 0 && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => setShowMistakes(!showMistakes)}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h3 className="text-sm font-semibold text-destructive">Common Mistakes</h3>
              </div>
              <ChevronDown className={`w-4 h-4 text-destructive transition-transform ${showMistakes ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showMistakes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-1.5">
                    {topic.commonMistakes.map((m, i) => (
                      <p key={i} className="text-sm text-destructive/90 font-mono">{m}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Persian Summary */}
        {"summaryFa" in topic && topic.summaryFa && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              جمع‌بندی (Summary)
            </h3>
            <p className="fa text-sm text-foreground">{topic.summaryFa}</p>
          </div>
        )}

        {/* Notes */}
        {topic.notes && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground">{topic.notes}</p>
          </div>
        )}

        {topic.isCompleted && (
          <div className="flex items-center gap-2 text-green-400 text-sm py-2">
            <CheckCircle2 className="w-4 h-4 fill-green-400" />
            Completed on {topic.completedAt ? new Date(topic.completedAt).toLocaleDateString() : ""}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function GrammarPage() {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [filterCat, setFilterCat] = useState<string>("all");

  const topics = useLiveQuery(() => db.grammarTopics.toArray());
  const completedCount = useLiveQuery(() =>
    db.grammarTopics.where("isCompleted").equals(1).count()
  );

  const categories = [...new Set(topics?.map((t) => t.category) ?? [])];
  const filtered = topics?.filter((t) => filterCat === "all" || t.category === filterCat);

  const handleComplete = async (topic: GrammarTopic) => {
    if (topic.isCompleted) return;
    await db.grammarTopics.update(topic.id!, { isCompleted: true, completedAt: new Date() });
    const profile = await db.userProfile.orderBy("id").first();
    if (profile?.id) {
      await db.userProfile.update(profile.id, {
        xp: (profile.xp ?? 0) + XP_REWARDS.grammarCompleted,
        totalXp: (profile.totalXp ?? 0) + XP_REWARDS.grammarCompleted,
      });
    }
    await updateTodayStats({ grammarLessonsCompleted: 1, xpEarned: XP_REWARDS.grammarCompleted });
    toast.success(`+${XP_REWARDS.grammarCompleted} XP! Lesson completed.`);
    setSelectedTopic({ ...topic, isCompleted: true, completedAt: new Date() });
  };

  const progressPct = topics?.length
    ? Math.round(((completedCount ?? 0) / topics.length) * 100)
    : 0;

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col min-h-0 ${selectedTopic ? "hidden lg:flex" : ""}`}>
        <Header
          title="Grammar Academy"
          subtitle={`${completedCount ?? 0}/${topics?.length ?? 0} lessons · offline`}
        />

        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-w-3xl">
          {/* Progress bar */}
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-foreground">Your progress</span>
              <span className="text-muted-foreground">{completedCount ?? 0} / {topics?.length ?? 0}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Category filter — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  filterCat === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All Topics" : cat}
              </button>
            ))}
          </div>

          {/* Topic list */}
          <div className="space-y-2">
            {filtered?.map((topic, idx) => (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedTopic(topic)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/10 transition-all text-left group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  topic.isCompleted ? "bg-green-500/15" : "bg-muted"
                }`}>
                  {topic.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 fill-green-400" />
                  ) : (
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-foreground">{topic.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                      CATEGORY_COLORS[topic.category] ?? "bg-muted text-muted-foreground border-border"
                    }`}>
                      {topic.category}
                    </span>
                  </div>
                  {"titleFa" in topic && topic.titleFa && (
                    <p className="fa text-xs text-muted-foreground mt-0.5 truncate">{topic.titleFa}</p>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="lg:w-[540px] lg:border-l lg:border-border overflow-hidden flex flex-col">
            <TopicDetail
              topic={selectedTopic}
              onClose={() => setSelectedTopic(null)}
              onComplete={() => handleComplete(selectedTopic)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
