"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { db, getTodayStats } from "@/lib/db";
import { Header } from "@/components/layout/header";
import {
  BookOpen, CreditCard, GraduationCap, Clock,
  Flame, Trophy, Target, TrendingUp, Zap, Star,
  ArrowRight, Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DailyStats } from "@/lib/db";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  suffix = "",
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  suffix?: string;
}) {
  return (
    <motion.div variants={item} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  description,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <motion.div variants={item}>
      <Link
        href={href}
        className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-all group"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);

  useEffect(() => {
    getTodayStats().then(setTodayStats);
  }, []);

  const profile = useLiveQuery(() => db.userProfile.orderBy("id").first());
  const totalWords = useLiveQuery(() => db.vocabWords.count());
  const totalFlashcards = useLiveQuery(() => db.flashcards.count());
  const dueFlashcards = useLiveQuery(() =>
    db.flashcards.where("nextReviewDate").belowOrEqual(new Date()).count()
  );
  const grammarCompleted = useLiveQuery(() =>
    db.grammarTopics.where("isCompleted").equals(1).count()
  );
  const grammarTotal = useLiveQuery(() => db.grammarTopics.count());
  const recentWords = useLiveQuery(() =>
    db.vocabWords.orderBy("createdAt").reverse().limit(5).toArray()
  );

  // Last 7 days stats
  const weekStats = useLiveQuery(async () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });
    const stats = await Promise.all(
      days.map((date) => db.dailyStats.where("date").equals(date).first())
    );
    return days.map((date, i) => ({
      date,
      label: new Date(date).toLocaleDateString("en", { weekday: "short" }),
      xp: stats[i]?.xpEarned ?? 0,
      words: stats[i]?.wordsLearned ?? 0,
    }));
  });

  const xpForNextLevel = (profile?.level ?? 1) * 200;
  const xpProgress = Math.min(((profile?.xp ?? 0) / xpForNextLevel) * 100, 100);
  const maxWeekXp = Math.max(...(weekStats?.map((d) => d.xp) ?? [1]), 1);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "صبح بخیر" : greetingHour < 18 ? "ظهر بخیر" : "عصر بخیر";

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle={`${greeting}، ${profile?.name ?? "زبان‌آموز"} 👋`}
      />

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Streak + Level Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Streak */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                <Flame className="w-7 h-7 text-orange-400 fill-orange-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{profile?.streak ?? 0}</p>
                <p className="text-sm text-muted-foreground">روز پیاپی</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-border" />

            {/* Level */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Star className="w-7 h-7 text-primary fill-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">سطح {profile?.level ?? 1}</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.xp ?? 0} / {xpForNextLevel} XP
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-border" />

            {/* XP Progress */}
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>تا سطح {(profile?.level ?? 1) + 1}</span>
                <span>{Math.round(xpProgress)}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {xpForNextLevel - (profile?.xp ?? 0)} XP تا سطح بعدی
              </p>
            </div>
          </div>
        </motion.div>

        {/* Today's Stats */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            پیشرفت امروز
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            <StatCard
              icon={BookOpen}
              label="کلمات یادگرفته"
              value={todayStats?.wordsLearned ?? 0}
              color="bg-blue-500/15 text-blue-400"
            />
            <StatCard
              icon={CreditCard}
              label="فلش‌کارت"
              value={todayStats?.flashcardsReviewed ?? 0}
              color="bg-purple-500/15 text-purple-400"
            />
            <StatCard
              icon={GraduationCap}
              label="گرامر"
              value={todayStats?.grammarLessonsCompleted ?? 0}
              color="bg-green-500/15 text-green-400"
            />
            <StatCard
              icon={Clock}
              label="خواندن"
              value={todayStats?.readingMinutes ?? 0}
              suffix="دقیقه"
              color="bg-yellow-500/15 text-yellow-400"
            />
            <StatCard
              icon={Zap}
              label="XP کسب‌شده"
              value={todayStats?.xpEarned ?? 0}
              color="bg-orange-500/15 text-orange-400"
            />
            <StatCard
              icon={Target}
              label="کارت موعددار"
              value={dueFlashcards ?? 0}
              color="bg-red-500/15 text-red-400"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground">فعالیت هفتگی</h3>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2 h-28">
              {weekStats?.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                    <motion.div
                      className="w-full rounded-t-md bg-primary/40 hover:bg-primary/60 transition-colors cursor-default"
                      style={{ height: `${(day.xp / maxWeekXp) * 80}px`, minHeight: day.xp > 0 ? 4 : 2 }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.xp / maxWeekXp) * 80}px` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      title={`${day.xp} XP`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border bg-card p-5 space-y-4"
          >
            <h3 className="font-semibold text-foreground">کل دوران</h3>
            {[
              { label: "کل کلمات", value: totalWords ?? 0, icon: BookOpen, color: "text-blue-400" },
              { label: "فلش‌کارت", value: totalFlashcards ?? 0, icon: CreditCard, color: "text-purple-400" },
              {
                label: "گرامر انجام‌شده",
                value: `${grammarCompleted ?? 0}/${grammarTotal ?? 0}`,
                icon: GraduationCap,
                color: "text-green-400",
              },
              { label: "کل XP", value: profile?.totalXp ?? 0, icon: Trophy, color: "text-yellow-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            دسترسی سریع
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            <QuickAction
              href="/vocabulary"
              icon={Plus}
              label="افزودن کلمه جدید"
              description="واژگانت رو گسترش بده"
              color="bg-blue-500/15 text-blue-400"
            />
            <QuickAction
              href="/flashcards"
              icon={CreditCard}
              label={`مرور فلش‌کارت (${dueFlashcards ?? 0} موعددار)`}
              description="تمرین با تکرار فاصله‌دار"
              color="bg-purple-500/15 text-purple-400"
            />
            <QuickAction
              href="/grammar"
              icon={GraduationCap}
              label="مطالعه گرامر"
              description="یادگیری قواعد گرامری"
              color="bg-green-500/15 text-green-400"
            />
            <QuickAction
              href="/writing"
              icon={CreditCard}
              label="دفترچه روزانه"
              description="افکارت رو به انگلیسی بنویس"
              color="bg-yellow-500/15 text-yellow-400"
            />
            <QuickAction
              href="/speaking"
              icon={Flame}
              label="تمرین مکالمه"
              description="موضوع‌های تصادفی برای صحبت"
              color="bg-orange-500/15 text-orange-400"
            />
            <QuickAction
              href="/ai-tools"
              icon={Zap}
              label="ابزارهای هوش مصنوعی"
              description="بررسی گرامر، توضیح جمله"
              color="bg-pink-500/15 text-pink-400"
            />
          </motion.div>
        </div>

        {/* Recent Words */}
        {recentWords && recentWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">کلمات اخیر</h3>
              <Link href="/vocabulary" className="text-xs text-primary hover:underline">
                مشاهده همه
              </Link>
            </div>
            <div className="space-y-2">
              {recentWords.map((word) => (
                <div
                  key={word.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-foreground">{word.word}</span>
                    {word.pronunciation && (
                      <span className="text-xs text-muted-foreground font-mono">
                        /{word.pronunciation}/
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate max-w-32 fa">
                      {word.meaning}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        word.difficulty === "easy"
                          ? "bg-green-500/15 text-green-400"
                          : word.difficulty === "medium"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {word.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
