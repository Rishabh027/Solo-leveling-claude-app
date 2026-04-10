import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Trophy, History, X, LineChart as ChartIcon, TrendingUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GymLog, AppState } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GymProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  subTab: string;
  setSubTab: (sub: string) => void;
  gainXP: (xp: number, pts: number) => void;
  showToast: (msg: string, color?: string) => void;
}

export const Gym: React.FC<GymProps> = ({ state, setState, subTab, setSubTab, gainXP, showToast }) => {
  const [exercise, setExercise] = useState('');
  const [muscle, setMuscle] = useState('Chest');
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState([{ reps: 10, weight: 60 }]);

  const addSet = () => setSets(prev => [...prev, { ...prev[prev.length - 1] }]);
  const removeSet = (idx: number) => setSets(prev => prev.filter((_, i) => i !== idx));
  const updateSet = (idx: number, field: 'reps' | 'weight', val: number) => {
    setSets(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const logGym = () => {
    if (!exercise) return showToast('⚠ Enter exercise!', '#f43f5e');
    const log: GymLog = {
      id: Date.now(),
      exercise,
      muscle,
      notes,
      sets: [...sets],
      date: new Date().toDateString(),
      ts: Date.now()
    };
    setState(prev => ({ ...prev, gym: [...prev.gym, log] }));
    setExercise('');
    setNotes('');
    setSets([{ reps: 10, weight: 60 }]);
    gainXP(15, 25);
    showToast('💪 +15 XP  +25 PTS');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1">
        {['log', 'history', 'prs', 'stats'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
              subTab === t ? "bg-hunter-green text-black shadow-lg" : "text-hunter-text3 hover:text-hunter-text2"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {subTab === 'log' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-green/30">
            <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-green uppercase">TRAINING CHAMBER</div>
            </div>
          </div>

          <div className="hunter-card p-4 border-hunter-green/30">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-[3px] h-[11px] bg-hunter-green rounded-[2px]" />
                LOG EXERCISE
              </div>
              <div className="text-[8px] opacity-50">SYSTEM ID: {Date.now().toString().slice(-6)}</div>
            </div>
            <div className="space-y-4">
              <input 
                type="text" className="hunter-input" placeholder="Exercise (e.g. Bench Press)" 
                value={exercise} onChange={e => setExercise(e.target.value)} 
              />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[9px] text-hunter-text3 tracking-widest uppercase">SETS CONFIGURATION</div>
                  <button onClick={addSet} className="text-[9px] text-hunter-green hover:underline uppercase font-bold">+ Add Set</button>
                </div>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {sets.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 bg-hunter-s1/50 border border-hunter-b1 rounded-lg p-2">
                      <div className="w-6 h-6 rounded bg-hunter-b2 flex items-center justify-center text-[10px] font-bold text-hunter-text3">{i+1}</div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 bg-hunter-b2/50 rounded px-2 py-1">
                          <span className="text-[8px] text-hunter-text3 uppercase">KG</span>
                          <input 
                            type="number" className="bg-transparent w-full text-xs font-mono text-hunter-green outline-none" 
                            value={s.weight} onChange={e => updateSet(i, 'weight', Number(e.target.value))} 
                          />
                        </div>
                        <div className="flex items-center gap-1.5 bg-hunter-b2/50 rounded px-2 py-1">
                          <span className="text-[8px] text-hunter-text3 uppercase">REPS</span>
                          <input 
                            type="number" className="bg-transparent w-full text-xs font-mono text-hunter-cyan outline-none" 
                            value={s.reps} onChange={e => updateSet(i, 'reps', Number(e.target.value))} 
                          />
                        </div>
                      </div>
                      {sets.length > 1 && (
                        <button onClick={() => removeSet(i)} className="text-hunter-red opacity-50 hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select className="hunter-input" value={muscle} onChange={e => setMuscle(e.target.value)}>
                  <option>Chest</option><option>Back</option><option>Shoulders</option><option>Arms</option><option>Legs</option><option>Core</option><option>Full Body</option>
                </select>
                <input type="text" className="hunter-input" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <button className="hunter-btn bg-hunter-green text-black w-full shadow-lg font-black tracking-widest" onClick={logGym}>
                EXECUTE LOG (+15 XP, +25 PTS)
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {subTab === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {state.gym.length > 0 && (
            <div className="hunter-card p-3 h-[150px] border-hunter-green/20">
              <div className="text-[9px] text-hunter-text3 mb-2 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={10} className="text-hunter-green" />
                DAILY VOLUME (KG)
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={state.gym.slice(-7).map(g => ({
                  date: g.date.split(' ').slice(1, 3).join(' '),
                  volume: g.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '9px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="hunter-card overflow-hidden border-hunter-b1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-hunter-s1 border-b border-hunter-b1">
                  <th className="p-2 text-[9px] font-bold text-hunter-text3 uppercase tracking-widest">Date</th>
                  <th className="p-2 text-[9px] font-bold text-hunter-text3 uppercase tracking-widest">Exercise</th>
                  <th className="p-2 text-[9px] font-bold text-hunter-text3 uppercase tracking-widest">Sets</th>
                  <th className="p-2 text-[9px] font-bold text-hunter-text3 uppercase tracking-widest text-right">Max</th>
                </tr>
              </thead>
              <tbody>
                {state.gym.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-hunter-text3 text-xs italic">
                      No training data found in the archives.
                    </td>
                  </tr>
                ) : (
                  [...state.gym].reverse().map((g, i) => {
                    const maxWeight = Math.max(...g.sets.map(s => s.weight));
                    return (
                      <tr key={i} className="border-b border-hunter-b1/50 hover:bg-white/5 transition-colors">
                        <td className="p-2 font-mono text-[9px] text-hunter-text3">{g.date.split(' ').slice(1, 3).join(' ')}</td>
                        <td className="p-2">
                          <div className="text-[11px] font-bold text-white">{g.exercise}</div>
                          <div className="text-[8px] text-hunter-cyan uppercase tracking-tighter">{g.muscle}</div>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1 flex-wrap">
                            {g.sets.map((s, idx) => (
                              <span key={idx} className="text-[8px] px-1 rounded bg-hunter-b2 text-hunter-text2">
                                {s.weight}×{s.reps}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2 text-right font-mono text-[11px] font-bold text-hunter-gold">
                          {maxWeight}kg
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {subTab === 'prs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mt-4">PERSONAL RECORDS</div>
          {(Object.values(state.gym.reduce((acc: Record<string, GymLog>, curr: GymLog) => {
            const maxWeight = Math.max(...curr.sets.map(s => s.weight));
            if (!acc[curr.exercise] || maxWeight > Math.max(...acc[curr.exercise].sets.map(s => s.weight))) acc[curr.exercise] = curr;
            return acc;
          }, {})) as GymLog[]).map((g, i) => {
            const maxWeight = Math.max(...g.sets.map(s => s.weight));
            return (
              <div key={i} className="hunter-card p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">{g.exercise}</div>
                  <div className="text-[9px] text-hunter-text3">{g.muscle} • {g.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg text-hunter-gold">{maxWeight}kg</div>
                  <div className="text-[9px] text-hunter-text3">{g.sets.length} Sets</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
      {subTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mt-4 flex items-center gap-2">
            <TrendingUp size={12} className="text-hunter-green" />
            PROGRESSION ANALYSIS
          </div>
          
          {state.gym.length < 2 ? (
            <div className="hunter-card p-8 text-center text-hunter-text3">
              <ChartIcon className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">Log at least 2 sessions to see progress</div>
            </div>
          ) : (() => {
            // Group by exercise and find the one with most logs
            const exerciseCounts = state.gym.reduce((acc: Record<string, number>, curr) => {
              acc[curr.exercise] = (acc[curr.exercise] || 0) + 1;
              return acc;
            }, {});
            const topExercise = Object.entries(exerciseCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0];
            
            const chartData = state.gym
              .filter(g => g.exercise === topExercise)
              .sort((a, b) => a.ts - b.ts)
              .map(g => ({
                date: g.date.split(' ').slice(1, 3).join(' '),
                weight: Math.max(...g.sets.map(s => s.weight))
              }));

            return (
              <div className="space-y-4">
                <div className="hunter-card p-4 h-[250px] border-hunter-green/20">
                  <div className="text-[10px] text-hunter-text3 mb-4 uppercase tracking-widest">
                    Weight Progress: <span className="text-hunter-green">{topExercise}</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="date" 
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
                        unit="kg"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        dot={{ fill: '#10b981', r: 4 }} 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="hunter-card p-3 border-hunter-cyan/20">
                    <div className="text-[8px] text-hunter-text3 uppercase mb-1">Total Sessions</div>
                    <div className="text-xl font-black text-hunter-cyan">{state.gym.length}</div>
                  </div>
                  <div className="hunter-card p-3 border-hunter-gold/20">
                    <div className="text-[8px] text-hunter-text3 uppercase mb-1">Unique Exercises</div>
                    <div className="text-xl font-black text-hunter-gold">{Object.keys(exerciseCounts).length}</div>
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
