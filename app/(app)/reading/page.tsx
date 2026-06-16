"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, XP_REWARDS, updateTodayStats, type ReadingSession } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Plus, CheckCircle2, Clock, BookOpen, Trash2, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

function ReadingMode({
  session,
  onClose,
  onComplete,
}: {
  session: ReadingSession;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [startTime] = useState(Date.now());

  const handleComplete = async () => {
    const minutes = Math.round((Date.now() - startTime) / 60000);
    await db.readingSessions.update(session.id!, {
      isCompleted: true,
      completedAt: new Date(),
      readTime: minutes,
    });
    const profile = await db.userProfile.orderBy("id").first();
    if (profile?.id) {
      await db.userProfile.update(profile.id, {
        xp: (profile.xp ?? 0) + XP_REWARDS.readingCompleted,
        totalXp: (profile.totalXp ?? 0) + XP_REWARDS.readingCompleted,
      });
    }
    await updateTodayStats({
      readingMinutes: minutes,
      xpEarned: XP_REWARDS.readingCompleted,
    });
    toast.success(`+${XP_REWARDS.readingCompleted} XP! Reading completed.`);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 bg-background flex flex-col"
    >
      <div className="flex items-center justify-between px-6 h-14 border-b border-border bg-background/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <span className="font-medium text-foreground truncate max-w-xs">{session.title}</span>
        </div>
        <Button onClick={handleComplete} size="sm" className="gap-2" disabled={session.isCompleted}>
          <CheckCircle2 className="w-4 h-4" />
          {session.isCompleted ? "Completed" : "Mark as Read"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-foreground mb-2">{session.title}</h1>
          {session.source && (
            <p className="text-sm text-muted-foreground mb-6">Source: {session.source}</p>
          )}
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-foreground leading-8 text-base whitespace-pre-wrap">{session.content}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReadingPage() {
  const [readingSession, setReadingSession] = useState<ReadingSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", source: "" });
  const [saving, setSaving] = useState(false);

  const sessions = useLiveQuery(() =>
    db.readingSessions.orderBy("createdAt").reverse().toArray()
  );
  const totalSessions = useLiveQuery(() => db.readingSessions.count());
  const completedSessions = useLiveQuery(() =>
    db.readingSessions.where("isCompleted").equals(1).count()
  );

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const wordCount = form.content.trim().split(/\s+/).length;
      await db.readingSessions.add({
        title: form.title.trim(),
        content: form.content.trim(),
        source: form.source.trim() || undefined,
        wordsCount: wordCount,
        isCompleted: false,
        createdAt: new Date(),
      });
      toast.success("Article saved!");
      setForm({ title: "", content: "", source: "" });
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await db.readingSessions.delete(id);
    toast.success("Deleted");
  };

  return (
    <div>
      <Header
        title="Reading Practice"
        subtitle={`${completedSessions ?? 0}/${totalSessions ?? 0} articles completed`}
      />

      <div className="p-6 space-y-5 max-w-4xl mx-auto">
        {/* Add Article Button */}
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Article
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalSessions ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Saved Articles</p>
          </div>
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{completedSessions ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {(totalSessions ?? 0) - (completedSessions ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">To Read</p>
          </div>
        </div>

        {/* Article List */}
        {sessions?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-base font-medium text-foreground mb-1">No articles saved</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save articles, blog posts, or any English text to read and practice
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Article
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {sessions?.map((session) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    session.isCompleted ? "bg-green-500/15" : "bg-muted"
                  }`}>
                    {session.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">{session.title}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(session.createdAt), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {session.wordsCount} words
                      </span>
                      {session.source && (
                        <span className="text-xs text-muted-foreground truncate max-w-24">
                          {session.source}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-xs h-7"
                      onClick={() => setReadingSession(session)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Read
                    </Button>
                    <button
                      onClick={() => session.id && handleDelete(session.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Article Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Title *</label>
              <Input
                placeholder="Article title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Source (optional)</label>
              <Input
                placeholder="Website, book, newspaper..."
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Content *</label>
              <Textarea
                placeholder="Paste the article text here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                className="font-sans text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground">
                {form.content ? form.content.trim().split(/\s+/).length : 0} words
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reading Mode */}
      <AnimatePresence>
        {readingSession && (
          <ReadingMode
            session={readingSession}
            onClose={() => setReadingSession(null)}
            onComplete={() => setReadingSession(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
