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
import { common } from "@/lib/i18n/common";
import { nav } from "@/lib/i18n/nav";

function getNavCommands(t: typeof nav.en) {
  return [
    { label: t.items.dashboard, keywords: "dashboard داشبورد", icon: LayoutDashboard, href: "/dashboard" },
    { label: t.items.vocabulary, keywords: "vocabulary words واژگان کلمات", icon: BookOpen, href: "/vocabulary" },
    { label: t.items.flashcards, keywords: "flashcards فلش کارت", icon: CreditCard, href: "/flashcards" },
    { label: t.items.grammar, keywords: "grammar گرامر", icon: GraduationCap, href: "/grammar" },
    { label: t.items.sentences, keywords: "sentences جملات", icon: MessageSquare, href: "/sentences" },
    { label: t.items.reading, keywords: "reading خواندن", icon: FileText, href: "/reading" },
    { label: t.items.writing, keywords: "writing نوشتن", icon: PenLine, href: "/writing" },
    { label: t.items.speaking, keywords: "speaking صحبت کردن", icon: Mic, href: "/speaking" },
    { label: t.items.exam, keywords: "exam mode حالت آزمون", icon: ClipboardList, href: "/exam" },
    { label: t.items.planner, keywords: "planner برنامه ریز", icon: CalendarDays, href: "/planner" },
    { label: t.items.aiTools, keywords: "ai tools ابزار هوش مصنوعی", icon: Sparkles, href: "/ai-tools" },
    { label: t.items.data, keywords: "export import data خروجی ورودی داده", icon: Database, href: "/data" },
  ];
}

type WordResult = { id: number; word: string; meaning: string };
type SentenceResult = { id: number; english: string; persian: string };

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, language } = useAppStore();
  const t = common[language];
  const navT = nav[language];
  const NAV_COMMANDS = getNavCommands(navT);
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
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.label.includes(query) ||
        c.keywords.toLowerCase().includes(query.toLowerCase())
      )
    : NAV_COMMANDS;

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      title={t.commandPalette.title}
      description={t.commandPalette.description}
    >
      <CommandInput
        placeholder={t.commandPalette.placeholder}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {searching ? t.commandPalette.searching : t.commandPalette.noResults}
        </CommandEmpty>

        {/* Vocabulary word results */}
        {wordResults.length > 0 && (
          <>
            <CommandGroup heading={t.commandPalette.words}>
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
            <CommandGroup heading={t.commandPalette.sentences}>
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
        <CommandGroup heading={t.commandPalette.navigate}>
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
