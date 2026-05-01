export type TaskType = 'writing' | 'reading' | 'listening' | 'speaking' | 'vocabulary' | 'review' | 'mock';

export type SyllabusTask = {
  title: string;
  description: string;
  type: TaskType;
};

export type SyllabusDay = {
  name: string;
  date: string;
  tasks: SyllabusTask[];
};

export type SyllabusWeek = {
  id: number;
  title: string;
  subtitle: string;
  days: SyllabusDay[];
};

export const month1Weeks: SyllabusWeek[] = [
  {
    id: 1,
    title: "Week 1",
    subtitle: "Foundation & Habit Building",
    days: [
      {
        name: "Monday",
        date: "Apr 27",
        tasks: [
          { type: 'writing', title: 'First Task 2 essay — your baseline', description: "Topic: 'Universities should focus on academic knowledge. Others believe they should prepare students for work. Discuss both views and give your opinion.' Set a 40-minute timer. Type minimum 250 words. Do NOT use a template. Write naturally. Paste to Claude chat immediately after — this is your official starting point." },
          { type: 'vocabulary', title: 'Start your vocabulary log', description: "Open a Word doc. Write 10 words from the Academic Word List (search 'AWL sublist 1' online). Write each word in a sentence. Save this doc. You will add 10 words every day." },
          { type: 'listening', title: '20 minutes English audio', description: "BBC News YouTube, TED Talk, or any documentary. No subtitles. Just listen and absorb. This is non-negotiable — do it every day." }
        ]
      },
      {
        name: "Tuesday",
        date: "Apr 28",
        tasks: [
          { type: 'reading', title: 'Cambridge 12 Test 2 Passage 1 (timed)', description: "Open Cambridge IELTS 12. Test 2, Reading Passage 1. Set 20-minute timer. Do all questions. Check answers. Write EVERY wrong answer in your error log with one sentence: why was this wrong?" },
          { type: 'vocabulary', title: '10 new AWL words + review yesterday\'s 10', description: "Can you use yesterday's 10 words in sentences without looking? If not — re-learn them. Forgotten words go back into daily review." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Wednesday",
        date: "Apr 29",
        tasks: [
          { type: 'writing', title: 'Task 1 — describe a bar chart or line graph', description: "Find any chart online (Google 'IELTS Task 1 bar chart'). Type 150+ words. Structure: Overview paragraph first (main trends), then details. Typed. Paste to Claude." },
          { type: 'speaking', title: 'Speaking cue card — record yourself', description: "Topic: 'Describe a teacher who has influenced you.' Speak for 2 full minutes. Record on your phone. Play back. Write down: how many pauses? Any repeated words? Grammar errors?" },
          { type: 'vocabulary', title: '10 new words + review', description: "Continue building the vocabulary log." }
        ]
      },
      {
        name: "Thursday",
        date: "Apr 30",
        tasks: [
          { type: 'reading', title: 'Cambridge 12 Test 2 Passage 2 (timed)', description: "20 minutes. Check answers. Add errors to error log. Which question TYPE are you getting wrong most? Note the pattern." },
          { type: 'listening', title: 'Listening — Cambridge 12 Test 2 Section 1 + Section 2', description: "YouTube: 'Cambridge IELTS 12 Listening Test 2'. Do Sections 1 and 2 (questions 1–20). Check answers. Note which types are hardest." },
          { type: 'vocabulary', title: '10 new words + review', description: "Continue building the vocabulary log." }
        ]
      },
      {
        name: "Friday",
        date: "May 1",
        tasks: [
          { type: 'writing', title: 'Second full Task 2 essay — 40 minutes timed', description: "Topic: 'Some people think technology is destroying human relationships. Others disagree. Discuss both views and give your opinion.' Typed. Paste to Claude for scoring." },
          { type: 'reading', title: 'Cambridge 12 Test 2 Passage 3 (timed)', description: "20 minutes. Track your score. Write: Passage 1 score + Passage 2 score + Passage 3 score. Add to your error log." },
          { type: 'vocabulary', title: '10 new words + review', description: "Continue building the vocabulary log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Saturday",
        date: "May 2",
        tasks: [
          { type: 'review', title: 'Week 1 review', description: "Look at your error log. What question types did you get wrong most? Write 3 honest sentences: what is your biggest weakness this week? Bring this to Claude chat." },
          { type: 'reading', title: 'Cambridge 12 Test 3 Passage 1 (timed)', description: "20 minutes. Score yourself. Is your accuracy improving from Test 2?" },
          { type: 'vocabulary', title: 'Full review — all 60 words from Week 1', description: "Go through every word. Mark any you forgot. Re-learn those specifically." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Week 2",
    subtitle: "Depth & Question-Type Drilling",
    days: [
      {
        name: "Sunday",
        date: "May 3",
        tasks: [
          { type: 'writing', title: 'Task 2 — opinion/agree-disagree essay', description: "Topic: 'Governments should ban fast food. To what extent do you agree?' 40 min. One clear position — do not flip sides. Every paragraph supports your stance. Typed. Paste to Claude." },
          { type: 'reading', title: 'Collins Reading — Matching Headings chapter', description: "This is the hardest reading question type. Work through the Collins chapter specifically on this. Understand: headings match paragraph MAIN IDEA, not just keywords." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Monday",
        date: "May 4",
        tasks: [
          { type: 'speaking', title: 'Full speaking simulation — all 3 parts recorded', description: "Part 1: Answer 5 questions (4–5 min). Part 2: Cue card — 'Describe a time you were very happy' (2 min). Part 3: Discussion questions on happiness/wellbeing (4–5 min). Record everything. Total ~12 minutes. This is your first full speaking run." },
          { type: 'listening', title: 'Collins Listening — Chapter 1 (form/note completion)', description: "Note completion questions require listening for specific details: numbers, names, dates. Work through this chapter fully." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." }
        ]
      },
      {
        name: "Tuesday",
        date: "May 5",
        tasks: [
          { type: 'writing', title: 'Task 1 — process diagram', description: "Search 'IELTS Task 1 process diagram' online. Describe how something is made or works. 150+ words. Use passive voice: 'The material is heated...', 'Water is added...'. Typed." },
          { type: 'reading', title: 'Collins Reading — True/False/Not Given chapter', description: "CRITICAL: False = the text says the OPPOSITE. Not Given = the topic is not mentioned at all. These are completely different. This confusion costs bands. Drill this until it is automatic." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Wednesday",
        date: "May 6",
        tasks: [
          { type: 'writing', title: 'Task 2 — two-part question essay', description: "Topic: 'Why do people commit crimes? What can be done to prevent crime in society?' 40 min. Answer BOTH parts — one clear paragraph for each question. Equal attention to both. Typed. Paste to Claude." },
          { type: 'reading', title: 'Cambridge 12 Test 3 Passage 2 (timed)', description: "20 minutes. Note your score. Track it. Is it better than last week's passages?" },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Thursday",
        date: "May 7",
        tasks: [
          { type: 'reading', title: 'Reading — speed focus: Cambridge 12 Test 3 Passage 3', description: "Target: finish in under 18 minutes. Speed is as important as accuracy for band 7. If you're taking 25 minutes per passage you will not finish the exam. Time yourself strictly." },
          { type: 'listening', title: 'Collins Listening — Chapter 2 (multiple choice)', description: "Multiple choice requires understanding PARAPHRASE — the audio says the same thing in different words from the options. Practice this skill." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'speaking', title: 'Speaking — Part 1 drill (10 questions)', description: "Answer 10 different Part 1 questions out loud. 2–3 sentences each. Record. Are your answers developed enough or too short?" }
        ]
      },
      {
        name: "Friday",
        date: "May 8",
        tasks: [
          { type: 'writing', title: 'Task 2 — your choice of topic', description: "Pick any topic you have seen in coaching this week. 40 min. Typed. Focus: are you using varied vocabulary or repeating the same 10 words? Paste to Claude." },
          { type: 'reading', title: 'Reading — Cambridge 12 Test 4 Passage 1 (timed)', description: "20 minutes. Score yourself. Add errors to log." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Saturday",
        date: "May 9",
        tasks: [
          { type: 'review', title: 'Week 2 review', description: "Compare Week 2 essays to Week 1 essays — what improved? What is STILL wrong? What patterns keep repeating in your errors? Write it down. Bring it to Claude." },
          { type: 'reading', title: 'Reading — Cambridge 12 Test 4 Passage 2 (timed)', description: "20 minutes. Is your speed improving? Accuracy?" },
          { type: 'vocabulary', title: 'Full vocabulary review — Weeks 1 + 2 (120 words)', description: "Go through all 120 words. Quiz yourself. Any forgotten word returns to daily rotation." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Week 3",
    subtitle: "First Mock Test & Analysis",
    days: [
      {
        name: "Sunday",
        date: "May 10",
        tasks: [
          { type: 'writing', title: 'Task 2 — opinion essay (strong argument practice)', description: "Topic: 'Space exploration is a waste of money and resources. Do you agree?' 40 min. Focus: strong topic sentences. Each paragraph's FIRST sentence must state the point clearly. Body = point + explain + example. Typed. Paste to Claude." },
          { type: 'reading', title: 'Reading — Cambridge 12 Test 4 Passage 3 (timed)', description: "Complete Test 4 reading. You now have a full set of scores from Cambridge 12 Tests 2–4. Track them all." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Monday",
        date: "May 11",
        tasks: [
          { type: 'listening', title: 'Listening — Cambridge 12 Test 4 all 4 sections (full sitting)', description: "YouTube: 'Cambridge IELTS 12 Listening Test 4'. Do all 40 questions in one sitting without stopping. This is mock preparation — sustained concentration practice." },
          { type: 'speaking', title: 'Speaking — Part 3 abstract questions drill', description: "Search 'IELTS Speaking Part 3 questions education' and 'technology'. Answer 6 questions out loud — aim for 45–60 seconds each. These are the hardest speaking questions. Record yourself." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." }
        ]
      },
      {
        name: "Tuesday",
        date: "May 12",
        tasks: [
          { type: 'writing', title: 'Light writing — Task 1 only (20 minutes)', description: "Intentionally light day. One Task 1, 20 min. Focus on accuracy not speed. Rest your brain slightly before mock day." },
          { type: 'reading', title: 'Collins Reading — your single worst question type from error log', description: "Look at your error log. Which question type has the most wrong answers? Open Collins Reading and do the full chapter on that type ONLY. Targeted, not random." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Wednesday",
        date: "May 13",
        tasks: [
          { type: 'review', title: 'Mock prep day — review and rest', description: "Go through your FULL error log from Weeks 1–3. No new essays today. Review your vocabulary list. Sleep well tonight. Your brain needs to be fresh tomorrow." },
          { type: 'vocabulary', title: 'Review all vocabulary — Weeks 1, 2, 3 (150 words)', description: "Fresh mind before the mock." },
          { type: 'listening', title: '20 min easy audio — something you genuinely enjoy', description: "Relax before mock test." }
        ]
      },
      {
        name: "Thursday",
        date: "May 14",
        tasks: [
          { type: 'mock', title: 'FULL MOCK TEST — ALL 4 SKILLS (Cambridge 12 Test 1)', description: "WRITING: Task 1 first — 20 minutes. Task 2 second — 40 minutes. Total 60 min. No stopping between. READING: Cambridge 12 Test 1 — all 3 passages, 60 minutes strict. No extra time. LISTENING: YouTube 'Cambridge IELTS 12 Listening Test 1' — 4 sections, no pause, no rewind. SPEAKING: Record yourself doing all 3 parts back to back. RULES: No phone. No breaks between skills. Real exam conditions. Do this in one full sitting." }
        ]
      },
      {
        name: "Friday",
        date: "May 15",
        tasks: [
          { type: 'mock', title: 'MOCK ANALYSIS — most important day of Month 1', description: "Score your Listening: X out of 40 → convert to band (26=6.5, 30=7.0, 35=8.0). Score your Reading: X out of 40 → same conversion. Submit BOTH writing tasks to Claude for honest band scoring. Review speaking recording — note every weakness. Write your baseline report: Listening band, Reading band, Writing T1 band, Writing T2 band, Speaking self-assessed band. This is your official starting point." },
          { type: 'review', title: 'Identify top 3 weaknesses from the mock', description: "Which skill hurt you most? Within that skill, what specifically went wrong? Write 3 clear sentences. This becomes the foundation of Month 2." }
        ]
      },
      {
        name: "Saturday",
        date: "May 16",
        tasks: [
          { type: 'reading', title: 'Targeted reading drill — based on mock results', description: "Do the question type that cost you most in the mock. Be surgical. Not random practice — targeted fixing." },
          { type: 'vocabulary', title: 'Full vocabulary review — all 150 words', description: "Go through everything from Month 1 so far." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." },
          { type: 'writing', title: 'Rewrite one of your mock Task 2 paragraphs', description: "Take your mock Task 2. Pick the weakest paragraph. Rewrite it based on Claude's feedback. Type the rewrite. Compare." }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Week 4",
    subtitle: "Fix, Consolidate & Close Month 1",
    days: [
      {
        name: "Sunday",
        date: "May 17",
        tasks: [
          { type: 'writing', title: 'Task 2 — attack your biggest mock writing weakness', description: "If mock showed weak coherence: write one essay focusing ONLY on linking and paragraph flow. If vocabulary was weak: use 10 new AWL words consciously in the essay. If task response was off: write one where every paragraph links back to the question. Typed. Paste to Claude." },
          { type: 'reading', title: 'Reading — 2 timed passages back to back', description: "Any 2 passages from Cambridge 12. Compare scores to pre-mock. Trending up?" },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Monday",
        date: "May 18",
        tasks: [
          { type: 'writing', title: 'Full writing exam simulation — Task 1 + Task 2, 60 min total', description: "Task 1 first: 20 minutes. Task 2 second: 40 minutes. No break between. This is the real exam sequence. Practice the time split. Typed. Paste both to Claude." },
          { type: 'speaking', title: 'Speaking — attack your weakest part from mock', description: "If Part 2 was weak: drill 3 different cue cards today. If Part 3: practice 8 abstract questions with 45-second answers. If fluency: 5 random topics, 1 minute each, no stopping mid-topic." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Tuesday",
        date: "May 19",
        tasks: [
          { type: 'writing', title: 'Task 2 — grammatical range focus', description: "Write a Task 2 where you deliberately use: at least 2 conditional sentences ('If governments invest...', 'Were this policy implemented...'), 2 passive constructions, 2 relative clauses. Push your grammatical range consciously. Topic: 'Cities are becoming overcrowded. What problems does this cause? What solutions can be suggested?' Typed." },
          { type: 'reading', title: 'First full reading simulation — 3 passages in 60 minutes', description: "This is the first time doing the full reading exam simulation. How many passages did you finish? Did you run out of time? Where? This tells us exactly where Month 2 needs to focus." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Wednesday",
        date: "May 20",
        tasks: [
          { type: 'listening', title: 'Listening — Cambridge 12 Test 3 Sections 3 and 4 (hardest)', description: "Sections 3 and 4 are academic and the hardest. Section 3 = discussion between students/tutor. Section 4 = academic lecture. Do these specifically. Note what makes them harder." },
          { type: 'speaking', title: 'Fluency drill — 5 topics, 1 minute each, no stopping', description: "Pick 5 random topics (education, technology, environment, family, health). Speak 1 minute on each. If you stop before 1 minute — start that topic again. Uncomfortable on purpose. Builds fluency under pressure." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'reading', title: 'Collins Reading — one more targeted chapter on your second-weakest type', description: "Target weak points." }
        ]
      },
      {
        name: "Thursday",
        date: "May 21",
        tasks: [
          { type: 'writing', title: 'Task 2 — discuss both views (most common format)', description: "Topic: 'Some people prefer living in cities. Others prefer living in rural areas. Discuss both views and give your own opinion.' Present BOTH views clearly — one paragraph each — then state your own view in the conclusion. Typed. Paste to Claude." },
          { type: 'reading', title: 'Collins Reading — sentence completion chapter', description: "Answers must be EXACT words from the text — no paraphrasing. Students who instinctively paraphrase lose marks here. Drill this specifically." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Friday",
        date: "May 22",
        tasks: [
          { type: 'writing', title: 'FINAL ESSAY OF MONTH 1 — your absolute best effort', description: "Any topic you feel confident about. 40 min. This essay should show clear improvement from your April 27 essay. Paste to Claude. We will compare both essays side by side and measure your progress." },
          { type: 'review', title: 'Full Month 1 review', description: "Write answers to these 3 questions: (1) What improved the most this month? (2) What is still consistently wrong? (3) What must Month 2 fix first? Bring this to Claude on May 24." },
          { type: 'listening', title: '30 min audio', description: "Increased daily habit." },
          { type: 'vocabulary', title: '10 new words + review', description: "Add to log." }
        ]
      },
      {
        name: "Saturday",
        date: "May 23",
        tasks: [
          { type: 'reading', title: 'Reading — 2 timed passages', description: "Keep the habit going. Month 1 ending is NOT a finish line." },
          { type: 'vocabulary', title: 'Full Month 1 vocabulary review — 300 words total', description: "Every word from the entire month. Go through all of them. This is your academic foundation." },
          { type: 'speaking', title: 'Record a cue card — compare to your Week 1 recording', description: "Has your fluency improved? Is your vocabulary range wider? Listen to both recordings back to back. Be honest." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Sunday",
        date: "May 24",
        tasks: [
          { type: 'review', title: 'MONTH 2 PLANNING SESSION — come to Claude', description: "Bring: (1) your mock band scores per skill, (2) your top 3 recurring mistakes from the month, (3) what felt hardest. Month 2 will be built specifically around this data. Do not skip this." },
          { type: 'writing', title: 'Light writing — Task 1 only (keep the habit alive)', description: "Never skip 2 consecutive days of writing. Even on planning days." },
          { type: 'listening', title: '20 min audio', description: "Maintain the daily habit." }
        ]
      },
      {
        name: "Monday",
        date: "May 25",
        tasks: [
          { type: 'review', title: 'Month 1 ends — honest self-assessment', description: "Check every end-goal: 12+ essays submitted? 1 full mock completed and analysed? 300-word vocabulary log? Daily audio habit? Month 2 plan ready? The ones you missed are Month 2's first priorities. No excuses — only data." }
        ]
      }
    ]
  }
];
