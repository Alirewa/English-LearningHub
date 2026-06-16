"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, XP_REWARDS, updateTodayStats, type GrammarTopic } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, ChevronRight, GraduationCap, BookOpen, AlertTriangle, ChevronDown, X,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORY_COLORS: Record<string, string> = {
  "Tenses": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Modal Verbs": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "Passive Voice": "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  "Conditionals": "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Articles": "bg-pink-500/15 text-pink-400 border-pink-500/20",
  "Prepositions": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "Gerunds and Infinitives": "bg-green-500/15 text-green-400 border-green-500/20",
  "Relative Clauses": "bg-rose-500/15 text-rose-400 border-rose-500/20",
  "Reported Speech": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  "Phrasal Verbs": "bg-teal-500/15 text-teal-400 border-teal-500/20",
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
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <span className="font-semibold text-foreground">{topic.title}</span>
        </div>
        {!topic.isCompleted && (
          <Button onClick={onComplete} size="sm" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Mark Done
          </Button>
        )}
      </div>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Category */}
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${CATEGORY_COLORS[topic.category] ?? "bg-muted text-muted-foreground border-border"}`}>
          {topic.category}
        </span>

        {/* Explanation */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Explanation
          </h3>
          <p className="text-foreground leading-relaxed">{topic.explanation}</p>
        </div>

        {/* Rules */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Rules
          </h3>
          <ul className="space-y-2">
            {topic.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Examples */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Examples
          </h3>
          <div className="space-y-2">
            {topic.examples.map((ex, i) => (
              <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-muted/40">
                <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground italic">&ldquo;{ex}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
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
                <div className="pt-3 space-y-2">
                  {topic.commonMistakes.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-destructive/90">
                      <X className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notes */}
        {topic.notes && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Notes
            </h3>
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
  const filtered = topics?.filter(
    (t) => filterCat === "all" || t.category === filterCat
  );

  const handleComplete = async (topic: GrammarTopic) => {
    if (topic.isCompleted) return;
    await db.grammarTopics.update(topic.id!, {
      isCompleted: true,
      completedAt: new Date(),
    });
    const profile = await db.userProfile.orderBy("id").first();
    if (profile?.id) {
      await db.userProfile.update(profile.id, {
        xp: (profile.xp ?? 0) + XP_REWARDS.grammarCompleted,
        totalXp: (profile.totalXp ?? 0) + XP_REWARDS.grammarCompleted,
      });
    }
    await updateTodayStats({
      grammarLessonsCompleted: 1,
      xpEarned: XP_REWARDS.grammarCompleted,
    });
    toast.success(`+${XP_REWARDS.grammarCompleted} XP! Grammar lesson completed!`);
    setSelectedTopic({ ...topic, isCompleted: true, completedAt: new Date() });
  };

  const progressPct = topics?.length
    ? Math.round(((completedCount ?? 0) / topics.length) * 100)
    : 0;

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col ${selectedTopic ? "hidden lg:flex" : ""}`}>
        <Header
          title="Grammar Academy"
          subtitle={`${completedCount ?? 0}/${topics?.length ?? 0} lessons completed`}
        />

        <div className="p-6 space-y-5 max-w-4xl">
          {/* Progress */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Overall Progress</span>
              <span className="text-muted-foreground">{progressPct}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
              <span className="text-green-400">{completedCount ?? 0} completed</span>
              <span>·</span>
              <span>{(topics?.length ?? 0) - (completedCount ?? 0)} remaining</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCat("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterCat === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterCat === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Topics List */}
          <div className="space-y-2">
            {filtered?.map((topic) => (
              <motion.button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/20 transition-all text-left group"
                whileHover={{ x: 2 }}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  topic.isCompleted
                    ? "bg-green-500/15"
                    : "bg-muted"
                }`}>
                  {topic.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 fill-green-400" />
                  ) : (
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm text-foreground">{topic.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                      CATEGORY_COLORS[topic.category] ?? "bg-muted text-muted-foreground border-border"
                    }`}>
                      {topic.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{topic.explanation}</p>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="lg:w-[560px] lg:border-l lg:border-border overflow-hidden">
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
