"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, XP_REWARDS, updateTodayStats, type WritingEntry } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, PenLine, Trash2, Clock, Edit3, X, Type } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function WritingEditor({
  entry,
  onClose,
  onSave,
}: {
  entry?: WritingEntry | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [grammarNotes, setGrammarNotes] = useState(entry?.grammarNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [startTime] = useState(Date.now());

  const wordCount = countWords(content);

  const handleSave = async () => {
    if (!content.trim()) { toast.error("Write something first!"); return; }
    setSaving(true);
    try {
      const minutes = Math.round((Date.now() - startTime) / 60000);
      if (entry?.id) {
        await db.writingEntries.update(entry.id, {
          title: title || "Untitled",
          content,
          grammarNotes,
          wordCount,
          updatedAt: new Date(),
        });
        toast.success("Entry updated!");
      } else {
        await db.writingEntries.add({
          title: title || `Journal ${format(new Date(), "MMM d, yyyy")}`,
          content,
          grammarNotes,
          wordCount,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const profile = await db.userProfile.orderBy("id").first();
        if (profile?.id) {
          await db.userProfile.update(profile.id, {
            xp: (profile.xp ?? 0) + XP_REWARDS.writingEntry,
            totalXp: (profile.totalXp ?? 0) + XP_REWARDS.writingEntry,
          });
        }
        await updateTodayStats({
          writingMinutes: minutes,
          xpEarned: XP_REWARDS.writingEntry,
        });
        toast.success(`+${XP_REWARDS.writingEntry} XP! Entry saved.`);
      }
      onSave();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 bg-background flex flex-col"
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-border bg-background/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Type className="w-3.5 h-3.5" />
            <span>{wordCount} words</span>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? "Saving..." : "Save Entry"}
        </Button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
        <Input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold border-none bg-transparent px-0 text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0 mb-4"
        />
        <Textarea
          placeholder="Start writing in English... What happened today? What are you thinking about? Practice makes perfect."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[50vh] border-none bg-transparent px-0 text-foreground text-base leading-relaxed placeholder:text-muted-foreground/40 focus-visible:ring-0 resize-none"
          autoFocus
        />

        {/* Grammar Notes */}
        <div className="mt-8 pt-6 border-t border-border">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Grammar Notes
          </label>
          <Textarea
            placeholder="Note any grammar points, corrections, or things to remember..."
            value={grammarNotes}
            onChange={(e) => setGrammarNotes(e.target.value)}
            className="min-h-[120px] bg-muted/30 text-sm"
            rows={4}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function WritingPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<WritingEntry | null>(null);

  const entries = useLiveQuery(() =>
    db.writingEntries.orderBy("createdAt").reverse().toArray()
  );
  const totalWords = useLiveQuery(async () => {
    const all = await db.writingEntries.toArray();
    return all.reduce((sum, e) => sum + (e.wordCount ?? 0), 0);
  });

  const openNew = () => { setEditEntry(null); setEditorOpen(true); };
  const openEdit = (entry: WritingEntry) => { setEditEntry(entry); setEditorOpen(true); };
  const handleClose = () => { setEditorOpen(false); setEditEntry(null); };

  const handleDelete = async (id: number) => {
    await db.writingEntries.delete(id);
    toast.success("Entry deleted");
  };

  return (
    <div>
      <Header
        title="Writing Practice"
        subtitle={`${entries?.length ?? 0} entries · ${totalWords ?? 0} total words`}
      />

      <div className="p-6 space-y-5 max-w-4xl mx-auto">
        {/* Start Writing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-card p-6 flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
            <PenLine className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-foreground mb-1">Daily Journal</h3>
            <p className="text-sm text-muted-foreground">
              Write in English every day to improve fluency. Even 5 minutes makes a difference.
            </p>
          </div>
          <Button onClick={openNew} className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Entries", value: entries?.length ?? 0 },
            { label: "Total Words", value: totalWords ?? 0 },
            { label: "Avg. Words", value: entries?.length ? Math.round((totalWords ?? 0) / entries.length) : 0 },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Entry List */}
        {entries?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PenLine className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-base font-medium text-foreground mb-1">No entries yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start your English writing journey today</p>
            <Button onClick={openNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Write First Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {entries?.map((entry) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-1">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(entry)}
                        className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => entry.id && handleDelete(entry.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Type className="w-3 h-3" />
                      {entry.wordCount} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(entry.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editorOpen && (
          <WritingEditor
            entry={editEntry}
            onClose={handleClose}
            onSave={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
