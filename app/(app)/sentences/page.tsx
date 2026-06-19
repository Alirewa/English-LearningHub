"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, type Sentence } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, Heart, MessageSquare, Trash2, Copy, X } from "lucide-react";
import { toast } from "sonner";

const SENTENCE_CATEGORIES = [
  "Travel", "Work", "Daily Life", "Technology", "Social",
  "Business", "Interview", "University", "Custom",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Travel": "bg-sky-500/15 text-sky-400",
  "Work": "bg-blue-500/15 text-blue-400",
  "Daily Life": "bg-green-500/15 text-green-400",
  "Technology": "bg-purple-500/15 text-purple-400",
  "Social": "bg-pink-500/15 text-pink-400",
  "Business": "bg-yellow-500/15 text-yellow-400",
  "Interview": "bg-orange-500/15 text-orange-400",
  "University": "bg-cyan-500/15 text-cyan-400",
  "Custom": "bg-muted text-muted-foreground",
};

function SentenceCard({ sentence, onDelete }: { sentence: Sentence; onDelete: (id: number) => void }) {
  const toggleFav = async () => {
    await db.sentences.update(sentence.id!, { isFavorite: !sentence.isFavorite });
  };

  const copy = () => {
    navigator.clipboard.writeText(sentence.english);
    toast.success("Copied to clipboard");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/20 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground leading-relaxed flex-1">
          {sentence.english}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={copy} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground" title="Copy">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={toggleFav} className="p-1.5 rounded hover:bg-muted transition-colors" title="Favorite">
            <Heart className={`w-3.5 h-3.5 transition-colors ${sentence.isFavorite ? "fill-red-400 text-red-400" : "text-muted-foreground"}`} />
          </button>
          <button
            onClick={() => sentence.id && onDelete(sentence.id)}
            className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-sm text-primary/80 font-medium">{sentence.persian}</p>

      {sentence.notes && (
        <p className="text-xs text-muted-foreground italic">{sentence.notes}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[sentence.category] ?? "bg-muted text-muted-foreground"}`}>
          {sentence.category}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {new Date(sentence.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}

export default function SentencesPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showFavs, setShowFavs] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    english: "", persian: "", notes: "", category: "Daily Life",
  });
  const [saving, setSaving] = useState(false);

  const sentences = useLiveQuery(async () => {
    const all = await db.sentences.orderBy("createdAt").reverse().toArray();
    return all.filter((s) => {
      if (showFavs && !s.isFavorite) return false;
      if (filterCat !== "all" && s.category !== filterCat) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.english.toLowerCase().includes(q) || s.persian.includes(search);
      }
      return true;
    });
  }, [search, filterCat, showFavs]);

  const totalCount = useLiveQuery(() => db.sentences.count());

  const handleSave = async () => {
    if (!form.english.trim() || !form.persian.trim()) {
      toast.error("English and Persian fields are required");
      return;
    }
    setSaving(true);
    try {
      await db.sentences.add({
        english: form.english.trim(),
        persian: form.persian.trim(),
        notes: form.notes.trim() || undefined,
        category: form.category,
        isFavorite: false,
        createdAt: new Date(),
      });
      toast.success("Sentence added!");
      setForm({ english: "", persian: "", notes: "", category: "Daily Life" });
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await db.sentences.delete(id);
    toast.success("Deleted");
  };

  return (
    <div>
      <Header
        title="Sentences"
        subtitle={`${totalCount ?? 0} جمله ذخیره شده`}
      />

      <div className="p-6 space-y-5 max-w-5xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در جملات... / Search EN or FA"
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
          <div className="flex gap-2 flex-wrap">
            <Select value={filterCat} onValueChange={(v) => setFilterCat(v ?? "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {SENTENCE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showFavs ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavs(!showFavs)}
            >
              <Heart className={`w-3.5 h-3.5 mr-1.5 ${showFavs ? "fill-current" : ""}`} />
              Favorites
            </Button>

            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Sentence
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCat("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filterCat === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            All ({totalCount ?? 0})
          </button>
          {SENTENCE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filterCat === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sentence Grid */}
        {sentences?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-base font-medium text-foreground mb-1">No sentences found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search ? "Try different search terms" : "Add useful English sentences with Persian translations"}
            </p>
            {!search && (
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Sentence
              </Button>
            )}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {sentences?.map((s) => (
                <SentenceCard key={s.id} sentence={s} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Sentence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">English Sentence *</label>
              <Textarea
                placeholder="Could you please repeat that?"
                value={form.english}
                onChange={(e) => setForm({ ...form, english: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Persian Translation *</label>
              <Textarea
                placeholder="می‌تونید دوباره بگید؟"
                value={form.persian}
                onChange={(e) => setForm({ ...form, persian: e.target.value })}
                rows={2}
                dir="rtl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Notes</label>
              <Input
                placeholder="Usage notes or context..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Category</label>
              <Select value={form.category} onValueChange={(v) => v && setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENTENCE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Add Sentence"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
