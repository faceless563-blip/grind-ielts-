import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/src/store/useStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MONTHS = [
  { name: 'May', days: 31, year: 2026, monthIdx: 4, presets: 10 },
  { name: 'June', days: 30, year: 2026, monthIdx: 5, presets: 15 },
  { name: 'July', days: 31, year: 2026, monthIdx: 6, presets: 20 },
  { name: 'August', days: 31, year: 2026, monthIdx: 7, presets: 20 },
];

export default function Vocabulary() {
  const { progress, saveVocabEntry, updateVocabHighlight } = useStore();
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState(0);

  const currentMonthData = MONTHS[selectedMonth];
  const vocabData = progress.vocabData || {};

  const getDayKey = (day: number | null) => {
    if (day === null) return '';
    const monthStr = (currentMonthData.monthIdx + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${currentMonthData.year}-${monthStr}-${dayStr}`;
  };

  const getDayProgress = (day: number) => {
    const key = getDayKey(day);
    const dayEntries = vocabData[key] || [];
    const filledCount = dayEntries.filter(e => e && e.word && e.word.trim() !== '').length;
    return (filledCount / currentMonthData.presets) * 100;
  };

  const dayKey = getDayKey(selectedDay);
  const currentDayEntries = vocabData[dayKey] || [];

  if (selectedDay !== null) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedDay(null)}
              className="p-1 hover:bg-muted rounded transition-colors opacity-40 hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold tracking-tight">{currentMonthData.name} {selectedDay}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase opacity-40 tabular-nums">
              {activeSlot + 1} of {currentMonthData.presets}
            </span>
            <Button size="sm" variant="outline" onClick={() => setSelectedDay(null)} className="h-8 text-xs px-4">Done</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="border border-border rounded-md bg-muted/50 overflow-hidden">
               <div className="p-2 border-b border-border bg-sidebar">
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Slots</p>
              </div>
              <div className="divide-y divide-border h-[500px] overflow-y-auto">
                {Array.from({ length: currentMonthData.presets }).map((_, idx) => {
                  const entry = currentDayEntries[idx];
                  const color = entry?.highlight;
                  return (
                    <button
                      key={`slot-${idx}`}
                      onClick={() => setActiveSlot(idx)}
                      className={cn(
                        "w-full p-2.5 text-left transition-colors flex items-center gap-3 text-sm",
                        activeSlot === idx 
                          ? "bg-card font-semibold" 
                          : "hover:bg-sidebar opacity-60"
                      )}
                    >
                      <span className="text-[10px] opacity-30 w-3">{idx + 1}</span>
                      <span className="truncate flex-1">
                        {entry?.word || '---'}
                      </span>
                      {color && (
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          color === 'green' ? "bg-emerald-500" : color === 'red' ? "bg-rose-500" : "bg-[#2383e2]"
                        )} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <VocabFocusForm 
              date={dayKey}
              index={activeSlot}
              maxPresets={currentMonthData.presets}
              data={currentDayEntries[activeSlot]}
              onSave={saveVocabEntry}
              onUpdateHighlight={updateVocabHighlight}
              onNext={() => activeSlot < currentMonthData.presets - 1 && setActiveSlot(activeSlot + 1)}
              onPrev={() => activeSlot > 0 && setActiveSlot(activeSlot - 1)}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <Badge variant="outline" className="px-2 py-0 h-5 border-border text-[9px] uppercase font-bold tracking-widest text-muted-foreground bg-muted/50 rounded-sm">
            Lexical Resource
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Vocabulary Studio</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            A structured daily repository for high-level academic terms.
          </p>
        </div>

        <div className="flex border border-border rounded-sm overflow-hidden h-8 bg-sidebar">
          {MONTHS.map((m, idx) => (
            <button
              key={m.name}
              onClick={() => setSelectedMonth(idx)}
              className={cn(
                "px-4 text-[11px] font-semibold transition-colors border-r border-border last:border-0",
                selectedMonth === idx ? "bg-card text-foreground" : "text-foreground/40 hover:bg-card/50"
              )}
            >
              Month {idx + 1}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 border-t border-l border-border">
        {Array.from({ length: currentMonthData.days }).map((_, i) => {
          const day = i + 1;
          const progressVal = getDayProgress(day);
          const isFull = progressVal === 100;

          return (
            <button
              key={`${currentMonthData.name}-${day}`}
              onClick={() => {
                setSelectedDay(day);
                setActiveSlot(0);
              }}
              className={cn(
                "aspect-square flex items-center justify-center transition-colors border-r border-b border-border relative group",
                isFull 
                  ? "bg-emerald-500/[0.03]" 
                  : "bg-card hover:bg-muted"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                isFull ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
              )}>{day}</span>
              {progressVal > 0 && !isFull && (
                <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-muted rounded-full">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${progressVal}%` }} 
                  />
                </div>
              )}
              {isFull && <div className="absolute bottom-1 right-1 h-1 w-1 bg-emerald-500 rounded-full" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VocabFocusForm({ date, index, maxPresets, data, onSave, onUpdateHighlight, onNext, onPrev }: any) {
  const [form, setForm] = useState(data || {
    word: '',
    type: '',
    meaning: '',
    collocations: '',
    sentence: '',
    spellingTrap: '',
    highlight: null
  });

  React.useEffect(() => {
    setForm(data || {
      word: '',
      type: '',
      meaning: '',
      collocations: '',
      sentence: '',
      spellingTrap: '',
      highlight: null
    });
  }, [data, index]);

  const handleSave = async () => {
    await onSave(date, index, form);
    toast.success(`Word Committed`, { icon: <CheckCircle2 className="h-4 w-4" /> });
  };

  const currentHighlight = data?.highlight || null;

  return (
    <div className="space-y-8 bg-card border border-border rounded-md p-8">
      <div className="flex justify-between items-start border-b border-border pb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Entry {index + 1}</p>
          <h2 className="text-3xl font-bold tracking-tight">
            {form.word || <span className="opacity-20 italic">Empty Slot</span>}
          </h2>
        </div>
        
        <div className="flex gap-1.5">
          {(['green', 'red', 'blue'] as const).map((color) => (
            <button
              key={color}
              onClick={() => onUpdateHighlight(date, index, currentHighlight === color ? null : color)}
              className={cn(
                "h-5 w-5 rounded-full border transition-all",
                color === 'green' ? "bg-emerald-500 border-emerald-600" :
                color === 'red' ? "bg-rose-500 border-rose-600" :
                "bg-[#2383e2] border-[#1a6db0]",
                currentHighlight === color ? "scale-125 shadow-sm ring-2 ring-offset-2 ring-border" : "opacity-20"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold opacity-50">Word / Term</Label>
            <Input 
              value={form.word} 
              onChange={e => setForm({...form, word: e.target.value})} 
              placeholder="e.g. Obfuscate"
              className="h-9 border-border bg-background rounded-sm text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold opacity-50">Grammatical Category</Label>
            <Select value={form.type} onValueChange={v => setForm({...form, type: v as any})}>
              <SelectTrigger className="h-9 border-border bg-background rounded-sm text-sm">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noun">Noun</SelectItem>
                <SelectItem value="verb">Verb</SelectItem>
                <SelectItem value="adjective">Adjective</SelectItem>
                <SelectItem value="adverb">Adverb</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold opacity-50">Simple Definition</Label>
            <Textarea 
              value={form.meaning} 
              onChange={e => setForm({...form, meaning: e.target.value})} 
              placeholder="Definition in plain English..."
              className="border-border bg-background rounded-sm text-sm min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold opacity-50">Common Collocations</Label>
            <Input 
              value={form.collocations} 
              onChange={e => setForm({...form, collocations: e.target.value})} 
              placeholder="e.g. persistent efforts, mitigate risks"
              className="h-9 border-border bg-background rounded-sm text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold opacity-50">Contextual Example</Label>
            <Textarea 
              value={form.sentence} 
              onChange={e => setForm({...form, sentence: e.target.value})} 
              placeholder="A high-level academic sentence..."
              className="border-border bg-background rounded-sm text-sm min-h-[100px] resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold text-rose-500/70">Spelling Challenge</Label>
            <Input 
              value={form.spellingTrap} 
              onChange={e => setForm({...form, spellingTrap: e.target.value})} 
              placeholder="Spelling traps to watch for..."
              className="h-9 bg-rose-500/[0.02] border-rose-500/10 text-rose-600 rounded-sm text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-border">
        <Button 
          variant="outline" 
          onClick={onPrev} 
          disabled={index === 0}
          className="flex-1 h-9 rounded-sm text-xs font-semibold"
        >
          Previous
        </Button>
        <Button 
          onClick={handleSave} 
          className="flex-[2] h-9 rounded-sm text-xs font-bold bg-[#2383e2] hover:bg-[#1a6db0]"
        >
          <Save size={14} className="mr-2" />
          Update Slot
        </Button>
        <Button 
          variant="outline" 
          onClick={onNext} 
          disabled={index === maxPresets - 1}
          className="flex-1 h-9 rounded-sm text-xs font-semibold"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

