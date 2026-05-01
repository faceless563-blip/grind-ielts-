import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, BookOpen, Headphones, FileText, ChevronRight, PlayCircle, Plus, Trash2, Calendar, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useStore } from '@/src/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CareerTrack() {
  const { progress, addExamRecord, deleteExamRecord } = useStore();
  const records = (progress.examRecords || []).filter(r => r.type === 'mock');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    scores: {
      listening: 6.0,
      reading: 6.0,
      writing: 6.0,
      speaking: 6.0,
    }
  });

  const handleCreateMock = async () => {
    const overall = (
      newRecord.scores.listening + 
      newRecord.scores.reading + 
      newRecord.scores.writing + 
      newRecord.scores.speaking
    ) / 4;

    const roundedOverall = Math.round(overall * 2) / 2;

    try {
      await addExamRecord({
        type: 'mock',
        date: newRecord.date,
        overallBand: roundedOverall,
        scores: newRecord.scores,
      });
      toast.success('Mock test logged successfully');
      setIsAddOpen(false);
    } catch (e) {
      toast.error('Failed to save mock test');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight text-foreground uppercase">Mock Test Simulator</h1>
          <p className="text-muted-foreground font-medium">Take full-length tests in a realistic, timed environment.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="h-12 px-6 rounded font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center gap-2" />}>
              <Plus size={18} />
              Log Full Mock
          </DialogTrigger>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-widest">Log Full Mock Result</DialogTitle>
              <DialogDescription>Enter the results for your full practice test.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Test Date</Label>
                <Input 
                  type="date" 
                  value={newRecord.date} 
                  onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                  className="rounded border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(['listening', 'reading', 'writing', 'speaking'] as const).map(skill => (
                  <div key={skill} className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">{skill}</Label>
                    <Input 
                      type="number" 
                      step="0.5" 
                      min="0" 
                      max="9" 
                      value={newRecord.scores[skill]}
                      onChange={e => setNewRecord({
                        ...newRecord, 
                        scores: {...newRecord.scores, [skill]: parseFloat(e.target.value) || 0}
                      })}
                      className="rounded border-border font-bold text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateMock} className="w-full h-12 font-black uppercase tracking-widest">Save Result</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Test List */}
        <Card className="academic-card lg:col-span-2 border-border/40 bg-card/40">
          <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
            <CardTitle className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em]">
              <FileText size={18} className="text-primary" />
              Practice Test Archive
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {records.length > 0 ? (
                records.map((record, i) => (
                  <motion.div 
                    key={record.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 rounded border border-border/50 bg-card hover:border-primary/30 transition-all group"
                  >
                    <div className="h-16 w-16 shrink-0 rounded flex flex-col items-center justify-center bg-primary/5 border border-primary/10">
                      <span className="text-[10px] font-black uppercase opacity-40">Band</span>
                      <span className="text-2xl font-black text-primary">{record.overallBand}</span>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black uppercase tracking-tight">Full Mock Test</h3>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">{new Date(record.date).toLocaleDateString()}</Badge>
                      </div>
                      <div className="flex gap-4">
                        {Object.entries(record.scores).map(([skill, score]) => (
                          <div key={skill} className="flex flex-col">
                            <span className="text-[8px] font-black uppercase opacity-30">{skill[0]}</span>
                            <span className="text-xs font-bold tabular-nums">{score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => record.id && deleteExamRecord(record.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-muted/10 rounded border border-dashed border-border flex flex-col items-center gap-4">
                  <PlayCircle size={48} className="opacity-10" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-30">No mock tests logged yet</p>
                  <Button variant="outline" className="h-10 px-6 rounded font-black uppercase tracking-widest text-[10px]" onClick={() => setIsAddOpen(true)}>
                    Log Your First Result
                  </Button>
                </div>
              )}

              {/* Hardcoded Upcoming if needed, but keeping it clean */}
              <div className="pt-8 border-t border-border/50">
                 <div className="flex items-center gap-3 p-6 rounded border border-dashed border-border/50 bg-muted/5 opacity-50">
                    <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-muted">
                        <Clock size={16} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Upcoming Milestone</h4>
                        <p className="text-xs font-bold italic">Schedule your next simulator session for this Saturday.</p>
                    </div>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="rounded bg-foreground text-background border-none shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={120} />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-md font-black uppercase tracking-widest">
                <Clock size={18} className="text-primary" />
                Exam Mechanics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Total Duration</p>
                <p className="text-2xl font-black">2h 45m</p>
              </div>
              <div className="space-y-4 pt-6 border-t border-background/10">
                {[
                  { label: 'Listening', time: '30 min', qs: '40 Qs' },
                  { label: 'Reading', time: '60 min', qs: '40 Qs' },
                  { label: 'Writing', time: '60 min', qs: '2 Tasks' },
                  { label: 'Speaking', time: '11-14 min', qs: '3 Parts' },
                ].map((track) => (
                  <div key={track.label} className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest">{track.label}</span>
                    <div className="text-right">
                       <span className="text-primary text-xs font-black block">{track.time}</span>
                       <span className="text-background/40 text-[9px] font-bold">{track.qs}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded border-border/40 bg-card/60 p-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                <Award size={12} className="text-primary" />
                Readiness Index
            </h4>
            <div className="space-y-5">
                {[
                  { label: 'Time Management', status: 'Optimal', color: 'bg-emerald-500' },
                  { label: 'Endurance', status: 'Developing', color: 'bg-amber-500' },
                  { label: 'Strategic Approach', status: 'Stable', color: 'bg-blue-500' },
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                     <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="opacity-60">{item.label}</span>
                        <span className="uppercase tracking-tighter opacity-40">{item.status}</span>
                     </div>
                     <div className="h-1.5 w-full bg-muted rounded-full">
                        <div className={cn("h-full rounded-full w-2/3", item.color)} />
                     </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
