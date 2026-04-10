import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Plus, Trash2, Flame, BarChart2, TrendingUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AppState, Habit } from '../types';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HabitsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  subTab: string;
  setSubTab: (sub: string) => void;
  gainXP: (xp: number, pts: number) => void;
  showToast: (msg: string, color?: string) => void;
}

export const Habits: React.FC<HabitsProps> = ({ state, setState, subTab, setSubTab, gainXP, showToast }) => {
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Mind');

  const addHabit = () => {
    if (!newName.trim()) return showToast('⚠ Enter habit name!', '#f43f5e');
    const habit: Habit = {
      id: Date.now(),
      name: newName.trim(),
      cat: newCat,
      streak: 0,
      bestStreak: 0,
      lastDate: '',
      created: Date.now()
    };
    setState(prev => ({ ...prev, habits: [...prev.habits, habit] }));
    setNewName('');
    showToast('🔁 Habit Forged!', '#b06ef3');
    setSubTab('list');
  };

  const logHabit = (id: number) => {
    const today = format(new Date(), 'EEE MMM dd yyyy');
    const yesterday = format(new Date(Date.now() - 86400000), 'EEE MMM dd yyyy');
    
    setState(prev => {
      const habits = prev.habits.map(h => {
        if (h.id === id) {
          if (h.lastDate === today) {
            showToast('Already done today!', '#f5a623');
            return h;
          }
          
          let newStreak = h.streak;
          if (h.lastDate === yesterday || h.lastDate === '') {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          
          const newBest = Math.max(h.bestStreak, newStreak);
          gainXP(15, 10);
          showToast(`🔥 Habit Complete! Streak: ${newStreak}`, '#f5a623');
          return { ...h, lastDate: today, streak: newStreak, bestStreak: newBest };
        }
        return h;
      });
      return { ...prev, habits };
    });
  };

  const deleteHabit = (id: number) => {
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  };

  const today = format(new Date(), 'EEE MMM dd yyyy');

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1">
        {['list', 'add', 'stats'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
              subTab === t ? "bg-hunter-purple text-white shadow-lg" : "text-hunter-text3 hover:text-hunter-text2"
            )}
          >
            {t === 'list' ? 'HABITS' : t === 'add' ? '+ NEW' : 'STATS'}
          </button>
        ))}
      </div>

      <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-purple/30 mb-3">
        <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-black tracking-[4px] text-hunter-purple uppercase">HABIT FORGE</div>
        </div>
      </div>

      {subTab === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {state.habits.length === 0 ? (
            <div className="text-center py-10 text-hunter-text3">
              <RotateCcw className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No habits forged yet.<br />Start small.</div>
            </div>
          ) : (
            state.habits.map(h => {
              const doneToday = h.lastDate === today;
              return (
                <div key={h.id} className={cn("hunter-card p-3 flex items-center gap-3", doneToday && "border-hunter-green/50 bg-hunter-green/5")}>
                  <div className="w-12 text-center shrink-0">
                    <div className={cn("font-display text-lg font-black", h.streak > 0 ? "text-hunter-gold" : "text-hunter-text3")}>
                      {h.streak}🔥
                    </div>
                    <div className="text-[7px] text-hunter-text3 uppercase tracking-tighter">BEST: {h.bestStreak}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-sm font-bold truncate", doneToday ? "text-hunter-text3 line-through" : "text-white")}>
                      {h.name}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-hunter-purple/20 text-hunter-purple font-bold uppercase tracking-widest">
                        {h.cat}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!doneToday ? (
                      <button 
                        onClick={() => logHabit(h.id)}
                        className="hunter-btn btn-sm bg-hunter-green text-black px-4"
                      >
                        DONE
                      </button>
                    ) : (
                      <span className="text-[10px] text-hunter-green font-bold uppercase tracking-widest">✓ DONE</span>
                    )}
                    <button onClick={() => deleteHabit(h.id)} className="text-hunter-text3 hover:text-hunter-red transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      )}

      {subTab === 'add' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="hunter-card p-4 border-hunter-purple/30">
            <div className="text-[9px] text-hunter-purple font-bold tracking-[3px] uppercase mb-4">FORGE NEW HABIT</div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1.5 block">Habit Name</label>
                <input 
                  type="text" 
                  className="hunter-input" 
                  placeholder="e.g. Read 10 Pages, Meditate 10m" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1.5 block">Category</label>
                <select 
                  className="hunter-input"
                  value={newCat}
                  onChange={e => setNewCat(e.target.value)}
                >
                  <option>Mind</option>
                  <option>Body</option>
                  <option>Wealth</option>
                  <option>Skill</option>
                </select>
              </div>
              <button 
                className="hunter-btn bg-hunter-purple text-white w-full shadow-lg shadow-hunter-purple/20"
                onClick={addHabit}
              >
                CREATE HABIT
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {subTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mt-4 flex items-center gap-2">
            <TrendingUp size={12} className="text-hunter-purple" />
            STREAK ANALYSIS
          </div>

          {state.habits.length === 0 ? (
            <div className="hunter-card p-8 text-center text-hunter-text3">
              <BarChart2 className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">Forge habits to see streaks</div>
            </div>
          ) : (() => {
            const chartData = state.habits.map(h => ({
              name: h.name.length > 10 ? h.name.slice(0, 8) + '..' : h.name,
              streak: h.streak,
              best: h.bestStreak
            }));

            return (
              <div className="space-y-4">
                <div className="hunter-card p-4 h-[250px] border-hunter-purple/20">
                  <div className="text-[10px] text-hunter-text3 mb-4 uppercase tracking-widest">Current Streaks</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }}
                        cursor={{ fill: '#1e293b', opacity: 0.4 }}
                      />
                      <Bar dataKey="streak" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="hunter-card p-3 border-hunter-gold/20">
                    <div className="text-[8px] text-hunter-text3 uppercase mb-1">Total Habits</div>
                    <div className="text-xl font-black text-hunter-gold">{state.habits.length}</div>
                  </div>
                  <div className="hunter-card p-3 border-hunter-green/20">
                    <div className="text-[8px] text-hunter-text3 uppercase mb-1">Total Streaks</div>
                    <div className="text-xl font-black text-hunter-green">
                      {state.habits.reduce((acc, h) => acc + h.streak, 0)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};
