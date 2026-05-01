import { create } from 'zustand';
import { WeekData, ieltsCurriculum } from '../data/ielts_curriculum';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';

interface ExamRecord {
  id?: string;
  type: 'mock' | 'official' | 'baseline' | 'listening_mock' | 'reading_mock' | 'writing_mock' | 'speaking_mock';
  date: string;
  overallBand: number;
  scores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  details?: {
    writingTask1?: string;
    writingTask2?: string;
    writingTask1WordCount?: number;
    writingTask2WordCount?: number;
    aiFeedback?: string;
    reflection?: string;
    errorTags?: string[];
    typingSpeed?: number;
  };
}

interface VocabEntry {
  word: string;
  type: 'noun' | 'verb' | 'adjective' | 'adverb' | '';
  meaning: string;
  collocations: string;
  sentence: string;
  spellingTrap: string;
  highlight?: 'green' | 'red' | 'blue' | null;
}

interface UserProgress {
  currentWeek: number;
  completedTasks: Record<string, number>;
  studyLogs: { id?: string; date: string; hours: number; notes: string }[];
  examRecords: ExamRecord[];
  practiceTestsTaken: number;
  essaysWritten: string[];
  badges: string[];
  examDate?: string;
  targetBand?: number;
  vocabData: Record<string, VocabEntry[]>;
  theme: 'light' | 'dark';
  xp: number;
  level: number;
  streak: number;
  lastStudyDate?: string;
}

interface AppState {
  progress: UserProgress;
  curriculum: WeekData[];
  isInitialized: boolean;
  initialize: (userId: string) => () => void;
  updateTaskProgress: (taskId: string, value: number) => Promise<void>;
  addStudyLog: (log: { date: string; hours: number; notes: string }) => Promise<void>;
  unlockNextWeek: () => Promise<void>;
  addExamRecord: (record: Omit<ExamRecord, 'id'>) => Promise<void>;
  deleteExamRecord: (recordId: string) => Promise<void>;
  updateTargetBand: (band: number) => Promise<void>;
  saveVocabEntry: (date: string, index: number, entry: VocabEntry) => Promise<void>;
  updateVocabHighlight: (date: string, index: number, color: 'green' | 'red' | 'blue' | null) => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
  addXP: (amount: number) => Promise<void>;
  isWeekUnlocked: (weekId: number) => boolean;
  getWeekProgress: (weekId: number) => number;
}

