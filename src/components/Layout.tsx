import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart3, MessageSquare, Navigation, BookMarked, FileStack, ChevronLeft, Menu, Sun, Moon, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/src/store/useStore';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Syllabus', path: '/curriculum' },
  { icon: BookMarked, label: 'Vocabulary', path: '/vocabulary' },
  { icon: BarChart3, label: 'Progress', path: '/analytics' },
  { icon: FileStack, label: 'Exam Record', path: '/exam-record' },
  { icon: MessageSquare, label: 'Tutor AI', path: '/chat' },
  { icon: Navigation, label: 'Mock Tests', path: '/career' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { progress, setTheme } = useStore();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Initial theme application
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(progress.theme);
    root.setAttribute('data-theme', progress.theme);
  }, [progress.theme]);

  const formattedExamDate = progress?.examDate 
    ? new Date(progress.examDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : 'Not Set';

  const levelProgress = (progress.xp % (progress.level * 1000)) / (progress.level * 10) || 0;

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 hidden h-full border-r border-border bg-card lg:block z-50 transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-0 -translate-x-full overflow-hidden"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-5 flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter uppercase leading-none italic text-primary">grindlts</span>
              <span className="text-[8px] font-bold opacity-40 uppercase tracking-tight mt-0.5">Your own ielts prep studio</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setTheme(progress.theme === 'light' ? 'dark' : 'light')}
                className="opacity-40 hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-muted"
              >
                {progress.theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-muted">
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>

          <div className="px-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center">
                  {progress.level}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Level Progress</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-orange-500">
                <Flame size={12} className="fill-orange-500" />
                {progress.streak}
              </div>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  className="h-full bg-primary"
               />
            </div>
          </div>

          <nav className="flex-1 space-y-0.5 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'group flex items-center gap-3 rounded px-4 py-2 text-xs transition-all duration-200',
                    isActive
                      ? 'bg-foreground text-background font-bold shadow-lg shadow-foreground/5'
                      : 'text-foreground/40 hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon size={14} className={cn("shrink-0", isActive ? "opacity-100" : "opacity-40")} />
                  <span className="uppercase tracking-widest font-black">{item.label}</span>
                  {isActive && <motion.div layoutId="nav-active" className="ml-auto h-1 w-1 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-[11px]">
               <div className="flex justify-between items-center mb-3">
                  <p className="font-black opacity-30 uppercase tracking-widest">Mastery Goal</p>
                  <p className="font-black text-primary uppercase">{formattedExamDate}</p>
               </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress?.currentWeek / 4) * 100}%` }}
                  className="h-full bg-foreground"
                />
              </div>
              <p className="mt-2 text-[9px] font-bold opacity-30 text-center uppercase tracking-widest">
                Curriculum: Week {progress.currentWeek} / 4
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 min-h-screen w-full transition-all duration-300 ease-in-out",
          isOpen ? "pl-64" : "pl-0"
        )}
      >
        {!isOpen && (
          <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
            <button 
              onClick={() => setIsOpen(true)}
              className="p-1.5 rounded bg-card border border-border shadow-sm hover:bg-muted transition-colors opacity-60 hover:opacity-100"
            >
              <Menu size={18} />
            </button>
            <button 
              onClick={() => setTheme(progress.theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded bg-card border border-border shadow-sm hover:bg-muted transition-colors opacity-60 hover:opacity-100"
            >
              {progress.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        )}
        <div className="mx-auto max-w-5xl p-8 lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


