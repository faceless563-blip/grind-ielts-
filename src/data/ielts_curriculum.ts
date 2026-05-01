export interface Task {
  id: string;
  title: string;
  type: 'video' | 'book' | 'project' | 'exam' | 'practice';
  target: number;
  current: number;
  unit: string;
  link?: string;
}

export interface WeekData {
  id: number;
  title: string;
  description: string;
  tasks: Task[];
}

export const ieltsCurriculum: WeekData[] = [
  {
    id: 1,
    title: "Month 1: Foundation & Habit Building",
    description: "Establish the daily writing habit, complete your first full mock test, and build a 300-word vocabulary log.",
    tasks: [
      { id: 'm1-p1', title: 'Essays Typed & Scored', type: 'project', target: 12, current: 0, unit: 'essays' },
      { id: 'm1-e1', title: 'Full Mock Test (May 14)', type: 'exam', target: 1, current: 0, unit: 'test' },
      { id: 'm1-b1', title: 'Vocabulary Log Building', type: 'book', target: 300, current: 0, unit: 'words' },
      { id: 'm1-l1', title: 'Daily English Audio Habit', type: 'practice', target: 20, current: 0, unit: 'hours' },
      { id: 'm1-v1', title: 'Cambridge 12 Tests 2-4', type: 'practice', target: 3, current: 0, unit: 'tests' }
    ]
  },
  {
    id: 2,
    title: "Month 2: Depth & Question-Type Drilling",
    description: "Attack your specific weaknesses from Month 1 mock test with targeted drills and precision focus.",
    tasks: [
      { id: 'm2-p1', title: 'Advanced Essay Reviews', type: 'project', target: 8, current: 0, unit: 'essays' },
      { id: 'm2-e1', title: 'Full Mock Test 2', type: 'exam', target: 1, current: 0, unit: 'test' },
      { id: 'm2-b1', title: 'Vocabulary Expansion', type: 'book', target: 300, current: 0, unit: 'words' },
      { id: 'm2-l1', title: 'Targeted Audio Drills', type: 'practice', target: 20, current: 0, unit: 'hours' },
    ]
  },
  {
    id: 3,
    title: "Month 3: Advanced Mock Test & Analysis",
    description: "Intensive exam simulations, finalizing strategies, and test day readiness protocols.",
    tasks: [
      { id: 'm3-p1', title: 'Timed Writing Sprints', type: 'project', target: 8, current: 0, unit: 'essays' },
      { id: 'm3-e1', title: 'Full Mock Test 3', type: 'exam', target: 1, current: 0, unit: 'test' },
      { id: 'm3-b1', title: 'Targeted Vocabulary Review', type: 'book', target: 300, current: 0, unit: 'words' },
    ]
  },
  {
    id: 4,
    title: "Month 4: Fix, Consolidate & Close",
    description: "Final consolidation, focusing on your specific weaknesses from mock test results to secure your Band 9.0.",
    tasks: [
      { id: 'm4-p1', title: 'Final Review Essays', type: 'project', target: 4, current: 0, unit: 'essays' },
      { id: 'm4-e1', title: 'Final Full Exam Simulation', type: 'exam', target: 1, current: 0, unit: 'test' },
    ]
  }
];
