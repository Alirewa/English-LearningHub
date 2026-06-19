"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, XP_REWARDS, updateTodayStats } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Shuffle, Star, Clock, ChevronRight, X, Save } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { speaking } from "@/lib/i18n/speaking";

const SPEAKING_PROMPTS = [
  { text: "Describe your hometown. What makes it special?", category: "Personal" },
  { text: "Talk about your last trip or journey.", category: "Travel" },
  { text: "Explain your favorite technology and why you use it.", category: "Technology" },
  { text: "Describe a difficult challenge you faced and how you overcame it.", category: "Personal" },
  { text: "What are your goals for the next 5 years?", category: "Personal" },
  { text: "Describe your daily routine in detail.", category: "Daily Life" },
  { text: "Talk about a book or movie that influenced you.", category: "Culture" },
  { text: "What are the pros and cons of social media?", category: "Opinion" },
  { text: "Describe your dream job and why it appeals to you.", category: "Work" },
  { text: "Talk about an important historical event and its impact.", category: "Education" },
  { text: "Describe your favorite food and how it's prepared.", category: "Daily Life" },
  { text: "What technological invention has changed the world most?", category: "Technology" },
  { text: "Describe a person who has inspired you.", category: "Personal" },
  { text: "What are the most important qualities in a leader?", category: "Opinion" },
  { text: "Talk about environmental challenges and possible solutions.", category: "Opinion" },
  { text: "Describe a typical workday at your ideal job.", category: "Work" },
  { text: "What habits help you stay productive?", category: "Self-Development" },
  { text: "Compare life in a city vs. a village.", category: "Opinion" },
  { text: "Describe a festival or celebration from your culture.", category: "Culture" },
  { text: "What would you do with one million dollars?", category: "Personal" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Personal": "bg-blue-500/15 text-blue-400",
  "Travel": "bg-sky-500/15 text-sky-400",
  "Technology": "bg-purple-500/15 text-purple-400",
  "Daily Life": "bg-green-500/15 text-green-400",
  "Opinion": "bg-orange-500/15 text-orange-400",
  "Work": "bg-yellow-500/15 text-yellow-400",
  "Culture": "bg-pink-500/15 text-pink-400",
  "Education": "bg-cyan-500/15 text-cyan-400",
  "Self-Development": "bg-teal-500/15 text-teal-400",
};

export default function SpeakingPage() {
  const language = useAppStore((s) => s.language);
  const t = speaking[language];
  const [activePrompt, setActivePrompt] = useState<(typeof SPEAKING_PROMPTS)[0] | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const sessions = useLiveQuery(() =>
    db.speakingSessions.orderBy("createdAt").reverse().limit(10).toArray()
  );
  const totalSessions = useLiveQuery(() => db.speakingSessions.count());

  const getRandomPrompt = () => {
    const random = SPEAKING_PROMPTS[Math.floor(Math.random() * SPEAKING_PROMPTS.length)];
    setActivePrompt(random);
    setRating(0);
    setNotes("");
    setSessionStartTime(Date.now());
  };

  const selectPrompt = (prompt: typeof SPEAKING_PROMPTS[0]) => {
    setActivePrompt(prompt);
    setRating(0);
    setNotes("");
    setSessionStartTime(Date.now());
  };

  const saveSession = async () => {
    if (!activePrompt) return;
    setSaving(true);
    try {
      const duration = sessionStartTime ? Math.round((Date.now() - sessionStartTime) / 1000) : 0;
      await db.speakingSessions.add({
        promptText: activePrompt.text,
        selfEvaluation: notes,
        rating: rating as 1 | 2 | 3 | 4 | 5 || undefined,
        notes,
        duration,
        createdAt: new Date(),
      });

      const profile = await db.userProfile.orderBy("id").first();
      if (profile?.id) {
        await db.userProfile.update(profile.id, {
          xp: (profile.xp ?? 0) + XP_REWARDS.speakingSession,
          totalXp: (profile.totalXp ?? 0) + XP_REWARDS.speakingSession,
        });
      }
      await updateTodayStats({
        speakingMinutes: Math.round(duration / 60),
        xpEarned: XP_REWARDS.speakingSession,
      });

      toast.success(t.toasts.saved(XP_REWARDS.speakingSession));
      setActivePrompt(null);
      setRating(0);
      setNotes("");
    } catch {
      toast.error(t.toasts.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header
        title={t.header.title}
        subtitle={t.header.subtitle(totalSessions ?? 0)}
      />

      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Active Session */}
        <AnimatePresence mode="wait">
          {activePrompt ? (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mb-3 inline-block ${CATEGORY_COLORS[activePrompt.category] ?? "bg-muted text-muted-foreground"}`}>
                    {activePrompt.category}
                  </span>
                  <h2 className="text-xl font-semibold text-foreground leading-relaxed">
                    {activePrompt.text}
                  </h2>
                </div>
                <button
                  onClick={() => setActivePrompt(null)}
                  className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">{t.session.tipsTitle}</p>
                <ul className="space-y-1 list-disc list-inside fa">
                  {t.session.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Self Evaluation */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">{t.session.ratingLabel}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{t.session.notesLabel}</label>
                <Textarea
                  placeholder={t.session.notesPlaceholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={getRandomPrompt} variant="outline" className="gap-2">
                  <Shuffle className="w-4 h-4" />
                  {t.session.newPrompt}
                </Button>
                <Button onClick={saveSession} disabled={saving} className="gap-2 flex-1">
                  <Save className="w-4 h-4" />
                  {saving ? t.session.saving : t.session.saveSession}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t.start.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 fa">
                {t.start.description}
              </p>
              <Button onClick={getRandomPrompt} className="gap-2">
                <Shuffle className="w-4 h-4" />
                {t.start.randomPrompt}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt Library */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t.library.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SPEAKING_PROMPTS.map((prompt, i) => (
              <motion.button
                key={i}
                onClick={() => selectPrompt(prompt)}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/20 hover:bg-accent/20 transition-all text-left group"
                whileHover={{ x: 2 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">{prompt.text}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1.5 inline-block ${CATEGORY_COLORS[prompt.category] ?? "bg-muted text-muted-foreground"}`}>
                    {prompt.category}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        {sessions && sessions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t.recent.title}
            </h3>
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-1">{session.promptText}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(session.createdAt), "MMM d, yyyy")}
                      </span>
                      {session.duration && (
                        <span className="text-xs text-muted-foreground">
                          {Math.round(session.duration / 60)}m {session.duration % 60}s
                        </span>
                      )}
                    </div>
                  </div>
                  {session.rating && (
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= session.rating! ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/20"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
