"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, BookOpen, CreditCard, MessageSquare,
  GraduationCap, FileText, PenLine, Mic, CalendarDays,
  Sparkles, ClipboardList, Database,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { db } from "@/lib/db";

const NAV_COMMANDS = [
  { label: "داشبورد", keywords: "dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "واژگان", keywords: "vocabulary words", icon: BookOpen, href: "/vocabulary" },
  { label: "فلش‌کارت", keywords: "flashcards", icon: CreditCard, href: "/flashcards" },
  { label: "گرامر", keywords: "grammar", icon: GraduationCap, href: "/grammar" },
  { label: "جملات", keywords: "sentences", icon: MessageSquare, href: "/sentences" },
  { label: "خواندن", keywords: "reading", icon: FileText, href: "/reading" },
  { label: "نوشتن", keywords: "writing", icon: PenLine, href: "/writing" },
  { label: "صحبت کردن", keywords: "speaking", icon: Mic, href: "/speaking" },
  { label: "حالت آزمون", keywords: "exam mode", icon: ClipboardList, href: "/exam" },
  { label: "برنامه‌ریز", keywords: "planner", icon: CalendarDays, href: "/planner" },
  { label: "ابزار هوش مصنوعی", keywords: "ai tools", icon: Sparkles, href: "/ai-tools" },
  { label: "خروجی / ورودی داده", keywords: "export import data", icon: Database, href: "/data" },
];

type WordResult = { id: number; word: string; meaning: string };
type SentenceResult = { id: number; english: string; persian: string };

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState("");
  const [wordResults, setWordResults] = useState<WordResult[]>([]);
  const [sentenceResults, setSentenceResults] = useState<SentenceResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery("");
      setWordResults([]);
      setSentenceResults([]);
      return;
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setWordResults([]);
      setSentenceResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const q = query.toLowerCase();
        const allWords = await db.vocabWords.toArray();
        const words = allWords
          .filter((w) =>
            w.word.toLowerCase().includes(q) ||
            w.meaning.toLowerCase().includes(q) ||
            w.meaning.includes(query) // Persian doesn't need toLowerCase
          )
          .slice(0, 5)
          .map((w) => ({ id: w.id!, word: w.word, meaning: w.meaning }));

        const allSentences = await db.sentences.toArray();
        const sentences = allSentences
          .filter((s) =>
            s.english.toLowerCase().includes(q) ||
            s.persian.includes(query) ||
            s.persian.toLowerCase().includes(q)
          )
          .slice(0, 4)
          .map((s) => ({ id: s.id!, english: s.english, persian: s.persian }));

        setWordResults(words);
        setSentenceResults(sentences);
      } finally {
        setSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  const filteredNav = query
    ? NAV_COMMANDS.filter((c) =>
        c.label.includes(query) ||
        c.keywords.toLowerCase().includes(query.toLowerCase())
      )
    : NAV_COMMANDS;

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput
        placeholder="جستجو... / Search pages, words, sentences"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {searching ? "در حال جستجو..." : "نتیجه‌ای یافت نشد"}
        </CommandEmpty>

        {/* Vocabulary word results */}
        {wordResults.length > 0 && (
          <>
            <CommandGroup heading="Words — کلمات">
              {wordResults.map((w) => (
                <CommandItem
                  key={`word-${w.id}`}
                  onSelect={() => handleSelect("/vocabulary")}
                  className="flex items-center gap-3"
                >
                  <BookOpen className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium">{w.word}</span>
                  <span className="text-muted-foreground text-xs fa truncate">{w.meaning}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Sentence results */}
        {sentenceResults.length > 0 && (
          <>
            <CommandGroup heading="Sentences — جملات">
              {sentenceResults.map((s) => (
                <CommandItem
                  key={`sent-${s.id}`}
                  onSelect={() => handleSelect("/sentences")}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="text-sm">{s.english}</span>
                  <span className="text-xs text-muted-foreground fa">{s.persian}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation */}
        <CommandGroup heading="Navigate — ناوبری">
          {filteredNav.map(({ label, icon: Icon, href }) => (
            <CommandItem key={href} onSelect={() => handleSelect(href)}>
              <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
