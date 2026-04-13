export interface Activity {
  id: string;
  from: string;
  to: string;
  activity: string;
  cat: string;
  date: string;
  energy: number;
  ts: number;
}

export interface Project {
  id: number;
  name: string;
  desc: string;
  cat: string;
  color: string;
  deadline: string;
  target: number;
  progress: number;
  done: boolean;
  created: number;
}

export interface Task {
  id: number;
  title: string;
  projId: number | null;
  prio: 'high' | 'mid' | 'low';
  due: string;
  pts: number;
  notes: string;
  done: boolean;
  created: number;
}

export interface Quest {
  id: number;
  title: string;
  desc: string;
  instructions?: string[];
  reflection?: string;
  type: string;
  prio: string;
  xp: number;
  pts: number;
  target: number;
  progress: number;
  deadline: string;
  done: boolean;
  created: number;
  completedAt?: number;
}

export interface GymSet {
  reps: number;
  weight: number;
}

export interface GymLog {
  id: number;
  exercise: string;
  sets: GymSet[];
  muscle: string;
  notes: string;
  date: string;
  ts: number;
}

export interface Investment {
  id: number;
  name: string;
  amount: number;
  type: string;
  notes: string;
  date: string;
  month: string;
  ts: number;
}

export interface Photo {
  id: string;
  thumb: string;
  date: string;
  metrics?: {
    wt?: number;
    bf?: number;
    ch?: number;
    wa?: number;
    ar?: number;
  };
  analysis?: string;
}

export interface Metric {
  id: string;
  date: string;
  wt?: number;
  bf?: number;
  ch?: number;
  wa?: number;
  ar?: number;
}

export interface Reward {
  id: number;
  icon: string;
  name: string;
  desc: string;
  cost: number;
  type: 'default' | 'custom';
}

export interface RewardHistory extends Reward {
  claimedAt: number;
  date: string;
}

export interface TimerSession {
  id: string;
  label: string;
  mins: number;
  date: string;
  ts: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  type: 'Weapon' | 'Armor' | 'Skill' | 'Item';
  acquiredAt: number;
}

export interface Habit {
  id: number;
  name: string;
  cat: string;
  streak: number;
  bestStreak: number;
  lastDate: string;
  created: number;
}

export interface Character {
  id: string;
  name: string;
  image: string;
  rank: string;
  desc: string;
  unlockRequirement: {
    tasks?: number;
    pts?: number;
    xp?: number;
  };
}

export interface BodyweightLog {
  id: number;
  exercise: string;
  reps: number;
  sets: number;
  date: string;
  ts: number;
}

export interface StepLog {
  id: number;
  steps: number;
  date: string;
  ts: number;
}

export interface AppState {
  activities: Activity[];
  projects: Project[];
  tasks: Task[];
  quests: Quest[];
  habits: Habit[];
  gym: GymLog[];
  bodyweight: BodyweightLog[];
  steps: StepLog[];
  investments: Investment[];
  photos: Photo[];
  metrics: Metric[];
  rewards: Reward[];
  rwHistory: RewardHistory[];
  inventory: InventoryItem[];
  timerSessions: TimerSession[];
  unlockedCharacters: string[];
  xp: number;
  pts: number;
  streak: number;
  bestStreak: number;
  lastDate: string;
  systemDay: number;
  lastQuestDate: string;
  energy: number;
}

export interface Rank {
  r: string;
  minXP: number;
  title: string;
}
