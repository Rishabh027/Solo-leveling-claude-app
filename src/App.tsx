import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, ClipboardList, Hammer, Target, Gem, Dumbbell, 
  CircleDollarSign, User, Plus, X, Play, Pause, 
  RotateCcw, Check, Trash2, Camera, Trophy, Flame,
  TrendingUp, Calendar, Clock, Brain, Info
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { format, subDays, startOfWeek, addDays, isSameDay } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { 
  Activity, Project, Task, Quest, GymLog, 
  Investment, Photo, Metric, Reward, RewardHistory, 
  TimerSession, AppState 
} from './types';
import { 
  RANKS, ACHIEVEMENTS, DEFAULT_REWARDS, SL_QUOTES, 
  CAT_COLORS, CAT_LABELS, SYSTEM_QUESTS_90, CHARACTERS 
} from './constants';

import { Projects } from './components/Projects';
import { Quests } from './components/Quests';
import { Rewards } from './components/Rewards';
import { Gym } from './components/Gym';
import { Invest } from './components/Invest';
import { Body } from './components/Body';
import { Timer } from './components/Timer';
import { Dashboard } from './components/Dashboard';
import { Daily } from './components/Daily';
import { Habits } from './components/Habits';
import { Badge, Card, SectionTitle } from './components/Common';

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dash');
  const [subTab, setSubTab] = useState<Record<string, string>>({
    daily: 'log',
    projects: 'view',
    quests: 'active',
    habits: 'list',
    rewards: 'store',
    gym: 'log',
    invest: 'add',
    body: 'up'
  });

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('hunter_os_state');
    const defaults: AppState = {
      activities: [],
      projects: [],
      tasks: [],
      quests: [],
      gym: [],
      investments: [],
      photos: [],
      metrics: [],
      rewards: DEFAULT_REWARDS,
      rwHistory: [],
      inventory: [],
      habits: [],
      timerSessions: [],
      unlockedCharacters: ['jinwoo_e'],
      xp: 0,
      pts: 0,
      streak: 0,
      bestStreak: 0,
      lastDate: '',
      systemDay: 1,
      lastQuestDate: '',
      energy: 2
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      } catch (e) {
        console.error("Failed to parse state", e);
        return defaults;
      }
    }
    return defaults;
  });

  const [userName, setUserName] = useState(() => localStorage.getItem('hunter_os_name') || 'HUNTER');
  const [toast, setToast] = useState<{ msg: string, color: string } | null>(null);
  const [xpPop, setXpPop] = useState<{ xp: number, pts: number } | null>(null);
  const [achPop, setAchPop] = useState<{ icon: string, name: string } | null>(null);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('hunter_os_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('hunter_os_name', userName);
  }, [userName]);

  // --- Helpers ---
  const showToast = (msg: string, color: string = '#10b981') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2400);
  };

  const showXpPop = (xp: number, pts: number) => {
    setXpPop({ xp, pts });
    setTimeout(() => setXpPop(null), 2000);
  };

  const showAchPop = (icon: string, name: string) => {
    setAchPop({ icon, name });
    setTimeout(() => setAchPop(null), 3500);
  };

  const gainXP = (xp: number, pts: number) => {
    const prevRank = getRank(state.xp).r;
    const newXp = state.xp + xp;
    const newRank = getRank(newXp).r;

    if (newRank !== prevRank) {
      showToast(`🏆 RANK UP! ${RANKS.find(r => r.r === newRank)?.title.toUpperCase()}`, '#f5a623');
      showAchPop('👑', `RANK UP → ${newRank}-RANK!`);
    }

    setState(prev => ({
      ...prev,
      xp: newXp,
      pts: prev.pts + pts
    }));
    showXpPop(xp, pts);
    checkAchievements();
    checkCharacterUnlocks(newXp, state.pts + pts, state.tasks.filter(t => t.done).length);
  };

  const checkCharacterUnlocks = useCallback((currentXp: number, currentPts: number, completedTasks: number) => {
    CHARACTERS.forEach(char => {
      if (!state.unlockedCharacters.includes(char.id)) {
        const req = char.unlockRequirement;
        const xpMet = !req.xp || currentXp >= req.xp;
        const ptsMet = !req.pts || currentPts >= req.pts;
        const tasksMet = !req.tasks || completedTasks >= req.tasks;

        if (xpMet && ptsMet && tasksMet) {
          setState(prev => ({
            ...prev,
            unlockedCharacters: [...prev.unlockedCharacters, char.id]
          }));
          showToast(`🌑 SHADOW EXTRACTED: ${char.name.toUpperCase()}`, '#8b5cf6');
          showAchPop('🌑', `NEW SHADOW: ${char.name}`);
        }
      }
    });
  }, [state.unlockedCharacters]);

  const getRank = (xp: number) => {
    let r = RANKS[0];
    for (const x of RANKS) {
      if (xp >= x.minXP) r = x;
    }
    return r;
  };

  const getNextRank = (xp: number) => {
    const current = getRank(xp);
    const idx = RANKS.findIndex(r => r.r === current.r);
    return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
  };

  const checkAchievements = useCallback(() => {
    ACHIEVEMENTS.forEach(a => {
      const earned = JSON.parse(localStorage.getItem('hunter_os_achs') || '[]');
      if (!earned.includes(a.id)) {
        let isEarned = false;
        if (a.id === 'first_act' && state.activities.length >= 1) isEarned = true;
        if (a.id === 'week_streak' && state.streak >= 7) isEarned = true;
        if (a.id === 'month_streak' && state.streak >= 30) isEarned = true;
        if (a.id === 'gym10' && state.gym.length >= 10) isEarned = true;
        if (a.id === 'invest5' && state.investments.length >= 5) isEarned = true;
        if (a.id === 'quest10' && state.quests.filter(q => q.done).length >= 10) isEarned = true;
        if (a.id === 'pts1000' && state.pts >= 1000) isEarned = true;
        if (a.id === 'rank_d' && state.xp >= 500) isEarned = true;

        if (isEarned) {
          const newEarned = [...earned, a.id];
          localStorage.setItem('hunter_os_achs', JSON.stringify(newEarned));
          showAchPop(a.icon, a.name);
        }
      }
    });
  }, [state]);

  // --- Dashboard Logic ---
  const today = format(new Date(), 'EEE MMM dd yyyy');
  const todayActivities = state.activities.filter(a => a.date === today);
  
  const calcHours = (from: string, to: string) => {
    const [fh, fm] = from.split(':').map(Number);
    const [th, tm] = to.split(':').map(Number);
    return Math.max(0, (th * 60 + tm - (fh * 60 + fm)) / 60);
  };

  const totalHoursToday = todayActivities.reduce((acc, a) => acc + calcHours(a.from, a.to), 0);

  const acceptDailySystemQuest = () => {
    const todayStr = format(new Date(), 'EEE MMM dd yyyy');
    if (state.lastQuestDate === todayStr) return;
    
    const currentDay = Number(state.systemDay) || 1;
    const qData = SYSTEM_QUESTS_90[Math.max(0, (currentDay - 1) % 90)];
    if (!qData) return;
    
    const newQuest: Quest = {
      id: Date.now(),
      title: `[DAY ${currentDay}] ${qData.t}`,
      desc: qData.desc,
      instructions: qData.instructions || [],
      type: 'daily',
      prio: 'Urgent',
      xp: qData.xp || 100,
      pts: qData.pts || 50,
      target: 1,
      progress: 0,
      deadline: format(new Date(), 'yyyy-MM-dd'),
      done: false,
      created: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      quests: [...prev.quests, newQuest],
      lastQuestDate: todayStr,
      systemDay: (Number(prev.systemDay) || 1) + 1
    }));
    
    showToast('⚡ SYSTEM QUEST ACCEPTED!', '#f5a623');
    setActiveTab('quests');
  };

  const pieData = useMemo(() => {
    const cats: Record<string, number> = { deep: 0, health: 0, learn: 0, admin: 0, rest: 0 };
    todayActivities.forEach(a => {
      const h = calcHours(a.from, a.to);
      if (cats[a.cat] !== undefined) cats[a.cat] += h;
      else if (a.cat === 'project') cats.deep += h;
      else if (a.cat === 'social' || a.cat === 'creative') cats.learn += h;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [todayActivities]);

  // --- Layout ---

  return (
    <div className="fixed inset-0 flex flex-col bg-bg text-hunter-text safe-top safe-bottom">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: -100, x: '-50%' }} 
            animate={{ y: 20, x: '-50%' }} 
            exit={{ y: -100, x: '-50%' }}
            className="fixed top-0 left-1/2 z-[9999] px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest shadow-2xl pointer-events-none whitespace-nowrap"
            style={{ backgroundColor: toast.color, color: '#fff' }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP Pop */}
      <AnimatePresence>
        {xpPop && (
          <motion.div 
            initial={{ scale: 0, x: '-50%' }} 
            animate={{ scale: 1, x: '-50%' }} 
            exit={{ scale: 0, x: '-50%' }}
            className="fixed top-[30%] left-1/2 z-[600] bg-gradient-to-br from-[#0d2060] to-[#1a3a8f] border-2 border-hunter-blue rounded-2xl p-4 text-center shadow-2xl pointer-events-none"
          >
            <div className="font-display text-3xl font-black text-hunter-blue">+{xpPop.xp} XP</div>
            <div className="text-[10px] text-hunter-text2 tracking-widest uppercase">EXPERIENCE GAINED</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Pop */}
      <AnimatePresence>
        {achPop && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: -80, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-4 right-4 z-[700] bg-gradient-to-br from-[#1a0a00] to-[#2a1500] border border-hunter-gold rounded-2xl p-4 flex items-center gap-4 shadow-2xl"
          >
            <div className="text-3xl">{achPop.icon}</div>
            <div>
              <div className="text-[10px] text-hunter-gold font-bold tracking-widest uppercase">ACHIEVEMENT UNLOCKED</div>
              <div className="text-sm font-semibold text-white">{achPop.name}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topbar */}
      <header className="p-3 pb-1 shrink-0">
        <div className="relative bg-gradient-to-br from-[#0e0e1e]/95 to-[#14142d]/95 border border-hunter-b2 rounded-2xl p-3 backdrop-blur-xl overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-hunter-blue/10 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0d2060] to-[#2563eb] border-2 border-hunter-blue flex items-center justify-center font-display text-xl font-black text-white shadow-[0_0_20px_rgba(79,142,247,0.4)]">
                {getRank(state.xp).r}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-hunter-gold text-[8px] font-black px-1 rounded border border-bg">
                {getRank(state.xp).r}
              </div>
            </div>
            <div className="flex-1 min-width-0">
              <div className="text-[9px] text-hunter-blue tracking-[3px] uppercase mb-0.5">{getRank(state.xp).title}</div>
              <div className="font-display text-sm font-bold text-white truncate">{userName}</div>
              <div className="flex justify-between text-[9px] text-hunter-text3 font-mono mt-1">
                <span>Lv.{Math.floor(state.xp / 100) + 1}</span>
                <span>{state.xp} / {getNextRank(state.xp)?.minXP || 'MAX'} XP</span>
              </div>
              <div className="h-1 bg-hunter-b1 rounded-full mt-0.5 overflow-hidden relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-hunter-blue to-hunter-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (state.xp % 100))}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-lg font-bold text-hunter-gold">{state.pts.toLocaleString()}</div>
              <div className="text-[8px] text-hunter-text3 tracking-widest uppercase">POINTS</div>
            </div>
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {[
              { val: totalHoursToday.toFixed(1), lbl: 'hrs', color: 'text-hunter-blue' },
              { val: state.streak, lbl: '🔥', color: 'text-hunter-red' },
              { val: state.tasks.filter(t => t.done).length, lbl: 'tasks', color: 'text-hunter-green' },
              { val: state.quests.filter(q => q.done).length, lbl: 'quests', color: 'text-hunter-purple' },
              { val: state.gym.length, lbl: 'gym', color: 'text-hunter-gold' }
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-1 bg-hunter-s2 border border-hunter-b2 rounded-lg px-2 py-1">
                <span className={cn("font-mono text-xs font-bold", c.color)}>{c.val}</span>
                <span className="text-[8px] text-hunter-text3 tracking-widest uppercase">{c.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-3 pb-4">
        {activeTab === 'dash' && (
          <Dashboard 
            state={state} 
            setState={setState} 
            rank={getRank(state.xp)} 
            nextRank={getNextRank(state.xp)} 
            totalHoursToday={totalHoursToday} 
            pieData={pieData} 
            calcHours={calcHours} 
            showToast={showToast} 
            acceptDailySystemQuest={acceptDailySystemQuest}
          />
        )}
        {activeTab === 'daily' && (
          <Daily 
            state={state} 
            setState={setState} 
            subTab={subTab.daily} 
            setSubTab={(sub) => setSubTab(prev => ({ ...prev, daily: sub }))} 
            gainXP={gainXP} 
            showToast={showToast} 
            today={today} 
            todayActivities={todayActivities} 
            calcHours={calcHours} 
          />
        )}
        {activeTab === 'projects' && (
          <Projects 
            state={state} 
            setState={setState} 
            subTab={subTab.projects} 
            setSubTab={(sub) => setSubTab(prev => ({ ...prev, projects: sub }))}
            gainXP={gainXP}
            showToast={showToast}
          />
        )}
        {activeTab === 'quests' && (
          <Quests 
            state={state} 
            setState={setState} 
            subTab={subTab.quests} 
            setSubTab={(sub) => setSubTab(prev => ({ ...prev, quests: sub }))}
            gainXP={gainXP}
            showToast={showToast}
          />
        )}
        {activeTab === 'habits' && (
          <Habits 
            state={state} 
            setState={setState} 
            subTab={subTab.habits} 
            setSubTab={(sub) => setSubTab(prev => ({ ...prev, habits: sub }))}
            gainXP={gainXP}
            showToast={showToast}
          />
        )}
        {activeTab === 'rewards' && (
          <Rewards 
            state={state} 
            setState={setState} 
            subTab={subTab.rewards} 
            setSubTab={(sub) => setSubTab(prev => ({ ...prev, rewards: sub }))}
            showToast={showToast}
            showAchPop={showAchPop}
          />
        )}
        {activeTab === 'gym' && (
          <Gym 
            state={state} 
            setState={setState} 
            subTab={subTab.gym} 
            setSubTab={(sub) => setSubTab(prev => ({ ...prev, gym: sub }))}
            gainXP={gainXP}
            showToast={showToast}
          />
        )}
        {activeTab === 'invest' && (
          <Invest 
            state={state} 
            setState={setState} 
            subTab={subTab.invest} 
            setSubTab={(sub) => setSubTab(prev => ({ ...prev, invest: sub }))}
            gainXP={gainXP}
            showToast={showToast}
          />
        )}
        {activeTab === 'body' && (
          <Body 
            state={state} 
            setState={setState} 
            subTab={subTab.body} 
            setSubTab={(sub) => setSubTab(prev => ({ ...prev, body: sub }))}
            gainXP={gainXP}
            showToast={showToast}
          />
        )}
      </main>

      {/* Navigation */}
      <nav className="shrink-0 bg-[#080812]/98 border-t border-hunter-b2 flex p-1 backdrop-blur-3xl">
        {[
          { id: 'dash', icon: <Zap size={18} />, label: 'Board' },
          { id: 'daily', icon: <ClipboardList size={18} />, label: 'Daily' },
          { id: 'projects', icon: <Hammer size={18} />, label: 'Projects' },
          { id: 'quests', icon: <Target size={18} />, label: 'Quests' },
          { id: 'habits', icon: <RotateCcw size={18} />, label: 'Habits' },
          { id: 'rewards', icon: <Gem size={18} />, label: 'Rewards' },
          { id: 'gym', icon: <Dumbbell size={18} />, label: 'Gym' },
          { id: 'invest', icon: <CircleDollarSign size={18} />, label: 'Invest' },
          { id: 'body', icon: <User size={18} />, label: 'Body' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all",
              activeTab === t.id ? "text-hunter-blue bg-hunter-blue/10" : "text-hunter-text3"
            )}
          >
            {t.icon}
            <span className="text-[8px] font-bold tracking-widest uppercase">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
