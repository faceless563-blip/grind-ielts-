import React, { useState, useEffect } from 'react';
import { useStore } from '@/src/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, Brain, BookOpen, Clock, Target, Play, Pause, RotateCcw, Flame, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { progress, getWeekProgress, addStudyLog } = useStore();
  const currentWeekProgress = getWeekProgress(progress.currentWeek);
  
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishSession = async () => {
    if (timerSeconds < 60) {
      alert("Session too short to log (minimum 1 minute).");
      return;
    }
    const hours = Number((timerSeconds / 3600).toFixed(2));
    await addStudyLog({
      date: new Date().toISOString(),
      hours,
      notes: "Active Dashboard Session"
    });
    setTimerSeconds(0);
    setIsTimerActive(false);
  };

  return (
    <div className="space-y-12">
      {/* Level & Progression Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-lg bg-foreground text-background overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <Trophy size={12} />
              <span>Rank: Scholar</span>
            </div>
            <h1 className="text-4xl font-black">Level {progress.level}</h1>
            <div className="flex items-center gap-4 text-xs font-bold opacity-60">
              <span className="flex items-center gap-1.5">
                <Flame size={14} className="text-orange-500 fill-orange-500" />
                {progress.streak} Day Streak
              </span>
              <span>•</span>
              <span>{progress.xp} XP Earned</span>
            </div>
          </div>
          
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
              <span>Next Level Progress</span>
              <span>{progress.xp % (progress.level * 1000)} / {progress.level * 1000}</span>
            </div>
            <div className="h-1.5 w-full bg-background/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(progress.xp % (progress.level * 1000)) / (progress.level * 10) || 0}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Week', value: progress.currentWeek, unit: 'of 4', icon: BookOpen, color: "text-blue-500" },
          { label: 'Study Hours', value: progress.studyLogs.reduce((acc: any, log: any) => acc + log.hours, 0).toFixed(1), unit: 'Total', icon: Target, color: "text-emerald-500" },
          { label: 'Daily Streak', value: progress.streak, unit: 'Days', icon: Flame, color: "text-orange-500" },
          { label: 'Completed', value: `${currentWeekProgress}%`, unit: 'Weekly', icon: Zap, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-border p-6 rounded bg-card hover:border-primary/50 transition-all group"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4 flex items-center gap-2">
              <stat.icon size={10} className={stat.color} />
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums">{stat.value}</span>
              <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Study Timer Card */}
        <Card className="md:col-span-4 p-8 rounded border border-border shadow-none bg-card flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Clock size={18} />
              <h3 className="text-xs font-black uppercase tracking-widest">Focus Session</h3>
            </div>
            
            <div className="py-8 text-center">
              <span className="text-6xl font-black font-mono tracking-tighter tabular-nums">
                {formatTime(timerSeconds)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsTimerActive(!isTimerActive)}
                className="flex-1 font-bold rounded h-12 uppercase text-xs"
              >
                {isTimerActive ? <Pause size={16} /> : <Play size={16} />}
                <span className="ml-2">{isTimerActive ? 'Pause' : 'Start'}</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => { setTimerSeconds(0); setIsTimerActive(false); }}
                className="w-12 h-12 p-0 rounded"
              >
                <RotateCcw size={16} />
              </Button>
            </div>
            {timerSeconds > 0 && (
              <Button 
                onClick={handleFinishSession}
                variant="secondary"
                className="w-full font-bold h-10 rounded uppercase text-[10px] tracking-widest"
              >
                End & Log Session
              </Button>
            )}
          </div>
        </Card>

        {/* Focus Chart Card */}
        <Card className="md:col-span-8 p-8 rounded border border-border shadow-none bg-card">
          <div className="flex items-center justify-between mb-10">
             <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest">Momentum Graph</h3>
              <p className="text-[10px] opacity-40 font-bold uppercase">Daily Engagement Consistency</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black opacity-60 uppercase">Active</span>
              </div>
            </div>
          </div>
          
          <div className="h-56 w-full flex items-end gap-3 px-2">
            {[65, 80, 45, 90, 75, 60, 85].map((h, i) => (
              <div key={i} className="flex-1 space-y-3 group cursor-pointer">
                <div className="relative h-full flex flex-col justify-end">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className={cn(
                      "w-full bg-muted rounded transition-all group-hover:bg-primary/20",
                      i === 6 && "bg-primary/10 border border-primary/20"
                    )} 
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-black bg-foreground text-background px-1.5 py-0.5 rounded italic">
                        {h}%
                      </span>
                    </div>
                  </motion.div>
                </div>
                <p className={cn(
                  "text-[9px] font-black text-center opacity-20 group-hover:opacity-100 transition-opacity uppercase tracking-tighter",
                  i === 6 && "text-primary opacity-100 font-black"
                )}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="border-t border-border pt-12 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-40">Intelligence Stream</h3>
          <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100">
            View Analytics Archive
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { action: 'Daily Vocabulary', time: 'Completed', detail: '+50 XP', category: 'Lexical' },
            { action: 'Mock Assessment', time: 'Yesterday', detail: '+500 XP', category: 'Strategic' },
            { action: 'Study Session', time: 'Log Saved', detail: '+100 XP', category: 'Engagement' },
          ].map((activity, i) => (
            <motion.div 
              key={i} 
              whileHover={{ x: 5 }}
              className="flex items-center gap-4 p-4 rounded border border-border bg-card hover:border-primary/30 transition-all border-l-4 border-l-primary"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[11px] font-black uppercase tracking-tight">{activity.action}</p>
                  <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">{activity.detail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] opacity-40 font-bold uppercase">{activity.category}</p>
                  <p className="text-[9px] opacity-30 font-bold italic">{activity.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

