"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { TrendingUp, BookOpen, CreditCard, GraduationCap, Flame, Trophy, Clock } from "lucide-react";

const COLORS = ["#818cf8", "#34d399", "#fb923c", "#f472b6", "#38bdf8"];

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-medium text-foreground">
            {p.value} {p.name ?? ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  const profile = useLiveQuery(() => db.userProfile.orderBy("id").first());

  // Last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  const dailyStatsData = useLiveQuery(async () => {
    const stats = await Promise.all(
      last30Days.map((date) => db.dailyStats.where("date").equals(date).first())
    );
    return last30Days.map((date, i) => ({
      date,
      label: new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" }),
      words: stats[i]?.wordsLearned ?? 0,
      flashcards: stats[i]?.flashcardsReviewed ?? 0,
      xp: stats[i]?.xpEarned ?? 0,
      reading: stats[i]?.readingMinutes ?? 0,
      writing: stats[i]?.writingMinutes ?? 0,
    }));
  });

  // Last 7 days for bar chart
  const last7Days = dailyStatsData?.slice(-7);

  const vocabCount = useLiveQuery(() => db.vocabWords.count());
  const flashcardCount = useLiveQuery(() => db.flashcards.count());
  const grammarCompleted = useLiveQuery(() =>
    db.grammarTopics.where("isCompleted").equals(1).count()
  );
  const grammarTotal = useLiveQuery(() => db.grammarTopics.count());
  const writingCount = useLiveQuery(() => db.writingEntries.count());
  const speakingCount = useLiveQuery(() => db.speakingSessions.count());
  const readingCount = useLiveQuery(() => db.readingSessions.where("isCompleted").equals(1).count());

  // Difficulty distribution
  const difficultyData = useLiveQuery(async () => {
    const [easy, medium, hard] = await Promise.all([
      db.vocabWords.where("difficulty").equals("easy").count(),
      db.vocabWords.where("difficulty").equals("medium").count(),
      db.vocabWords.where("difficulty").equals("hard").count(),
    ]);
    return [
      { name: "Easy", value: easy },
      { name: "Medium", value: medium },
      { name: "Hard", value: hard },
    ];
  });

  // Category distribution
  const categoryData = useLiveQuery(async () => {
    const all = await db.vocabWords.toArray();
    const counts: Record<string, number> = {};
    all.forEach((w) => {
      const cat = w.category ?? "General";
      counts[cat] = (counts[cat] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  });

  const totalXpThisWeek = last7Days?.reduce((sum, d) => sum + d.xp, 0) ?? 0;
  const totalWordsThisWeek = last7Days?.reduce((sum, d) => sum + d.words, 0) ?? 0;

  return (
    <div>
      <Header title="Analytics" subtitle="Track your learning progress over time" />

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Summary Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {[
            { label: "Total Vocab", value: vocabCount ?? 0, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Flashcards", value: flashcardCount ?? 0, icon: CreditCard, color: "text-purple-400", bg: "bg-purple-500/10" },
            { label: "Grammar Done", value: `${grammarCompleted ?? 0}/${grammarTotal ?? 0}`, icon: GraduationCap, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Journal Entries", value: writingCount ?? 0, icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { label: "Speaking", value: speakingCount ?? 0, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
            { label: "Articles Read", value: readingCount ?? 0, icon: Clock, color: "text-pink-400", bg: "bg-pink-500/10" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              variants={item}
              className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly XP + Words */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-foreground">XP This Week</h3>
                <p className="text-2xl font-bold text-primary mt-1">{totalXpThisWeek} XP</p>
              </div>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={last7Days ?? []} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.02 264)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="xp" fill="oklch(0.65 0.18 264)" radius={[4, 4, 0, 0]} name="XP" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-foreground">Words Learned This Week</h3>
                <p className="text-2xl font-bold text-blue-400 mt-1">{totalWordsThisWeek}</p>
              </div>
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={last7Days ?? []} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "oklch(0.55 0.02 264)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="words" fill="oklch(0.65 0.18 264 / 0.7)" radius={[4, 4, 0, 0]} name="Words" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* 30-Day XP Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">30-Day XP Trend</h3>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyStatsData ?? []}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.18 264)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.18 264)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "oklch(0.55 0.02 264)" }}
                axisLine={false}
                tickLine={false}
                interval={6}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="oklch(0.65 0.18 264)"
                strokeWidth={2}
                fill="url(#xpGradient)"
                name="XP"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Difficulty + Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="font-semibold text-foreground mb-5">Vocabulary Difficulty</h3>
            {difficultyData && difficultyData.reduce((s, d) => s + d.value, 0) > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {difficultyData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={["oklch(0.65 0.2 150)", "oklch(0.78 0.18 80)", "oklch(0.65 0.22 25)"][i]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {difficultyData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: ["oklch(0.65 0.2 150)", "oklch(0.78 0.18 80)", "oklch(0.65 0.22 25)"][i] }}
                      />
                      <span className="text-sm text-muted-foreground">{d.name}</span>
                      <span className="text-sm font-semibold text-foreground ml-auto pl-4">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Add vocabulary to see distribution</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="font-semibold text-foreground mb-5">Top Categories</h3>
            {categoryData && categoryData.length > 0 ? (
              <div className="space-y-3">
                {categoryData.map((cat, i) => {
                  const max = categoryData[0].value;
                  return (
                    <div key={cat.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 truncate">{cat.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(cat.value / max) * 100}%` }}
                          transition={{ duration: 0.7, delay: i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-6 text-right">{cat.value}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Add vocabulary to see categories</p>
            )}
          </motion.div>
        </div>

        {/* Profile Stats */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="font-semibold text-foreground mb-5">All-Time Records</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total XP Earned", value: profile.totalXp ?? 0, suffix: "XP" },
                { label: "Current Level", value: profile.level ?? 1, suffix: "" },
                { label: "Current Streak", value: `${profile.streak ?? 0}d`, suffix: "" },
                { label: "Longest Streak", value: `${profile.longestStreak ?? 0}d`, suffix: "" },
              ].map(({ label, value, suffix }) => (
                <div key={label} className="text-center py-3">
                  <p className="text-2xl font-bold text-foreground">
                    {value}
                    {suffix && <span className="text-sm text-muted-foreground ml-1">{suffix}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
