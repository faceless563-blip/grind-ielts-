import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileStack, 
  Plus, 
  TrendingUp, 
  Award, 
  Calendar, 
  ChevronRight, 
  Keyboard, 
  SpellCheck, 
  BrainCircuit,
  Settings2,
  Trash2,
  ExternalLink,
  History,
  Target,
  Quote,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/src/store/useStore';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { analyzeIELTSWriting } from '@/src/services/geminiService';
import { toast } from 'sonner';

export default function ExamRecord() {
  const { progress, addExamRecord, updateTargetBand, deleteExamRecord } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  
  const currentTarget = progress.targetBand || 7.5;
  const [tempTarget, setTempTarget] = useState(currentTarget);

  // Sync temp target when store updates
  React.useEffect(() => {
    setTempTarget(progress.targetBand || 7.5);
  }, [progress.targetBand]);

  // Form State
  const [newRecord, setNewRecord] = useState({
    type: 'listening_mock' as const,
    date: new Date().toISOString().split('T')[0],
    scores: {
      listening: 6.0,
      reading: 1.0,
      writing: 1.0,
      speaking: 1.0,
    },
    writingTask1: '',
    writingTask2: '',
    reflection: '',
    errorTags: [] as string[]
  });

  const availableTags = [
    { id: 'time-management', label: 'Time Management', icon: History },
    { id: 'vocabulary', label: 'Lexical Resource', icon: SpellCheck },
    { id: 'grammar', label: 'Grammatical Range', icon: BrainCircuit },
    { id: 'task-response', label: 'Task Response', icon: Target },
    { id: 'cohesion', label: 'Cohesion & Coherence', icon: ExternalLink },
    { id: 'spelling', label: 'Spelling/Typos', icon: AlertCircle },
  ];

  const records = useStore(state => state.progress.examRecords || []).filter(r => r.type !== 'mock');

  const stats = useMemo(() => {
    if (records.length === 0) return { avg: 0, count: 0, latest: 0 };
    const avg = records.reduce((acc, r) => acc + r.overallBand, 0) / records.length;
    return {
      avg: Math.round(avg * 10) / 10,
      count: records.length,
      latest: records[0].overallBand
    };
  }, [records]);

  const chartData = useMemo(() => {
    return [...records].reverse().map(r => ({
      date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      band: r.overallBand,
      L: r.scores.listening,
      R: r.scores.reading,
      W: r.scores.writing,
      S: r.scores.speaking,
    }));
  }, [records]);

  const handleCreateRecord = async () => {
    setIsAnalyzing(true);
    try {
      let aiAnalysis = null;
      if (newRecord.writingTask1 || newRecord.writingTask2) {
        aiAnalysis = await analyzeIELTSWriting(newRecord.writingTask1, newRecord.writingTask2);
      }

      const overall = (
        newRecord.scores.listening + 
        newRecord.scores.reading + 
        newRecord.scores.writing + 
        newRecord.scores.speaking
      ) / 4;

      const roundedOverall = Math.round(overall * 2) / 2;

      await addExamRecord({
        type: newRecord.type,
        date: newRecord.date,
        overallBand: roundedOverall,
        scores: newRecord.scores,
        details: {
          writingTask1: newRecord.writingTask1,
          writingTask2: newRecord.writingTask2,
          writingTask1WordCount: newRecord.writingTask1.split(/\s+/).filter(x => x).length,
          writingTask2WordCount: newRecord.writingTask2.split(/\s+/).filter(x => x).length,
          aiFeedback: aiAnalysis ? aiAnalysis.feedbackTask1 + '\n\n' + aiAnalysis.feedbackTask2 : '',
          reflection: newRecord.reflection,
          errorTags: newRecord.errorTags
        }
      });

      toast.success('Performance logged. View insights in record details.');
      setIsAddOpen(false);
      setNewRecord({
        type: 'listening_mock',
        date: new Date().toISOString().split('T')[0],
        scores: { listening: 6.0, reading: 1.0, writing: 1.0, speaking: 1.0 },
        writingTask1: '',
        writingTask2: '',
        reflection: '',
        errorTags: []
      });
    } catch (error) {
      toast.error('Failed to log test results');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('Permanently delete this exam record? This action cannot be undone.')) return;
    try {
      await deleteExamRecord(id);
      setSelectedRecord(null);
      toast.success('Record deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary p-1 px-4 rounded-full font-bold tracking-widest uppercase text-[10px]">
              Performance Tracking
            </Badge>
            <h1 className="text-5xl font-bold text-foreground tracking-tight">Band Records</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Focus on specific skills. Log individual mocks for Listening, Reading, Writing, or Speaking.
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-lg font-bold" />}>
              <Plus size={24} />
              Add New Record
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-card border-border/50">
            <DialogHeader className="p-8 pb-4">
              <DialogTitle className="text-3xl font-display font-bold">Log New Exam Attempt</DialogTitle>
              <DialogDescription>Enter your scores and optionally your CBT writing tasks for AI analysis.</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="scores" className="flex-1 overflow-hidden flex flex-col">
              <div className="px-8 flex justify-center">
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted p-1">
                  <TabsTrigger value="scores" className="rounded-lg font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all text-xs">
                    1. Scores
                  </TabsTrigger>
                  <TabsTrigger value="writing" className="rounded-lg font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all text-xs">
                    2. Writing
                  </TabsTrigger>
                  <TabsTrigger value="reflection" className="rounded-lg font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all text-xs">
                    3. Reflection
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-8 pt-6">
                <TabsContent value="scores" className="mt-0 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Test Nature</Label>
                      <Select 
                        onValueChange={(val: any) => setNewRecord({...newRecord, type: val})}
                        defaultValue={newRecord.type}
                      >
                        <SelectTrigger className="h-12 rounded bg-muted border-none shadow-none font-medium">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          <SelectItem value="listening_mock">Listening Mock</SelectItem>
                          <SelectItem value="reading_mock">Reading Mock</SelectItem>
                          <SelectItem value="writing_mock">Writing Mock</SelectItem>
                          <SelectItem value="speaking_mock">Speaking Mock</SelectItem>
                          <SelectItem value="baseline">Initial Baseline</SelectItem>
                          <SelectItem value="official">Official IELTS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Date Conducted</Label>
                      <Input 
                        type="date"
                        className="h-12 rounded bg-muted border-none shadow-none font-medium"
                        value={newRecord.date}
                        onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {(['listening', 'reading', 'writing', 'speaking'] as const).map((skill) => (
                      <div key={skill} className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 text-center block mb-2">{skill}</Label>
                        <div className="flex items-center gap-2">
                           <Input 
                            type="number"
                            step="0.5"
                            min="0"
                            max="9"
                            className="h-12 text-center text-xl font-black rounded border-border bg-card shadow-sm"
                            value={newRecord.scores[skill]}
                            onChange={e => setNewRecord({
                              ...newRecord, 
                              scores: {...newRecord.scores, [skill]: parseFloat(e.target.value) || 0}
                            })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="writing" className="mt-0 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center group">
                      <Label className="text-xs font-bold opacity-60">Task 1: Report / Graph Description</Label>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-[10px] bg-muted/50 border-border/50">
                          {newRecord.writingTask1.split(/\s+/).filter(x => x).length} Words
                        </Badge>
                      </div>
                    </div>
                    <Textarea 
                      placeholder="Paste your Task 1 response... (20 mins suggested)"
                      className="min-h-[220px] rounded border-border bg-background shadow-inner font-mono text-xs leading-relaxed p-6 focus-visible:ring-primary/20"
                      value={newRecord.writingTask1}
                      onChange={e => setNewRecord({...newRecord, writingTask1: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-bold opacity-60">Task 2: Academic Essay</Label>
                      <Badge variant="outline" className="font-mono text-[10px] bg-muted/50 border-border/50">
                        {newRecord.writingTask2.split(/\s+/).filter(x => x).length} Words
                      </Badge>
                    </div>
                    <Textarea 
                      placeholder="Paste your Task 2 response... (40 mins suggested)"
                      className="min-h-[400px] rounded border-border bg-background shadow-inner font-mono text-xs leading-relaxed p-6 focus-visible:ring-primary/20"
                      value={newRecord.writingTask2}
                      onChange={e => setNewRecord({...newRecord, writingTask2: e.target.value})}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="reflection" className="mt-0 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Observation & Strategy Reflection</Label>
                      <Textarea 
                        placeholder="What went wrong? What felt surprisingly easy? Document your mental state during the test."
                        className="min-h-[150px] rounded border-border bg-background shadow-inner text-sm p-6"
                        value={newRecord.reflection}
                        onChange={e => setNewRecord({...newRecord, reflection: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Primary Struggle Points (Select all that apply)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableTags.map((tag) => {
                          const Icon = tag.icon;
                          const isSelected = newRecord.errorTags.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              onClick={() => {
                                const tags = isSelected 
                                  ? newRecord.errorTags.filter(t => t !== tag.id)
                                  : [...newRecord.errorTags, tag.id];
                                setNewRecord({...newRecord, errorTags: tags});
                              }}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded border text-left transition-all",
                                isSelected 
                                  ? "bg-primary/5 border-primary text-primary" 
                                  : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50"
                              )}
                            >
                              <Icon size={14} className={isSelected ? "text-primary" : "opacity-30"} />
                              <span className="text-[11px] font-bold uppercase tracking-tight">{tag.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="p-8 pt-4 bg-muted/10 border-t border-border/40">
              <Button 
                variant="outline" 
                onClick={() => setIsAddOpen(false)}
                className="h-12 px-6 rounded-xl font-bold"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRecord}
                disabled={isAnalyzing}
                className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
              >
                {isAnalyzing ? (
                  <>
                    <BrainCircuit className="mr-2 animate-pulse" size={20} />
                    Analyzing CBT Patterns...
                  </>
                ) : (
                  'Save Record & Get AI Feedback'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="rounded-[2.5rem] p-4 bg-card/40 border-border/40 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
          <CardContent className="p-8 space-y-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Award size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-bold font-display tracking-tight text-foreground">{stats.avg}</h3>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Average Band Score</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold items-center">
                <span className="text-muted-foreground">Target: {currentTarget}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-[8px] uppercase tracking-wider font-bold"
                  onClick={() => {
                    setTempTarget(currentTarget);
                    setIsTargetOpen(true);
                  }}
                >
                  Set Target
                </Button>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-primary">Progress</span>
                  <span className="text-primary">{Math.round((stats.avg / currentTarget) * 100)}%</span>
                </div>
                <Progress value={(stats.avg / currentTarget) * 100} className="h-1.5 bg-primary/20 transition-all duration-1000" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] p-4 bg-card/40 border-border/40 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
          <CardContent className="p-8 space-y-6">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-bold font-display tracking-tight text-foreground">{stats.count}</h3>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Total Skill Tests Logged</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 w-fit px-3 py-1 rounded-full">
              <TrendingUp size={14} />
              <span className="text-xs font-bold">+2 from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] p-4 bg-card/40 border-border/40 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
          <CardContent className="p-8 space-y-6">
            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <History size={32} />
            </div>
            <div>
              <h3 className="text-4xl font-bold font-display tracking-tight text-foreground">{stats.latest || '-'}</h3>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Most Recent Result</p>
            </div>
            <div className="flex items-center gap-2 text-blue-500 bg-blue-500/10 w-fit px-3 py-1 rounded-full">
              <Calendar size={14} />
              <span className="text-xs font-bold">Attempted 2 days ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trajectory & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-md overflow-hidden">
            <CardHeader className="p-8 pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold font-display">Band Score Trajectory</CardTitle>
                  <CardDescription className="text-lg">Visualization of your improvement sub-scores.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-primary hover:bg-primary shadow-lg shadow-primary/20 p-2 h-2 w-2 rounded-full" />
                  <span className="text-xs font-bold text-muted-foreground">Overall</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] p-8 pt-4">
              {records.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'currentColor', opacity: 0.4, fontSize: 10, fontWeight: 700}} 
                        dy={10}
                      />
                      <YAxis 
                        domain={[0, 9]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: 'currentColor', opacity: 0.4, fontSize: 10, fontWeight: 700}} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--popover)', 
                          borderRadius: '12px', 
                          border: '1px solid var(--border)',
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                        labelStyle={{ fontWeight: 800, marginBottom: '8px', color: 'var(--foreground)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="band" 
                        stroke="var(--primary)" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: "var(--background)", stroke: "var(--primary)", strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "var(--primary)" }}
                        animationDuration={1500}
                      />
                    </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground font-medium italic">
                  Not enough data to generate trajectory yet. Log your first test!
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-display px-2">Historical Records</h3>
            {records.length > 0 ? (
              <div className="space-y-4">
                {records.map((record, i) => (
                  <motion.div
                    key={record.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card 
                      className="rounded-3xl border-border/40 bg-card/40 hover:bg-card/60 transition-all cursor-pointer group p-0 overflow-hidden"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex flex-col md:flex-row items-stretch">
                        <div className="p-6 md:w-32 bg-primary/5 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border/40">
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Band</span>
                          <span className="text-4xl font-black font-display text-primary">{record.overallBand}</span>
                        </div>
                        <div className="flex-1 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="space-y-2 text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                              <Badge variant="secondary" className="rounded-full px-4 font-bold text-[10px] uppercase">
                                {record.type}
                              </Badge>
                              <span className="text-sm font-bold text-muted-foreground">
                                {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex gap-6 justify-center md:justify-start">
                              {(['L', 'R', 'W', 'S'] as const).map((s, idx) => (
                                <div key={s} className="flex flex-col items-center md:items-start">
                                  <span className="text-[10px] font-black text-muted-foreground mb-1">{s}</span>
                                  <span className="text-lg font-bold">{Object.values(record.scores)[idx]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-primary hover:text-primary-foreground transition-all">
                            <ChevronRight size={20} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border flex flex-col items-center gap-4">
                <FileStack className="text-muted-foreground/30" size={64} />
                <p className="text-muted-foreground font-bold">Your performance archive is currently empty.</p>
                <Button onClick={() => setIsAddOpen(true)} className="rounded-xl font-bold bg-primary px-8">Take First Mock Test</Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <Card className="rounded-[2rem] bg-foreground text-background overflow-hidden relative group border-none">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
            <CardHeader className="p-8 relative">
              <CardTitle className="text-xl font-bold font-display flex items-center gap-3 text-background">
                <BrainCircuit className="text-primary" size={24} />
                AI Learning Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6 relative text-background">
              <div className="space-y-4">
                <p className="text-sm opacity-60 font-medium leading-relaxed">
                  Based on your last 3 attempts, your performance pattern suggests:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-background/5 border border-background/10">
                    <SpellCheck className="text-rose-400 mt-1 shrink-0" size={18} />
                    <p className="text-xs leading-normal">
                      <span className="font-bold block mb-1">CBT Typing Weakness</span>
                      Recurring misspellings: "accommodation", "separate", "government". Focus on these.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-background/5 border border-background/10">
                    <Keyboard className="text-amber-400 mt-1 shrink-0" size={18} />
                    <p className="text-xs leading-normal">
                      <span className="font-bold block mb-1">Typing Speed Impact</span>
                      Fluency in Task 2 drops when word count exceeds 350. Practice high-speed outlining.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full h-12 rounded-xl bg-transparent border-background/20 hover:bg-background/10 transition-all font-bold text-background">
                View Detailed Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] bg-card border-border/40 shadow-xl overflow-hidden group">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-bold font-display flex items-center gap-3">
                <Target className="text-primary" size={24} />
                Official Readiness
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confidence Level</p>
                  <p className="text-2xl font-bold text-foreground">74%</p>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-primary border-r-transparent animate-spin-slow" />
              </div>
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/40 space-y-4">
                <p className="text-xs text-muted-foreground font-medium italic">
                  "You are consistently hitting Band 7.5 in Reading. Target Speaking fluency to match."
                </p>
                <Button className="w-full h-12 rounded-xl bg-foreground text-background font-bold hover:scale-[1.02] active:scale-95 transition-all">
                  Book Virtual Mock Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Record Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0 border-none bg-background shadow-2xl">
          {selectedRecord && (
            <div className="flex flex-col h-full overflow-hidden">
               <div className="p-8 bg-card border-b border-border flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-primary text-white flex items-center justify-center text-2xl font-black">
                      {selectedRecord.overallBand}
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center gap-2">
                        {selectedRecord.type === 'official' ? 'Official IELTS Certificate' : 'Mock Assessment Pipeline'}
                        <Badge variant="outline" className="text-[9px] uppercase font-black bg-primary/5 text-primary border-primary/20">
                          Verified
                        </Badge>
                      </h3>
                      <p className="text-xs opacity-40 font-bold uppercase tracking-widest">
                        Logged on {new Date(selectedRecord.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="h-8 text-rose-500 hover:bg-rose-50 rounded" onClick={() => handleDeleteRecord(selectedRecord.id)}>
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded hover:bg-muted" onClick={() => setSelectedRecord(null)}>
                      <Plus size={18} className="rotate-45" />
                    </Button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-8 p-10 border-r border-border space-y-12 bg-background">
                    {/* Writing Detail Section */}
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <div className="flex items-center gap-2 text-primary">
                            <Quote size={18} />
                            <h4 className="text-sm font-black uppercase tracking-widest">Candidate Observation</h4>
                          </div>
                          <p className="text-sm leading-relaxed p-6 rounded bg-card border border-border shadow-sm italic opacity-70">
                            {selectedRecord.details?.reflection || "Direct data entry. No performance notes captured during this attempt."}
                          </p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                <span>Task 1 Script</span>
                                <span>{selectedRecord.details?.writingTask1WordCount || '-'} Words</span>
                             </div>
                             <div className="p-6 rounded bg-card border border-border text-xs leading-relaxed font-mono opacity-80 whitespace-pre-wrap max-h-[250px] overflow-y-auto">
                                {selectedRecord.details?.writingTask1 || "No Task 1 content."}
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                <span>Task 2 Script</span>
                                <span>{selectedRecord.details?.writingTask2WordCount || '-'} Words</span>
                             </div>
                             <div className="p-6 rounded bg-card border border-border text-xs leading-relaxed font-mono opacity-80 whitespace-pre-wrap max-h-[250px] overflow-y-auto">
                                {selectedRecord.details?.writingTask2 || "No Task 2 content."}
                             </div>
                          </div>
                       </div>

                       {selectedRecord.details?.aiFeedback && (
                         <div className="p-8 rounded-lg bg-primary/5 border border-primary/10 space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                              <BrainCircuit size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Machine Insight Engine</h4>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground text-xs leading-loose">
                              {selectedRecord.details.aiFeedback}
                            </div>
                         </div>
                       )}
                    </div>
                  </div>

                  <aside className="lg:col-span-4 p-10 bg-muted/20 space-y-10">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Skill Equilibrium</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                               { subject: 'Listening', A: selectedRecord.scores.listening, fullMark: 9 },
                               { subject: 'Reading', A: selectedRecord.scores.reading, fullMark: 9 },
                               { subject: 'Writing', A: selectedRecord.scores.writing, fullMark: 9 },
                               { subject: 'Speaking', A: selectedRecord.scores.speaking, fullMark: 9 }
                             ]}>
                               <PolarGrid stroke="currentColor" opacity={0.1} />
                               <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 700, fill: 'currentColor'}} />
                               <Radar name="Student" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                             </RadarChart>
                          </ResponsiveContainer>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Target Alignment</h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 rounded bg-card border border-border">
                              <p className="text-[8px] font-black uppercase opacity-40">Variance</p>
                              <p className={cn(
                                "text-lg font-black",
                                selectedRecord.overallBand >= currentTarget ? "text-emerald-500" : "text-rose-500"
                              )}>
                                {selectedRecord.overallBand >= currentTarget ? '+' : ''}{(selectedRecord.overallBand - currentTarget).toFixed(1)}
                              </p>
                           </div>
                           <div className="p-4 rounded bg-card border border-border">
                              <p className="text-[8px] font-black uppercase opacity-40">Confidence</p>
                              <p className="text-lg font-black">{selectedRecord.type === 'mock' ? 'Medium' : 'High'}</p>
                           </div>
                        </div>
                     </div>

                     {selectedRecord.details?.errorTags && selectedRecord.details.errorTags.length > 0 && (
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Struggle Taxonomy</h4>
                          <div className="flex flex-wrap gap-2">
                             {selectedRecord.details.errorTags.map((tagId: string) => {
                               const tag = availableTags.find(t => t.id === tagId);
                               return (
                                 <Badge key={tagId} variant="secondary" className="rounded px-3 py-1 bg-muted border-border font-bold text-[9px] uppercase tracking-tight">
                                   {tag?.label || tagId}
                                 </Badge>
                               );
                             })}
                          </div>
                       </div>
                     )}

                     <div className="pt-6">
                        <Button className="w-full h-10 rounded font-bold text-xs uppercase bg-foreground text-background">
                          Download Audit PDF
                        </Button>
                     </div>
                  </aside>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Target Setting Dialog */}
      <Dialog open={isTargetOpen} onOpenChange={setIsTargetOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-10 bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-display">Set Target Band</DialogTitle>
            <DialogDescription>Define your ultimate IELTS goal to adjust your progress tracking.</DialogDescription>
          </DialogHeader>
          <div className="py-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Target Overall Band</Label>
              <div className="flex items-center gap-6">
                <Input 
                  type="number" 
                  step="0.5" 
                  min="1" 
                  max="9" 
                  value={tempTarget}
                  onChange={(e) => setTempTarget(parseFloat(e.target.value) || 0)}
                  className="h-16 text-center text-3xl font-black rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary transition-all"
                />
                <div className="text-sm font-bold text-muted-foreground">
                  Typical requirements:
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-primary" /> Ivy League: 7.5 - 8.0</li>
                    <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-primary" /> Skilled Migration: 7.0+</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={async () => {
                await updateTargetBand(tempTarget);
                setIsTargetOpen(false);
                toast.success(`Target band updated to ${tempTarget}`);
              }} 
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
            >
              Save Target Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
