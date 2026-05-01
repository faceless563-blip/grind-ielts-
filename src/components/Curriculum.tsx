import React, { useState } from 'react';
import { useStore } from '@/src/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2, PlayCircle, Book, FileText, ChevronRight, Target, Headphones, CalendarDays, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { month1Weeks } from '@/src/data/month1_syllabus';

const getTaskIcon = (type: string) => {
  switch (type) {
    case 'writing': return FileText;
    case 'reading': return Book;
    case 'listening': return Headphones;
    case 'speaking': return PlayCircle;
    case 'vocabulary': return Book;
    case 'review': return Target;
    case 'mock': return Target;
    default: return CheckCircle2;
  }
};

const Month1Details = ({ onBack }: { onBack: () => void }) => {
  const { progress, updateTaskProgress } = useStore();
  const [activeWeekId, setActiveWeekId] = useState<number | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState<number | null>(null);

  const activeWeek = activeWeekId ? month1Weeks.find(w => w.id === activeWeekId) : null;
  const activeDay = activeWeek && activeDayIdx !== null ? activeWeek.days[activeDayIdx] : null;

  return (
    <div className="mt-8 space-y-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <button 
          onClick={onBack}
          className="self-start flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Overview
        </button>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded border flex items-center justify-center bg-card">
            <Target size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Month 1: Foundation</h2>
            <p className="text-sm opacity-60">Target: Band 9.0 • Habit Building Phase</p>
          </div>
        </div>
      </div>

      {!activeWeek ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {month1Weeks.map((week) => (
            <div 
              key={week.id} 
              className="border border-border p-5 rounded hover:bg-muted transition-colors cursor-pointer group bg-card"
              onClick={() => {
                setActiveWeekId(week.id);
                setActiveDayIdx(null);
              }}
            >
              <div className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">Week {week.id}</div>
              <h3 className="text-lg font-bold mb-3">{week.title}</h3>
              <div className="flex items-center gap-2 text-xs opacity-40">
                <CalendarDays size={12} />
                <span>{week.days.length} Daily Modules</span>
              </div>
            </div>
          ))}
        </div>
      ) : !activeDay ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveWeekId(null)}
              className="p-1 hover:bg-muted rounded"
            >
              <ChevronLeft size={16} className="opacity-40" />
            </button>
            <h3 className="text-xl font-bold">Week {activeWeek.id}: {activeWeek.subtitle}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {activeWeek.days.map((day, idx) => (
              <div 
                key={idx} 
                className="border border-border p-5 text-center rounded hover:bg-muted transition-colors cursor-pointer group bg-card"
                onClick={() => setActiveDayIdx(idx)}
              >
                <div className="text-lg font-bold group-hover:text-primary transition-colors">{day.name}</div>
                <div className="text-[10px] opacity-40 uppercase font-medium mt-1">{day.date}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveDayIdx(null)}
              className="p-1 hover:bg-muted rounded opacity-40 hover:opacity-100"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="text-xl font-bold">{activeDay.name}, {activeDay.date}</h3>
          </div>
          
          <div className="space-y-2">
            {activeDay.tasks.map((task, idx) => {
              const Icon = getTaskIcon(task.type);
              return (
                <div key={idx} className="flex items-start gap-4 p-4 border border-border rounded bg-card hover:bg-muted/50 transition-colors">
                  <div className="h-8 w-8 shrink-0 rounded bg-muted flex items-center justify-center border border-border">
                    <Icon size={14} className="opacity-60" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className={cn(
                        "text-sm font-bold",
                        (progress.completedTasks[`w${activeWeek.id}d${activeDayIdx}t${idx}`] || 0) === 1 && "line-through opacity-30"
                      )}>{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">+25 XP</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">{task.type}</span>
                      </div>
                    </div>
                    <p className={cn("text-xs opacity-60 leading-relaxed", (progress.completedTasks[`w${activeWeek.id}d${activeDayIdx}t${idx}`] || 0) === 1 && "opacity-20")}>
                      {task.description}
                    </p>
                    <div className="mt-4">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className={cn(
                          "h-auto p-0 text-[10px] font-black uppercase tracking-widest",
                          (progress.completedTasks[`w${activeWeek.id}d${activeDayIdx}t${idx}`] || 0) === 1 ? "text-emerald-500" : "text-primary"
                        )}
                        onClick={() => updateTaskProgress(`w${activeWeek.id}d${activeDayIdx}t${idx}`, (progress.completedTasks[`w${activeWeek.id}d${activeDayIdx}t${idx}`] || 0) === 1 ? 0 : 1)}
                      >
                        {(progress.completedTasks[`w${activeWeek.id}d${activeDayIdx}t${idx}`] || 0) === 1 ? '✓ Completed' : 'Mark as Done'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Curriculum() {
  const { curriculum, progress, isWeekUnlocked, getWeekProgress } = useStore();
  const [activeMonth, setActiveMonth] = useState<number | null>(null);

  if (activeMonth !== null) {
    return (
      <div className="max-w-5xl mx-auto">
        {activeMonth === 1 ? (
          <Month1Details onBack={() => setActiveMonth(null)} />
        ) : (
          <div className="mt-8 space-y-8">
             <button 
                onClick={() => setActiveMonth(null)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100"
              >
                <ChevronLeft size={14} />
                Back to Curriculum
             </button>
             <div className="p-12 text-center border border-border rounded bg-muted/50">
              <h3 className="text-xl font-bold mb-2">Month {activeMonth} Content</h3>
              <p className="text-sm opacity-60">Complete Month {activeMonth - 1} with 80%+ to unlock these modules.</p>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
          <Book size={12} />
          <span>Prep Pathway</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Academic Syllabus</h1>
        <p className="text-sm opacity-60 max-w-2xl leading-relaxed">
          A zero-fluff, high-intensity strategy for Band 9.0.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {curriculum.map((month) => {
          const unlocked = isWeekUnlocked(month.id);
          const monthProgress = getWeekProgress(month.id);

          return (
            <div 
              key={month.id}
              className={cn(
                "border border-border p-6 rounded relative transition-all",
                unlocked 
                  ? "bg-card hover:border-primary/50 hover:bg-muted/30 cursor-pointer" 
                  : "bg-muted opacity-50 grayscale"
              )}
              onClick={() => unlocked && setActiveMonth(month.id)}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Month {month.id}</span>
                {!unlocked && <Lock size={12} className="opacity-30" />}
                {monthProgress === 100 && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>

              <h3 className="text-xl font-bold mb-2">{month.title}</h3>
              <p className="text-xs opacity-60 mb-8 line-clamp-2">{month.description}</p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-40">
                  <span>Progress</span>
                  <span>{monthProgress}%</span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${monthProgress}%` }} 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <span>Access Module</span>
                <ChevronRight size={12} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