export const useStore = create<AppState>()((set, get) => ({
  progress: {
    currentWeek: 1,
    completedTasks: {},
    studyLogs: [],
    examRecords: [],
    practiceTestsTaken: 0,
    essaysWritten: [],
    badges: [],
    vocabData: {},
    theme: (localStorage.getItem('ielts-prep-theme') as 'light' | 'dark') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    xp: 0,
    level: 1,
    streak: 0,
  },
  curriculum: ieltsCurriculum,
  isInitialized: false,

  initialize: (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const logsRef = collection(db, 'users', userId, 'studyLogs');
    const logsQuery = query(logsRef, orderBy('date', 'desc'), limit(50));
    const recordsRef = collection(db, 'users', userId, 'examRecords');
    const recordsQuery = query(recordsRef, orderBy('date', 'desc'), limit(50));
    const vocabRef = collection(db, 'users', userId, 'vocabulary');

    const unsubUser = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        set((state) => ({
          progress: {
            ...state.progress,
            ...data,
            xp: data.xp || 0,
            level: data.level || 1,
            streak: data.streak || 0,
          },
          isInitialized: true
        }));
      } else {
        // Initialize new user
        const initialData = {
          currentWeek: 1,
          practiceTestsTaken: 0,
          essaysWritten: [],
          badges: [],
          xp: 0,
          level: 1,
          streak: 0,
          startDate: new Date().toISOString().split('T')[0],
          examDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          email: auth.currentUser?.email || ''
        };
        setDoc(userDocRef, initialData).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${userId}`));
        set({ isInitialized: true });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${userId}`));

    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      set((state) => ({
        progress: {
          ...state.progress,
          studyLogs: logs
        }
      }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${userId}/studyLogs`));

    const unsubRecords = onSnapshot(recordsQuery, (snapshot) => {
      const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      set((state) => ({
        progress: {
          ...state.progress,
          examRecords: records
        }
      }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${userId}/examRecords`));

    const unsubVocab = onSnapshot(vocabRef, (snapshot) => {
      const vocabData: Record<string, VocabEntry[]> = {};
      snapshot.docs.forEach(doc => {
        vocabData[doc.id] = doc.data().entries || [];
      });
      set((state) => ({
        progress: {
          ...state.progress,
          vocabData
        }
      }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${userId}/vocabulary`));

    return () => {
      unsubUser();
      unsubLogs();
      unsubRecords();
      unsubVocab();
    };
  },

  updateTaskProgress: async (taskId, value) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const newCompletedTasks = { ...get().progress.completedTasks, [taskId]: value };
    
    // Calculate practice test total
    const practiceTestsTaken = Object.entries(newCompletedTasks)
      .filter(([id]) => id.includes('-p') || id.includes('-l'))
      .reduce((sum, [, val]) => sum + val, 0);

    const userDocRef = doc(db, 'users', userId);
    try {
      await setDoc(userDocRef, { 
        completedTasks: newCompletedTasks,
        practiceTestsTaken 
      }, { merge: true });
      await get().addXP(25);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  },

  addStudyLog: async (log) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const today = new Date().toISOString().split('T')[0];
    const lastSession = get().progress.lastStudyDate;
    let newStreak = get().progress.streak;

    if (!lastSession) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastSession);
      const diff = Math.floor((new Date(today).getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diff === 1) {
        newStreak += 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
    }

    const logsRef = collection(db, 'users', userId, 'studyLogs');
    const userRef = doc(db, 'users', userId);
    try {
      await addDoc(logsRef, log);
      await setDoc(userRef, { 
        lastStudyDate: today,
        streak: newStreak
      }, { merge: true });
      await get().addXP(100);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${userId}/studyLogs`);
    }
  },

  unlockNextWeek: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const nextWeek = Math.min(get().progress.currentWeek + 1, 4);
    const userDocRef = doc(db, 'users', userId);
    try {
      await setDoc(userDocRef, { currentWeek: nextWeek }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  },

  addExamRecord: async (record) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const recordsRef = collection(db, 'users', userId, 'examRecords');
    try {
      await addDoc(recordsRef, record);
      await get().addXP(500);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${userId}/examRecords`);
    }
  },

  deleteExamRecord: async (recordId: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const recordDocRef = doc(db, 'users', userId, 'examRecords', recordId);
    try {
      await deleteDoc(recordDocRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${userId}/examRecords/${recordId}`);
    }
  },

  updateTargetBand: async (band) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const userDocRef = doc(db, 'users', userId);
    try {
      await updateDoc(userDocRef, { targetBand: band });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  },

  saveVocabEntry: async (date, index, entry) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const vocabDocRef = doc(db, 'users', userId, 'vocabulary', date);
    const currentEntries = get().progress.vocabData[date] || [];
    const newEntries = [...currentEntries];
    
    // Ensure the array is long enough to avoid holes
    while (newEntries.length <= index) {
      newEntries.push({ 
        word: '', type: '', meaning: '', collocations: '', 
        sentence: '', spellingTrap: '', highlight: null 
      });
    }
    
    newEntries[index] = entry;

    try {
      await setDoc(vocabDocRef, { entries: newEntries }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}/vocabulary/${date}`);
    }
  },

  updateVocabHighlight: async (date, index, color) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const vocabDocRef = doc(db, 'users', userId, 'vocabulary', date);
    const currentEntries = get().progress.vocabData[date] || [];
    const newEntries = [...currentEntries];

    // Ensure the array is long enough to avoid holes
    while (newEntries.length <= index) {
      newEntries.push({ 
        word: '', type: '', meaning: '', collocations: '', 
        sentence: '', spellingTrap: '', highlight: null 
      });
    }

    if (newEntries[index]) {
      newEntries[index] = { ...newEntries[index], highlight: color };
    }

    try {
      await setDoc(vocabDocRef, { entries: newEntries }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${userId}/vocabulary/${date}`);
    }
  },

  setTheme: (theme) => {
    localStorage.setItem('ielts-prep-theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    set((state) => ({ progress: { ...state.progress, theme } }));
  },

  addXP: async (amount) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const currentXP = get().progress.xp;
    const currentLevel = get().progress.level;
    const newXP = currentXP + amount;
    
    // Level up logic: Level 1 -> 2 needs 1000 XP, etc.
    const xpThreshold = currentLevel * 1000;
    const newLevel = newXP >= xpThreshold ? currentLevel + 1 : currentLevel;
    
    const userDocRef = doc(db, 'users', userId);
    try {
      await setDoc(userDocRef, { 
        xp: newXP,
        level: newLevel 
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${userId}`);
    }
  },

  isWeekUnlocked: (weekId) => {
    if (weekId === 1) return true;
    const prevWeekProgress = get().getWeekProgress(weekId - 1);
    return prevWeekProgress >= 80;
  },

  getWeekProgress: (weekId) => {
    const week = ieltsCurriculum.find(w => w.id === weekId);
    if (!week || !week.tasks) return 0;
    const tasks = week.tasks;
    if (tasks.length === 0) return 100;
    
    const totalProgress = tasks.reduce((sum, task) => {
      const current = get().progress.completedTasks[task.id] || 0;
      return sum + (Math.min(current / task.target, 1) * 100);
    }, 0);
    
    return Math.round(totalProgress / tasks.length);
  }
}));

