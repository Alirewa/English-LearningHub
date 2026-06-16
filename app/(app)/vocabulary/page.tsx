"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, XP_REWARDS, updateTodayStats, type VocabWord } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Search, Heart, BookOpen, Volume2, Star, Trash2, Edit3, Filter, X,
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

function WordCard({
  word,
  onEdit,
  onDelete,
}: {
  word: VocabWord;
  onEdit: (w: VocabWord) => void;
  onDelete: (id: number) => void;
}) {
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
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-base">{word.word}</h3>
            {word.pronunciation && (
              <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                /{word.pronunciation}/
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{word.meaning}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleFav}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Favorite"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${word.isFavorite ? "fill-red-400 text-red-400" : "text-muted-foreground"}`}
            />
          </button>
          <button
            onClick={() => onEdit(word)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => word.id && onDelete(word.id)}
            className="p-1.5 rounded-lg hover:bg-destructive/15 transition-colors text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {word.exampleSentence && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
          &ldquo;{word.exampleSentence}&rdquo;
        </p>
      )}

      {word.synonyms && word.synonyms.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {word.synonyms.map((s) => (
            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
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
  const [filterCat, setFilterCat] = useState<string>("all");
  const [showFavs, setShowFavs] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editWord, setEditWord] = useState<VocabWord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const words = useLiveQuery(async () => {
    let q = db.vocabWords.orderBy("createdAt").reverse();
    const all = await q.toArray();
    return all.filter((w) => {
      if (showFavs && !w.isFavorite) return false;
      if (filterDiff !== "all" && w.difficulty !== filterDiff) return false;
      if (filterCat !== "all" && w.category !== filterCat) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          w.word.toLowerCase().includes(s) ||
          w.meaning.toLowerCase().includes(s) ||
          w.synonyms?.some((syn) => syn.toLowerCase().includes(s))
        );
      }
      return true;
    });
  }, [search, filterDiff, filterCat, showFavs]);

  const totalWords = useLiveQuery(() => db.vocabWords.count());

  const openAdd = () => {
    setEditWord(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

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
    setDialogOpen(true);
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
        xpAwarded: false,
        createdAt: editWord?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      if (editWord?.id) {
        await db.vocabWords.update(editWord.id, data);
        toast.success("Word updated!");
      } else {
        const wordId = await db.vocabWords.add(data);
        // Award XP
        const profile = await db.userProfile.orderBy("id").first();
        if (profile?.id) {
          const newXp = (profile.xp ?? 0) + XP_REWARDS.wordAdded;
          await db.userProfile.update(profile.id, {
            xp: newXp % (profile.level * 200),
            totalXp: (profile.totalXp ?? 0) + XP_REWARDS.wordAdded,
            level: newXp >= profile.level * 200 ? profile.level + 1 : profile.level,
          });
        }
        await updateTodayStats({
          wordsLearned: ((await db.dailyStats.orderBy("id").last())?.wordsLearned ?? 0) + 1,
          xpEarned: ((await db.dailyStats.orderBy("id").last())?.xpEarned ?? 0) + XP_REWARDS.wordAdded,
        });
        // Create flashcard automatically
        await db.flashcards.add({
          wordId,
          front: form.word.trim(),
          back: form.meaning.trim(),
          nextReviewDate: new Date(),
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          createdAt: new Date(),
        });
        toast.success(`+${XP_REWARDS.wordAdded} XP! Word added and flashcard created.`);
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save word");
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
      <Header
        title="Vocabulary Manager"
        subtitle={`${totalWords ?? 0} words in your library`}
      />

      <div className="p-6 space-y-5 max-w-6xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search words..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={filterDiff} onValueChange={(v) => setFilterDiff(v ?? "all")}>
              <SelectTrigger className="w-32">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCat} onValueChange={(v) => setFilterCat(v ?? "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showFavs ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavs(!showFavs)}
              className="gap-1.5"
            >
              <Heart className={`w-3.5 h-3.5 ${showFavs ? "fill-current" : ""}`} />
              Favorites
            </Button>

            <Button onClick={openAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Word
            </Button>
          </div>
        </div>

        {/* Results count */}
        {words && (
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{words.length}</span> words
          </p>
        )}

        {/* Word Grid */}
        {words && words.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-base font-medium text-foreground mb-1">No words yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search ? "No words match your search" : "Start building your vocabulary"}
            </p>
            {!search && (
              <Button onClick={openAdd} className="gap-2">
                <Plus className="w-4 h-4" />
                Add your first word
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {words?.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editWord ? "Edit Word" : "Add New Word"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Word *</label>
                <Input
                  placeholder="e.g. Eloquent"
                  value={form.word}
                  onChange={(e) => setForm({ ...form, word: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Pronunciation</label>
                <Input
                  placeholder="e.g. ˈel.ə.kwənt"
                  value={form.pronunciation}
                  onChange={(e) => setForm({ ...form, pronunciation: e.target.value })}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Meaning *</label>
              <Textarea
                placeholder="Fluent or persuasive in speaking or writing"
                value={form.meaning}
                onChange={(e) => setForm({ ...form, meaning: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Example Sentence</label>
              <Textarea
                placeholder="She gave an eloquent speech that moved the audience."
                value={form.exampleSentence}
                onChange={(e) => setForm({ ...form, exampleSentence: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Synonyms (comma separated)</label>
              <Input
                placeholder="articulate, fluent, expressive"
                value={form.synonyms}
                onChange={(e) => setForm({ ...form, synonyms: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Difficulty</label>
                <Select
                  value={form.difficulty}
                  onValueChange={(v) => v && setForm({ ...form, difficulty: v as VocabWord["difficulty"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Category</label>
                <Select
                  value={form.category}
                  onValueChange={(v) => v && setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Notes</label>
              <Textarea
                placeholder="Any additional notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editWord ? "Update" : "Add Word"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
