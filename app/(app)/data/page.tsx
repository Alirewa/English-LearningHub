"use client";

import { useState, useRef } from "react";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Download, Upload, Database, Trash2, CheckCircle2,
  AlertTriangle, FileJson, RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { data as dataDict } from "@/lib/i18n/data";

async function exportAllData() {
  const [
    vocabWords, sentences, grammarTopics, writingEntries,
    speakingSessions, readingSessions, studyPlans,
    dailyStats, achievements, userProfile,
  ] = await Promise.all([
    db.vocabWords.toArray(),
    db.sentences.toArray(),
    db.grammarTopics.toArray(),
    db.writingEntries.toArray(),
    db.speakingSessions.toArray(),
    db.readingSessions.toArray(),
    db.studyPlans.toArray(),
    db.dailyStats.toArray(),
    db.achievements.toArray(),
    db.userProfile.toArray(),
  ]);

  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    appName: "English Learning Hub",
    vocabWords,
    sentences,
    grammarTopics,
    writingEntries,
    speakingSessions,
    readingSessions,
    studyPlans,
    dailyStats,
    achievements,
    userProfile,
  };
}

type ImportMode = "merge" | "replace";

export default function DataPage() {
  const language = useAppStore((s) => s.language);
  const t = dataDict[language];
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>("merge");
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadStats = async () => {
    const [words, sentences, grammar, writing, speaking, reading] = await Promise.all([
      db.vocabWords.count(),
      db.sentences.count(),
      db.grammarTopics.count(),
      db.writingEntries.count(),
      db.speakingSessions.count(),
      db.readingSessions.count(),
    ]);
    setStats({ words, sentences, grammar, writing, speaking, reading });
  };

  // Load stats on mount
  if (stats === null) {
    loadStats();
  }

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportAllData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `english-hub-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(t.exportSuccess);
    } catch {
      toast.error(t.exportFailed);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.appName || data.appName !== "English Learning Hub") {
        toast.error(t.invalidFile);
        return;
      }

      const strip = <T,>(arr: T[]): T[] =>
        arr.map((item) => {
          const copy = { ...(item as Record<string, unknown>) };
          delete copy.id;
          return copy as T;
        });

      if (importMode === "replace") {
        await db.transaction("rw",
          [db.vocabWords, db.sentences, db.grammarTopics, db.writingEntries,
           db.speakingSessions, db.readingSessions, db.studyPlans,
           db.dailyStats, db.achievements, db.userProfile],
          async () => {
            await db.vocabWords.clear();
            await db.sentences.clear();
            await db.grammarTopics.clear();
            await db.writingEntries.clear();
            await db.speakingSessions.clear();
            await db.readingSessions.clear();
            await db.studyPlans.clear();
            await db.dailyStats.clear();
            await db.achievements.clear();
            await db.userProfile.clear();

            if (data.vocabWords?.length) await db.vocabWords.bulkAdd(strip(data.vocabWords));
            if (data.sentences?.length) await db.sentences.bulkAdd(strip(data.sentences));
            if (data.grammarTopics?.length) await db.grammarTopics.bulkAdd(strip(data.grammarTopics));
            if (data.writingEntries?.length) await db.writingEntries.bulkAdd(strip(data.writingEntries));
            if (data.speakingSessions?.length) await db.speakingSessions.bulkAdd(strip(data.speakingSessions));
            if (data.readingSessions?.length) await db.readingSessions.bulkAdd(strip(data.readingSessions));
            if (data.studyPlans?.length) await db.studyPlans.bulkAdd(strip(data.studyPlans));
            if (data.dailyStats?.length) await db.dailyStats.bulkAdd(strip(data.dailyStats));
            if (data.achievements?.length) await db.achievements.bulkAdd(strip(data.achievements));
            if (data.userProfile?.length) await db.userProfile.bulkAdd(strip(data.userProfile));
          }
        );
        toast.success(t.replaceSuccess);
      } else {
        // Merge: only add items that don't already exist (by word/english text)
        const existingWords = new Set((await db.vocabWords.toArray()).map((w) => w.word.toLowerCase()));
        const newWords = (data.vocabWords ?? []).filter(
          (w: { word: string }) => !existingWords.has(w.word.toLowerCase())
        );
        if (newWords.length) await db.vocabWords.bulkAdd(strip(newWords));

        const existingSentences = new Set((await db.sentences.toArray()).map((s) => s.english.toLowerCase()));
        const newSentences = (data.sentences ?? []).filter(
          (s: { english: string }) => !existingSentences.has(s.english.toLowerCase())
        );
        if (newSentences.length) await db.sentences.bulkAdd(strip(newSentences));

        toast.success(t.mergeSuccess(newWords.length, newSentences.length));
      }

      await loadStats();
    } catch (err) {
      toast.error(t.importFailed);
      console.error(err);
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleExportText = async () => {
    const words = await db.vocabWords.toArray();
    if (!words.length) { toast.error(t.noWordsYet); return; }

    const lines = words.map((w) =>
      `${w.word} — ${w.meaning}${w.exampleSentence ? `\n   Example: ${w.exampleSentence}` : ""}`
    );
    const text = `English Hub — Vocabulary List\nExported: ${new Date().toLocaleDateString()}\n${"─".repeat(40)}\n\n${lines.join("\n\n")}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vocabulary-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t.wordListDownloaded);
  };

  const cards = [
    { label: t.cards.vocabulary, labelEn: "Vocabulary", value: stats?.words ?? 0, icon: "📚" },
    { label: t.cards.sentences, labelEn: "Sentences", value: stats?.sentences ?? 0, icon: "💬" },
    { label: t.cards.grammar, labelEn: "Grammar", value: stats?.grammar ?? 0, icon: "📖" },
    { label: t.cards.writing, labelEn: "Writing", value: stats?.writing ?? 0, icon: "✍️" },
    { label: t.cards.speaking, labelEn: "Speaking", value: stats?.speaking ?? 0, icon: "🎙️" },
    { label: t.cards.reading, labelEn: "Reading", value: stats?.reading ?? 0, icon: "📰" },
  ];

  return (
    <div>
      <Header title={t.pageTitle} subtitle={t.pageSubtitle} />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">

        {/* Data Overview */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              {t.overview.heading}
            </h2>
            <button
              onClick={loadStats}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title={t.overview.refresh}
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cards.map((c) => (
              <motion.div
                key={c.labelEn}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/40"
              >
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-lg font-bold text-foreground">{c.value}</p>
                  <p className="text-[10px] text-muted-foreground fa">{c.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Export Section */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Download className="w-4 h-4 text-green-400" />
            {t.exportSection.heading}
          </h2>

          <div className="grid gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-start gap-4 p-4 rounded-xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors text-left disabled:opacity-60"
            >
              <FileJson className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {exporting ? t.exportSection.preparing : t.exportSection.fullBackupTitle}
                </p>
                <p className="text-xs text-muted-foreground fa mt-0.5">
                  {t.exportSection.fullBackupDescFa}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.exportSection.fullBackupDescEn}
                </p>
              </div>
            </button>

            <button
              onClick={handleExportText}
              className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/10 transition-colors text-left"
            >
              <Download className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">{t.exportSection.wordListTitle}</p>
                <p className="text-xs text-muted-foreground fa mt-0.5">
                  {t.exportSection.wordListDesc}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-400" />
            {t.importSection.heading}
          </h2>

          {/* Import mode toggle */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{t.importSection.modeLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setImportMode("merge")}
                className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  importMode === "merge"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mb-1" />
                <p>{t.importSection.merge.title}</p>
                <p className="text-[10px] font-normal text-muted-foreground mt-0.5 fa">
                  {t.importSection.merge.desc}
                </p>
              </button>
              <button
                onClick={() => setImportMode("replace")}
                className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  importMode === "replace"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Trash2 className="w-4 h-4 mb-1" />
                <p>{t.importSection.replace.title}</p>
                <p className="text-[10px] font-normal text-muted-foreground mt-0.5 fa">
                  {t.importSection.replace.desc}
                </p>
              </button>
            </div>
          </div>

          {importMode === "replace" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive fa">
                {t.importSection.replaceWarning}
              </p>
            </div>
          )}

          <label className={`flex items-start gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            importing
              ? "border-muted opacity-60"
              : "border-border hover:border-primary/50 hover:bg-accent/5"
          }`}>
            <Upload className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {importing ? t.importSection.processing : t.importSection.selectFile}
              </p>
              <p className="text-xs text-muted-foreground fa mt-0.5">
                {t.importSection.selectFileDesc}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.importSection.selectFileNote}
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
              disabled={importing}
            />
          </label>
        </div>

        {/* Info */}
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground fa leading-loose">
            {t.infoNote}
          </p>
        </div>

      </div>
    </div>
  );
}
