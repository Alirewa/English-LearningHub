"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { db, type StudyPlan } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CalendarDays, CheckCircle2, Circle, Trash2, BookOpen, CreditCard, GraduationCap, FileText, PenLine, Mic } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { planner } from "@/lib/i18n/planner";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TASK_TYPES = ["vocabulary", "grammar", "reading", "writing", "speaking", "flashcards"] as const;

const TASK_ICONS: Record<string, React.ElementType> = {
  vocabulary: BookOpen,
  grammar: GraduationCap,
  reading: FileText,
  writing: PenLine,
  speaking: Mic,
  flashcards: CreditCard,
};

const TASK_COLORS: Record<string, string> = {
  vocabulary: "text-blue-400",
  grammar: "text-green-400",
  reading: "text-yellow-400",
  writing: "text-purple-400",
  speaking: "text-orange-400",
  flashcards: "text-pink-400",
};

type TaskType = typeof TASK_TYPES[number];
type PlannerDict = typeof planner["en"];

function PlanCard({ plan, onDelete, t }: { plan: StudyPlan; onDelete: (id: number) => void; t: PlannerDict }) {
  const toggleTask = async (taskIdx: number) => {
    const tasks = plan.tasks.map((t, i) =>
      i === taskIdx ? { ...t, isCompleted: !t.isCompleted } : t
    );
    await db.studyPlans.update(plan.id!, { tasks });
  };

  const completed = plan.tasks.filter((t) => t.isCompleted).length;
  const total = plan.tasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl border border-border bg-card p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{plan.name}</h3>
          <p className="text-xs text-muted-foreground">{t.days[plan.dayOfWeek]}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{completed}/{total}</span>
          <button
            onClick={() => plan.id && onDelete(plan.id)}
            className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {plan.tasks.map((task, i) => {
          const Icon = TASK_ICONS[task.type] ?? BookOpen;
          return (
            <button
              key={i}
              onClick={() => toggleTask(i)}
              className="flex items-center gap-3 w-full py-2 px-2 rounded-lg hover:bg-muted/40 transition-colors text-left"
            >
              {task.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 fill-green-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${TASK_COLORS[task.type]}`} />
              <span className={`text-sm flex-1 ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.description}
              </span>
              {task.targetCount && (
                <span className="text-xs text-muted-foreground">{task.targetCount}x</span>
              )}
              {task.targetMinutes && (
                <span className="text-xs text-muted-foreground">{task.targetMinutes}m</span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function PlannerPage() {
  const language = useAppStore((s) => s.language);
  const t = planner[language];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [tasks, setTasks] = useState<Array<{
    type: TaskType;
    description: string;
    targetCount?: number;
    targetMinutes?: number;
  }>>([]);
  const [newTaskType, setNewTaskType] = useState<TaskType>("vocabulary");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const plans = useLiveQuery(() =>
    db.studyPlans.where("isActive").equals(1).toArray()
  );

  const todayDayOfWeek = new Date().getDay();
  const todayPlans = plans?.filter((p) => p.dayOfWeek === todayDayOfWeek);

  const addTask = () => {
    if (!newTaskDesc.trim()) return;
    setTasks([...tasks, { type: newTaskType, description: newTaskDesc.trim() }]);
    setNewTaskDesc("");
  };

  const removeTask = (i: number) => {
    setTasks(tasks.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    if (!planName.trim() || tasks.length === 0) {
      toast.error(t.toasts.missingFields);
      return;
    }
    setSaving(true);
    try {
      await db.studyPlans.add({
        name: planName.trim(),
        dayOfWeek: parseInt(dayOfWeek),
        tasks: tasks.map((task) => ({ ...task, isCompleted: false })),
        isActive: true,
        createdAt: new Date(),
      });
      toast.success(t.toasts.created);
      setPlanName("");
      setTasks([]);
      setDialogOpen(false);
    } catch {
      toast.error(t.toasts.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await db.studyPlans.delete(id);
    toast.success(t.toasts.deleted);
  };

  return (
    <div>
      <Header title={t.header.title} subtitle={t.header.subtitle} />

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            {t.newPlan}
          </Button>
        </div>

        {/* Today's Plans */}
        {todayPlans && todayPlans.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t.today(t.days[todayDayOfWeek])}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {todayPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} t={t} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* All Plans by Day */}
        {DAYS.map((day, dayIdx) => {
          const dayPlans = plans?.filter((p) => p.dayOfWeek === dayIdx && dayIdx !== todayDayOfWeek);
          if (!dayPlans || dayPlans.length === 0) return null;
          return (
            <div key={day}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {t.days[dayIdx]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {dayPlans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} t={t} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

        {plans?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarDays className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-base font-medium text-foreground mb-1">{t.empty.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 fa">
              {t.empty.description}
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              {t.empty.cta}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.dialog.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">{t.dialog.nameLabel}</label>
              <Input
                placeholder={t.dialog.namePlaceholder}
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">{t.dialog.dayLabel}</label>
              <Select value={dayOfWeek} onValueChange={(v) => setDayOfWeek(v ?? "1")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day, i) => (
                    <SelectItem key={day} value={String(i)}>{t.days[i]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add Task */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">{t.dialog.tasksLabel}</label>
              <div className="flex gap-2">
                <Select value={newTaskType} onValueChange={(v) => v && setNewTaskType(v as TaskType)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map((taskType) => (
                      <SelectItem key={taskType} value={taskType}>{t.taskLabels[taskType]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder={t.dialog.taskDescPlaceholder}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <Button size="icon" onClick={addTask} className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {tasks.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {tasks.map((task, i) => {
                    const Icon = TASK_ICONS[task.type] ?? BookOpen;
                    return (
                      <div key={i} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-muted/40">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${TASK_COLORS[task.type]}`} />
                        <span className="text-sm flex-1 text-foreground">{task.description}</span>
                        <button onClick={() => removeTask(i)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t.dialog.cancel}</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t.dialog.saving : t.dialog.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
