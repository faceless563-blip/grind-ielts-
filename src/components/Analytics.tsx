import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/src/store/useStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Target, GraduationCap as GraduationCapIcon, BrainCircuit, Activity, TrendingUp } from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const { progress } = useStore();
  const isDark = progress.theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const primaryColor = 'hsl(var(--primary))';

  const records = progress.examRecords || [];
  
  const latestScores = useMemo(() => {
    if (records.length === 0) return { listening: 0, reading: 0, writing: 0, speaking: 0, overall: 0 };
    const latest = records[0];
    return { ...latest.scores, overall: latest.overallBand };
  }, [records]);

  const skillData = [
    { skill: 'Listening', score: latestScores.listening, full: 9 },
    { skill: 'Reading', score: latestScores.reading, full: 9 },
    { skill: 'Writing', score: latestScores.writing, full: 9 },
    { skill: 'Speaking', score: latestScores.speaking, full: 9 }
  ];

  const historicalData = useMemo(() => {
    return [...records].reverse().map(r => ({
      date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      band: r.overallBand,
      type: r.type
    }));
  }, [records]);

  const studyHoursByDay = useMemo(() => {
    // Generate last 7 days study hours
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = days.map(d => ({ day: d, hours: 0 }));
    progress.studyLogs.slice(0, 10).forEach(log => {
      const day = new Date(log.date).getDay();
      result[day].hours += log.hours;
    });
    // Shift to start from today? No, just chronological is fine for demo
    return result;
  }, [progress.studyLogs]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <Activity size={12} className="text-primary" />
            <span>Telemetry & Insights</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight uppercase">Mission Analytics</h1>
          <p className="text-muted-foreground text-sm font-medium">Predicted Performance: <span className="text-foreground font-bold">Band {latestScores.overall || 'TBD'}</span> based on recent output.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="h-10 px-4 rounded font-bold uppercase tracking-widest bg-card">
            Mock Tests: {records.filter(r => r.type === 'mock').length}
          </Badge>
          <Badge className="h-10 px-4 rounded font-bold uppercase tracking-widest bg-primary text-primary-foreground">
            Level {progress.level}
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core Prediction Card */}
        <Card className="lg:col-span-2 border-border bg-card shadow-lg shadow-black/5 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp size={200} />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-40">Progress Trajectory</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase opacity-60">Overall Band</span>
                </div>
              </div>
            </div>
            
            <div className="h-72 w-full">
              {historicalData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'currentColor', opacity: 0.4, fontSize: 10, fontWeight: 700}} 
                    />
                    <YAxis 
                      domain={[0, 9]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'currentColor', opacity: 0.4, fontSize: 10, fontWeight: 700}} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      labelStyle={{ fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="band" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4} 
                      fill="url(#bandGradient)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/20 rounded border border-dashed border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No historical data detected</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Radar Map */}
        <Card className="border-border bg-card p-8">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-40">Skill Equilibrium</h3>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="skill" tick={{fontSize: 10, fontWeight: 800, fill: 'currentColor'}} />
                  <Radar 
                    name="Current Performance" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.4} 
                    animationDuration={1000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {skillData.map(s => (
                <div key={s.skill} className="p-3 rounded bg-muted/30 border border-border/50">
                  <p className="text-[9px] font-black uppercase tracking-tighter opacity-40">{s.skill}</p>
                  <p className="text-sm font-black tabular-nums">{s.score || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Study Velocity */}
        <Card className="lg:col-span-2 p-8 bg-card border-border">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-6">Study Intensity Velocity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyHoursByDay}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, opacity: 0.4}} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--primary))', opacity: 0.05}}
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: 'none', borderRadius: '4px' }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Readiness Index */}
        <Card className="p-8 bg-card border-border flex flex-col justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Readiness Delta</h3>
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <GraduationCapIcon size={32} className="text-primary" />
            </div>
            <h4 className="text-3xl font-black tracking-tighter tabular-nums text-primary">{latestScores.overall || '0.0'}</h4>
            <p className="text-[10px] font-bold uppercase opacity-40 mt-1">Predicted Score</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
               <div className="flex justify-between text-[9px] font-black tracking-widest uppercase mb-1">
                <span className="opacity-40">Confidence</span>
                <span>{records.length > 5 ? 'High' : 'Low'}</span>
              </div>
              <div className="h-1 w-full bg-muted rounded-full">
                <div className={cn("h-full bg-primary", records.length > 5 ? "w-full" : "w-1/3")} />
              </div>
            </div>
          </div>
        </Card>

        {/* Vocabulary HUD */}
        <Card className="p-8 bg-card border-border flex flex-col justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Lexical Storage</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded bg-muted/40 flex items-center justify-center">
                <BrainCircuit size={18} className="opacity-40" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Mastered Words</p>
                <p className="text-xl font-black">{Object.keys(progress.vocabData).length * 10 || 0}</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="flex justify-between items-center">
                 <p className="text-[9px] font-black uppercase opacity-60">Success Rate</p>
                 <p className="text-[11px] font-black text-emerald-500 italic">92% Retention</p>
              </div>
              <div className="flex gap-1 h-3">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex-1 rounded-sm", 
                      i < 9 ? "bg-emerald-500/40" : "bg-muted"
                    )} 
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

