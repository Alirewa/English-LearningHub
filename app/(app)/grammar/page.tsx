"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, XP_REWARDS, updateTodayStats, type GrammarTopic } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2, ChevronRight, GraduationCap, BookOpen,
  AlertTriangle, ChevronDown, Code2, Pin, PinOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { grammar } from "@/lib/i18n/grammar";

const CATEGORY_COLORS: Record<string, string> = {
  "Tenses":            "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Modal Verbs":       "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "Passive Voice":     "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  "Conditionals":      "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Articles":          "bg-pink-500/15 text-pink-400 border-pink-500/20",
  "Prepositions":      "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "Verb Forms":        "bg-green-500/15 text-green-400 border-green-500/20",
  "Sentence Structure":"bg-rose-500/15 text-rose-400 border-rose-500/20",
  "Reported Speech":   "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  "Nouns":             "bg-teal-500/15 text-teal-400 border-teal-500/20",
  "Adjectives":        "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Adverbs":           "bg-lime-500/15 text-lime-400 border-lime-500/20",
  "Pronouns":          "bg-violet-500/15 text-violet-400 border-violet-500/20",
};

function GrammarOverview({ topic, t }: { topic: GrammarTopic; t: typeof grammar.en }) {
  const [showMistakes, setShowMistakes] = useState(false);

  return (
    <div className="space-y-5">
      {/* Category badge */}
      <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium ${CATEGORY_COLORS[topic.category] ?? "bg-muted text-muted-foreground border-border"}`}>
        {topic.category}
      </span>

      {/* Bilingual definition */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {t.modal.definitionHeading}
        </h3>
        <p className="text-sm text-foreground leading-relaxed">{topic.explanation}</p>
        {"explanationFa" in topic && topic.explanationFa && (
          <div className="pt-3 border-t border-border/60">
            <p className="fa text-sm text-muted-foreground">{topic.explanationFa}</p>
          </div>
        )}
      </div>

      {/* Formula */}
      {"formula" in topic && topic.formula && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <h3 className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              {t.modal.formulaHeading}
            </h3>
          </div>
          <p className="text-sm font-mono text-foreground bg-background/50 rounded-lg px-3 py-2 whitespace-pre-line">
            {topic.formula}
          </p>
          {"formulaFa" in topic && topic.formulaFa && (
            <div className="pt-2 border-t border-primary/15">
              <p className="fa text-sm text-muted-foreground whitespace-pre-line">{topic.formulaFa}</p>
            </div>
          )}
        </div>
      )}

      {/* Usages — Persian */}
      {"usagesFa" in topic && topic.usagesFa && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t.modal.usagesHeading}
          </h3>
          <p className="fa text-sm text-foreground">{topic.usagesFa}</p>
        </div>
      )}

      {/* Rules */}
      {topic.rules && topic.rules.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t.modal.rulesHeading}
          </h3>
          <ul className="space-y-3">
            {topic.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[11px] flex items-center justify-center shrink-0 mt-0.5 font-semibold">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Examples */}
      {topic.examples && topic.examples.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t.modal.examplesHeading}
          </h3>
          <div className="space-y-2.5">
            {topic.examples.map((ex, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 px-3 rounded-lg bg-muted/40">
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
            className="flex items-center justify-between w-full text-left"
            onClick={() => setShowMistakes(!showMistakes)}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h3 className="text-sm font-semibold text-destructive">
                {t.modal.commonMistakesHeading}
              </h3>
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
                    <p key={i} className="text-sm text-destructive/90 font-mono bg-destructive/5 rounded px-2 py-1">
                      {m}
                    </p>
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
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t.modal.summaryHeading}
          </h3>
          <p className="fa text-sm text-foreground leading-loose whitespace-pre-line">{topic.summaryFa}</p>
        </div>
      )}

      {/* Bottom padding for mobile */}
      <div className="h-2" />
    </div>
  );
}

function SubtopicView({ sub }: { sub: NonNullable<GrammarTopic["subtopics"]>[number] }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-1">
        <p className="text-sm font-semibold text-foreground">{sub.tagline}</p>
        <p className="fa text-xs text-muted-foreground">{sub.taglineFa}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <h3 className="text-[11px] font-semibold text-primary uppercase tracking-wider">Formula</h3>
        </div>
        <p className="text-sm font-mono text-foreground bg-background/50 rounded-lg px-3 py-2">{sub.formula}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="fa text-sm text-foreground leading-relaxed">{sub.explanationFa}</p>
      </div>

      {sub.examples.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Examples</h3>
          <div className="space-y-2.5">
            {sub.examples.map((ex, i) => (
              <div key={i} className="flex flex-col gap-1 py-2.5 px-3 rounded-lg bg-muted/40">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground italic">&ldquo;{ex}&rdquo;</p>
                </div>
                {sub.examplesFa?.[i] && (
                  <p className="fa text-xs text-muted-foreground pl-6.5">{sub.examplesFa[i]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {sub.tipFa && (
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="fa text-sm text-foreground leading-loose">💡 {sub.tipFa}</p>
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}

function GrammarModal({ topic, open, onClose, onComplete, onTogglePin }: {
  topic: GrammarTopic | null;
  open: boolean;
  onClose: () => void;
  onComplete: (t: GrammarTopic) => void;
  onTogglePin: (t: GrammarTopic) => void;
}) {
  const language = useAppStore((s) => s.language);
  const t = grammar[language];

  if (!topic) return null;

  const hasSubtopics = !!topic.subtopics && topic.subtopics.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Sticky header inside modal */}
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-foreground leading-tight">
                {topic.title}
              </DialogTitle>
              {"titleFa" in topic && topic.titleFa && (
                <p className="fa text-sm text-muted-foreground mt-0.5">{topic.titleFa}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={() => onTogglePin(topic)}
                size="icon"
                variant="ghost"
                className={topic.isPinned ? "text-primary" : "text-muted-foreground"}
                title={topic.isPinned ? t.modal.unpin : t.modal.pin}
                aria-label={topic.isPinned ? t.modal.unpin : t.modal.pin}
              >
                {topic.isPinned ? <Pin className="w-4 h-4 fill-current" /> : <Pin className="w-4 h-4" />}
              </Button>
              {!topic.isCompleted && (
                <Button onClick={() => onComplete(topic)} size="sm" className="gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.modal.markDone}</span>
                  <span className="sm:hidden">✓</span>
                </Button>
              )}
              {topic.isCompleted && (
                <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 fill-green-400" />
                  {t.modal.completed}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {hasSubtopics ? (
            <Tabs defaultValue="overview">
              <TabsList className="mb-5 flex flex-wrap h-auto gap-1 bg-muted p-1">
                <TabsTrigger value="overview" className="text-xs">{t.modal.overviewTab}</TabsTrigger>
                {topic.subtopics!.map((sub) => (
                  <TabsTrigger key={sub.id} value={sub.id} className="text-xs">
                    {sub.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="overview" className="max-h-[55vh] overflow-y-auto pr-1">
                <GrammarOverview topic={topic} t={t} />
              </TabsContent>
              {topic.subtopics!.map((sub) => (
                <TabsContent key={sub.id} value={sub.id} className="max-h-[55vh] overflow-y-auto pr-1">
                  <SubtopicView sub={sub} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <GrammarOverview topic={topic} t={t} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function GrammarPage() {
  const language = useAppStore((s) => s.language);
  const t = grammar[language];
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [search, setSearch] = useState("");

  const topics = useLiveQuery(() => db.grammarTopics.toArray());
  const completedCount = useLiveQuery(() =>
    db.grammarTopics.where("isCompleted").equals(1).count()
  );

  const categories = [...new Set(topics?.map((t) => t.category) ?? [])];

  const filtered = topics
    ?.filter((t) => {
      if (filterCat !== "all" && t.category !== filterCat) return false;
      if (search) {
        const q = search.toLowerCase();
        const titleFa = ("titleFa" in t ? t.titleFa as string : "") ?? "";
        return (
          t.title.toLowerCase().includes(q) ||
          titleFa.includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

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
    toast.success(t.toasts.lessonCompleted(XP_REWARDS.grammarCompleted));
    setSelectedTopic({ ...topic, isCompleted: true, completedAt: new Date() });
    topics?.forEach(t => { if (t.id === topic.id) { t.isCompleted = true; t.completedAt = new Date(); } });
  };

  const handleTogglePin = async (topic: GrammarTopic) => {
    const nextPinned = !topic.isPinned;
    await db.grammarTopics.update(topic.id!, { isPinned: nextPinned });
    toast.success(nextPinned ? t.toasts.pinned : t.toasts.unpinned);
    setSelectedTopic((prev) => (prev && prev.id === topic.id ? { ...prev, isPinned: nextPinned } : prev));
  };

  const progressPct = topics?.length
    ? Math.round(((completedCount ?? 0) / topics.length) * 100)
    : 0;

  return (
    <div>
      <Header title={t.header.title} subtitle={t.header.subtitle(completedCount ?? 0, topics?.length ?? 0)} />

      <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="rounded-xl border border-border bg-card px-5 py-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-medium text-foreground">{t.progress.label}</span>
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
          <p className="text-[11px] text-muted-foreground mt-1.5 fa">
            {t.progress.summary(progressPct, (topics?.length ?? 0) - (completedCount ?? 0))}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t.search.placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
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
              {cat === "all" ? t.filters.all : cat}
            </button>
          ))}
        </div>

        {/* Topic list */}
        <div className="space-y-2">
          {filtered?.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.025 }}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedTopic(topic)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedTopic(topic)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/30 hover:bg-accent/10 transition-all text-left group cursor-pointer ${
                topic.isPinned ? "border-primary/40" : "border-border"
              }`}
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
                  {topic.isPinned && <Pin className="w-3 h-3 text-primary fill-primary shrink-0" />}
                  <span className="font-medium text-sm text-foreground">{topic.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                    CATEGORY_COLORS[topic.category] ?? "bg-muted text-muted-foreground border-border"
                  }`}>
                    {topic.category}
                  </span>
                </div>
                {"titleFa" in topic && topic.titleFa && (
                  <p className="fa text-xs text-muted-foreground mt-0.5">{topic.titleFa}</p>
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleTogglePin(topic); }}
                title={topic.isPinned ? t.modal.unpin : t.modal.pin}
                aria-label={topic.isPinned ? t.modal.unpin : t.modal.pin}
                className={`p-1.5 rounded-md shrink-0 transition-colors ${
                  topic.isPinned ? "text-primary" : "text-muted-foreground/50 hover:text-foreground"
                }`}
              >
                {topic.isPinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
              </button>

              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
            </motion.div>
          ))}

          {filtered?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              {t.emptyState}
            </div>
          )}
        </div>
      </div>

      {/* Grammar Modal */}
      <GrammarModal
        topic={selectedTopic}
        open={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onComplete={handleComplete}
        onTogglePin={handleTogglePin}
      />
    </div>
  );
}
