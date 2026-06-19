"use client";

import { useState, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, XP_REWARDS, updateTodayStats, type VocabWord } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Heart, BookOpen, Trash2, Edit3, X, Plus, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["General", "Business", "Academic", "Travel", "Technology", "Medical", "Legal", "Idioms", "Phrasal Verbs"];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

function DifficultyBadge({ difficulty }: { difficulty: VocabWord["difficulty"] }) {
  const map = {
    easy: "bg-green-500/15 text-green-400 border-green-500/20",
    medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    hard: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${map[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function WordCard({ word, onEdit, onDelete }: {
  word: VocabWord;
  onEdit: (w: VocabWord) => void;
  onDelete: (id: number) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  const toggleFav = async () => {
    await db.vocabWords.update(word.id!, { isFavorite: !word.isFavorite });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base">{word.word}</h3>
          <p
            className={`text-sm mt-0.5 transition-all ${revealed ? "text-foreground" : "text-transparent bg-muted/60 rounded select-none cursor-pointer"}`}
            onClick={() => !revealed && setRevealed(true)}
            title={!revealed ? "Click to reveal" : undefined}
          >
            {word.meaning}
          </p>
          {!revealed && (
            <button
              className="text-[11px] text-primary mt-1 hover:underline"
              onClick={() => setRevealed(true)}
            >
              Show meaning
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={toggleFav} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Heart className={`w-4 h-4 ${word.isFavorite ? "fill-red-400 text-red-400" : "text-muted-foreground"}`} />
          </button>
          <button onClick={() => onEdit(word)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => word.id && onDelete(word.id)} className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {word.exampleSentence && revealed && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
          &ldquo;{word.exampleSentence}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={word.difficulty} />
          {word.category && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
              {word.category}
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {new Date(word.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}

const emptyForm = {
  word: "", meaning: "", pronunciation: "", exampleSentence: "",
  synonyms: "", notes: "", difficulty: "medium" as VocabWord["difficulty"],
  category: "General", tags: "", isFavorite: false,
};

export default function VocabularyPage() {
  const [search, setSearch] = useState("");
  const [filterDiff, setFilterDiff] = useState<string>("all");
  const [showFavs, setShowFavs] = useState(false);
  const [editWord, setEditWord] = useState<VocabWord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  /* Quick-add state */
  const [quickWord, setQuickWord] = useState("");
  const [quickMeaning, setQuickMeaning] = useState("");
  const [quickAdding, setQuickAdding] = useState(false);
  const meaningRef = useRef<HTMLInputElement>(null);

  const words = useLiveQuery(async () => {
    const all = await db.vocabWords.orderBy("createdAt").reverse().toArray();
    return all.filter((w) => {
      if (showFavs && !w.isFavorite) return false;
      if (filterDiff !== "all" && w.difficulty !== filterDiff) return false;
      if (search) {
        const q = search.toLowerCase();
        const inWord     = w.word.toLowerCase().includes(q);
        const inMeaning  = w.meaning.toLowerCase().includes(q) || w.meaning.includes(search); // Persian
        const inSynonyms = w.synonyms?.some((s) => s.toLowerCase().includes(q)) ?? false;
        const inExample  = w.exampleSentence?.toLowerCase().includes(q) ?? false;
        const inNotes    = w.notes?.toLowerCase().includes(q) ?? false;
        const inTags     = w.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        return inWord || inMeaning || inSynonyms || inExample || inNotes || inTags;
      }
      return true;
    });
  }, [search, filterDiff, showFavs]);

  const totalWords = useLiveQuery(() => db.vocabWords.count());

  /* ── Quick add ── */
  const handleQuickAdd = async () => {
    if (!quickWord.trim() || !quickMeaning.trim()) return;
    setQuickAdding(true);
    try {
      const wordId = await db.vocabWords.add({
        word: quickWord.trim(),
        meaning: quickMeaning.trim(),
        difficulty: "medium",
        category: "General",
        isFavorite: false,
        xpAwarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await db.flashcards.add({
        wordId,
        front: quickWord.trim(),
        back: quickMeaning.trim(),
        nextReviewDate: new Date(),
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        createdAt: new Date(),
      });
      const profile = await db.userProfile.orderBy("id").first();
      if (profile?.id) {
        await db.userProfile.update(profile.id, {
          xp: (profile.xp ?? 0) + XP_REWARDS.wordAdded,
          totalXp: (profile.totalXp ?? 0) + XP_REWARDS.wordAdded,
        });
      }
      await updateTodayStats({ xpEarned: XP_REWARDS.wordAdded });
      toast.success(`"${quickWord.trim()}" added! +${XP_REWARDS.wordAdded} XP`);
      setQuickWord("");
      setQuickMeaning("");
    } catch {
      toast.error("Failed to add word");
    } finally {
      setQuickAdding(false);
    }
  };

  /* ── Edit existing word ── */
  const openEdit = (word: VocabWord) => {
    setEditWord(word);
    setForm({
      word: word.word,
      meaning: word.meaning,
      pronunciation: word.pronunciation ?? "",
      exampleSentence: word.exampleSentence ?? "",
      synonyms: word.synonyms?.join(", ") ?? "",
      notes: word.notes ?? "",
      difficulty: word.difficulty,
      category: word.category ?? "General",
      tags: word.tags?.join(", ") ?? "",
      isFavorite: word.isFavorite,
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!form.word.trim() || !form.meaning.trim()) {
      toast.error("Word and meaning are required");
      return;
    }
    setSaving(true);
    try {
      const data: Omit<VocabWord, "id"> = {
        word: form.word.trim(),
        meaning: form.meaning.trim(),
        pronunciation: form.pronunciation.trim() || undefined,
        exampleSentence: form.exampleSentence.trim() || undefined,
        synonyms: form.synonyms ? form.synonyms.split(",").map((s) => s.trim()).filter(Boolean) : [],
        notes: form.notes.trim() || undefined,
        difficulty: form.difficulty,
        category: form.category,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        isFavorite: form.isFavorite,
        xpAwarded: editWord?.xpAwarded ?? false,
        createdAt: editWord?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };
      if (editWord?.id) {
        await db.vocabWords.update(editWord.id, data);
        toast.success("Word updated!");
      }
      setEditOpen(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await db.vocabWords.delete(id);
    await db.flashcards.where("wordId").equals(id).delete();
    toast.success("Word deleted");
  };

  return (
    <div>
      <Header title="Vocabulary" subtitle={`${totalWords ?? 0} words saved`} />

      <div className="p-4 sm:p-6 space-y-4 max-w-5xl mx-auto">

        {/* ── Quick-capture bar ── */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Quick Add</p>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="English word…"
              value={quickWord}
              onChange={(e) => setQuickWord(e.target.value)}
              onKeyDown={(e) => e.key === "Tab" && (e.preventDefault(), meaningRef.current?.focus())}
              className="flex-1 bg-background"
              autoFocus
            />
            <div className="flex gap-2 flex-1">
              <Input
                ref={meaningRef}
                placeholder="Meaning / معنی…"
                value={quickMeaning}
                onChange={(e) => setQuickMeaning(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
                className="flex-1 bg-background fa-placeholder"
              />
              <Button
                onClick={handleQuickAdd}
                disabled={quickAdding || !quickWord.trim() || !quickMeaning.trim()}
                className="gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
                <ArrowRight className="w-3.5 h-3.5 sm:hidden" />
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Tab → jump to meaning · Enter → save · Flashcard created automatically
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو... / Search EN or FA"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Select value={filterDiff} onValueChange={(v) => setFilterDiff(v ?? "all")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showFavs ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavs(!showFavs)}
              className="gap-1.5 px-3"
            >
              <Heart className={`w-3.5 h-3.5 ${showFavs ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        {words && (
          <p className="text-xs text-muted-foreground">
            {words.length} {words.length === 1 ? "word" : "words"}
          </p>
        )}

        {/* Word grid */}
        {words?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No words yet</p>
            <p className="text-xs text-muted-foreground">Use the Quick Add bar above to start</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {words?.map((word) => (
                <WordCard key={word.id} word={word} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Edit dialog — full details, only for existing words */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Word</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium">Word</label>
                <Input value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Pronunciation</label>
                <Input value={form.pronunciation} onChange={(e) => setForm({ ...form, pronunciation: e.target.value })} className="font-mono" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Meaning</label>
              <Textarea value={form.meaning} onChange={(e) => setForm({ ...form, meaning: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Example Sentence</label>
              <Textarea value={form.exampleSentence} onChange={(e) => setForm({ ...form, exampleSentence: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Synonyms (comma separated)</label>
              <Input value={form.synonyms} onChange={(e) => setForm({ ...form, synonyms: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium">Difficulty</label>
                <Select value={form.difficulty} onValueChange={(v) => v && setForm({ ...form, difficulty: v as VocabWord["difficulty"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Category</label>
                <Select value={form.category} onValueChange={(v) => v && setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Notes</label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Update"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
