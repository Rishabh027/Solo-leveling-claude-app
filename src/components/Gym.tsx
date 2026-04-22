import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Trophy, History, X, LineChart as ChartIcon, TrendingUp, Edit2, Check, Footprints, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GymLog, AppState, BodyweightLog, StepLog } from '../types';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);
  const [historyMuscle, setHistoryMuscle] = useState('Chest');

  // Bodyweight & Steps state
  const [bwExercise, setBwExercise] = useState('Push Ups');
  const [bwReps, setBwReps] = useState(10);
  const [bwSets, setBwSets] = useState(3);
  const [stepCount, setStepCount] = useState(10000);

  const addSet = () => setSets(prev => [...prev, { ...prev[prev.length - 1] }]);
  const removeSet = (idx: number) => setSets(prev => prev.filter((_, i) => i !== idx));
  const updateSet = (idx: number, field: 'reps' | 'weight', val: number) => {
    setSets(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const normalizeName = (name: string) => 
    name.trim().toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const logGym = () => {
    if (!exercise) return showToast('⚠ Enter exercise!', '#f43f5e');
    const normalizedExercise = normalizeName(exercise);
    
    if (editingId) {
      setState(prev => ({
        ...prev,
        gym: prev.gym.map(g => g.id === editingId ? { ...g, exercise: normalizedExercise, muscle, notes, sets: [...sets] } : g)
      }));
      setEditingId(null);
      showToast('⚡ Log Updated');
    } else {
      const log: GymLog = {
        id: Date.now(),
        exercise: normalizedExercise,
        muscle,
        notes,
        sets: [...sets],
        date: new Date().toDateString(),
        ts: Date.now()
      };
      setState(prev => ({ ...prev, gym: [...prev.gym, log] }));
      gainXP(15, 25);
      showToast('💪 +15 XP  +25 PTS');
    }
    
    setExercise('');
    setNotes('');
    setSets([{ reps: 10, weight: 60 }]);
  };

  const editLog = (log: GymLog) => {
    setEditingId(log.id);
    setExercise(log.exercise);
    setMuscle(log.muscle);
    setNotes(log.notes);
    setSets([...log.sets]);
    setSubTab('log');
  };

  const logBodyweight = () => {
    const log: BodyweightLog = {
      id: Date.now(),
      exercise: bwExercise,
      reps: bwReps,
      sets: bwSets,
      date: new Date().toDateString(),
      ts: Date.now()
    };
    setState(prev => ({ ...prev, bodyweight: [...(prev.bodyweight || []), log] }));
    gainXP(10, 15);
    showToast('🤸 Bodyweight Logged!');
  };

  const logSteps = () => {
    const log: StepLog = {
      id: Date.now(),
      steps: stepCount,
      date: new Date().toDateString(),
      ts: Date.now()
    };
    setState(prev => ({ ...prev, steps: [...(prev.steps || []), log] }));
    gainXP(10, 20);
    showToast('👟 Steps Recorded!');
  };

  const [selectedMuscle, setSelectedMuscle] = useState('Chest');

  // Grouped charts data
  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  
  const chartDataByMuscle = useMemo(() => {
    const groups: Record<string, { data: any[], exercises: string[] }> = {};
    muscleGroups.forEach(m => {
      const logs = state.gym
        .filter(g => g.muscle === m)
        .sort((a, b) => a.ts - b.ts);
      
      const dailyData: Record<string, any> = {};
      const exSet = new Set<string>();

      logs.forEach(l => {
        const date = l.date.split(' ').slice(1, 3).join(' ');
        const name = normalizeName(l.exercise);
        exSet.add(name);
        
        const vol = l.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
        if (!dailyData[date]) {
          dailyData[date] = { date };
        }
        dailyData[date][name] = (dailyData[date][name] || 0) + vol;
      });

      groups[m] = {
        data: Object.values(dailyData),
        exercises: Array.from(exSet)
      };
    });
    return groups;
  }, [state.gym, muscleGroups]);

  const exerciseCharts = useMemo(() => {
    const exercises: Record<string, any[]> = {};
    const logs = state.gym
      .filter(g => g.muscle === selectedMuscle)
      .sort((a, b) => a.ts - b.ts);
    
    logs.forEach(l => {
      const name = normalizeName(l.exercise);
      if (!exercises[name]) exercises[name] = [];
      const date = l.date.split(' ').slice(1, 3).join(' ');
      
      // Find the best set (prioritize weight then reps)
      let bestSet = l.sets[0];
      l.sets.forEach(s => {
        if (s.weight > bestSet.weight) {
          bestSet = s;
        } else if (s.weight === bestSet.weight && s.reps > bestSet.reps) {
          bestSet = s;
        }
      });

      exercises[name].push({ 
        date, 
        weight: bestSet.weight, 
        reps: bestSet.reps 
      });
    });
    return exercises;
  }, [state.gym, selectedMuscle]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1 overflow-x-auto no-scrollbar">
        {['log', 'bodyweight', 'history', 'prs', 'stats'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "flex-1 min-w-[80px] py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
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
              <div className="text-xs font-black tracking-[4px] text-hunter-green uppercase">
                {editingId ? 'RECALIBRATING LOG' : 'TRAINING CHAMBER'}
              </div>
            </div>
          </div>

          <div className="hunter-card p-4 border-hunter-green/30">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-[3px] h-[11px] bg-hunter-green rounded-[2px]" />
                {editingId ? 'EDIT ENTRY' : 'LOG EXERCISE'}
              </div>
              {editingId && (
                <button onClick={() => { setEditingId(null); setExercise(''); setSets([{reps:10, weight:60}]); }} className="text-hunter-red text-[8px] uppercase font-bold">Cancel Edit</button>
              )}
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
                  {muscleGroups.map(m => <option key={m}>{m}</option>)}
                  <option>Full Body</option>
                </select>
                <input type="text" className="hunter-input" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <button className="hunter-btn bg-hunter-green text-black w-full shadow-lg font-black tracking-widest" onClick={logGym}>
                {editingId ? 'UPDATE LOG' : 'EXECUTE LOG (+15 XP, +25 PTS)'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {subTab === 'bodyweight' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="hunter-card p-4 border-hunter-cyan/30">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mb-3 flex items-center gap-1.5">
              <User size={12} className="text-hunter-cyan" />
              BODYWEIGHT CALISTHENICS
            </div>
            <div className="space-y-3">
              <select className="hunter-input" value={bwExercise} onChange={e => setBwExercise(e.target.value)}>
                <option>Push Ups</option><option>Pull Ups</option><option>Crunches</option><option>Squats</option><option>Plank (sec)</option><option>Dips</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[8px] text-hunter-text3 uppercase mb-1">Sets</div>
                  <input type="number" className="hunter-input" value={bwSets} onChange={e => setBwSets(Number(e.target.value))} />
                </div>
                <div>
                  <div className="text-[8px] text-hunter-text3 uppercase mb-1">Reps / Sec</div>
                  <input type="number" className="hunter-input" value={bwReps} onChange={e => setBwReps(Number(e.target.value))} />
                </div>
              </div>
              <button className="hunter-btn bg-hunter-cyan text-black w-full" onClick={logBodyweight}>
                LOG BODYWEIGHT (+10 XP)
              </button>
            </div>
          </div>

          <div className="hunter-card p-4 border-hunter-gold/30">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mb-3 flex items-center gap-1.5">
              <Footprints size={12} className="text-hunter-gold" />
              DAILY STEPS (TREADMILL/OUTDOOR)
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="number" className="hunter-input pl-10" value={stepCount} 
                  onChange={e => setStepCount(Number(e.target.value))} 
                />
                <Footprints className="absolute left-3 top-1/2 -translate-y-1/2 text-hunter-gold opacity-50" size={16} />
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-hunter-text3">Target: 10,000</span>
                <span className={cn(stepCount >= 10000 ? "text-hunter-green" : "text-hunter-gold")}>
                  {((stepCount / 10000) * 100).toFixed(0)}%
                </span>
              </div>
              <button className="hunter-btn bg-hunter-gold text-black w-full" onClick={logSteps}>
                LOG STEPS (+10 XP)
              </button>
            </div>
          </div>

          {state.bodyweight && state.bodyweight.length > 0 && (
            <div className="hunter-card p-3 border-hunter-b1">
              <div className="text-[9px] text-hunter-text3 uppercase tracking-widest mb-2">RECENT CALISTHENICS</div>
              <div className="space-y-2">
                {state.bodyweight.slice(-5).reverse().map(bw => (
                  <div key={bw.id} className="flex justify-between items-center text-xs bg-hunter-s1 p-2 rounded border border-hunter-b1/50">
                    <div>
                      <div className="font-bold">{bw.exercise}</div>
                      <div className="text-[10px] text-hunter-text3">{bw.date}</div>
                    </div>
                    <div className="text-hunter-cyan font-mono">{bw.sets} × {bw.reps}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {subTab === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 flex items-center gap-1.5">
              <History size={12} className="text-hunter-green" />
              ARCHIVE RECORDS
            </div>
            <select 
              className="bg-hunter-s1 border border-hunter-b1 rounded px-2 py-1 text-[10px] text-hunter-text2 outline-none"
              value={historyMuscle}
              onChange={e => setHistoryMuscle(e.target.value)}
            >
              {['All', ...muscleGroups].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            {(() => {
              const filtered = state.gym.filter(g => historyMuscle === 'All' || g.muscle === historyMuscle);
              
              if (filtered.length === 0) {
                return (
                  <div className="hunter-card p-8 text-center text-hunter-text3 text-xs italic border-hunter-b1">
                    No records found for {historyMuscle} in the archives.
                  </div>
                );
              }

              // Group by exercise
              const grouped: Record<string, typeof filtered> = {};
              filtered.forEach(log => {
                const normalizedKey = normalizeName(log.exercise);
                if (!grouped[normalizedKey]) grouped[normalizedKey] = [];
                grouped[normalizedKey].push(log);
              });

              return Object.entries(grouped).map(([exerciseName, logs]) => (
                <div key={exerciseName} className="space-y-2">
                  <div className="flex items-center gap-2 px-2">
                    <div className="h-[1px] flex-1 bg-hunter-b1" />
                    <span className="text-[10px] font-black tracking-[2px] uppercase text-hunter-cyan">{exerciseName}</span>
                    <div className="h-[1px] flex-1 bg-hunter-b1" />
                  </div>
                  
                  <div className="hunter-card overflow-hidden border-hunter-b1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-hunter-s1 border-b border-hunter-b1">
                          <th className="p-2 text-[9px] font-bold text-hunter-text3 uppercase tracking-widest">Date</th>
                          <th className="p-2 text-[9px] font-bold text-hunter-text3 uppercase tracking-widest">Sets & Stats</th>
                          <th className="p-2 text-[9px] font-bold text-hunter-text3 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...logs].sort((a, b) => b.ts - a.ts).map((g) => {
                          const maxWeight = Math.max(...g.sets.map(s => s.weight));
                          const totalVolume = g.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
                          const isExpanded = expandedLogId === g.id;

                          return (
                            <React.Fragment key={g.id}>
                              <tr 
                                onClick={() => setExpandedLogId(isExpanded ? null : g.id)}
                                className={cn(
                                  "border-b border-hunter-b1/50 hover:bg-white/5 transition-colors cursor-pointer",
                                  isExpanded && "bg-white/5 border-hunter-cyan/30"
                                )}
                              >
                                <td className="p-2 font-mono text-[9px] text-hunter-text3">{g.date.split(' ').slice(1, 3).join(' ')}</td>
                                <td className="p-2">
                                  <div className="text-[10px] text-hunter-text2">
                                    <span className="font-bold text-white">{g.sets.length} Sets</span>
                                    <span className="mx-1">•</span>
                                    <span>{maxWeight}kg Max</span>
                                    <span className="mx-1">•</span>
                                    <span className="text-hunter-text3">{totalVolume.toLocaleString()} Vol</span>
                                  </div>
                                </td>
                                <td className="p-2 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); editLog(g); }} 
                                      className="p-1.5 text-hunter-green hover:bg-hunter-green/10 rounded"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
                                      <TrendingUp size={12} className="text-hunter-text3" />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-[#0c0c1a] border-b border-hunter-b1/50">
                                  <td colSpan={3} className="p-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between pb-2 border-b border-hunter-b1/30">
                                        <div className="text-[9px] text-hunter-cyan font-bold tracking-[2px] uppercase">Session Set Ledger</div>
                                        <div className="text-[9px] text-hunter-text3 italic">{g.date}</div>
                                      </div>
                                      
                                      <div className="overflow-hidden border border-hunter-b1/50 rounded-lg">
                                        <table className="w-full text-left text-[10px]">
                                          <thead>
                                            <tr className="bg-hunter-s1/50">
                                              <th className="p-2 text-hunter-text3 uppercase font-black tracking-widest">Set</th>
                                              <th className="p-2 text-hunter-text3 uppercase font-black tracking-widest">Weight</th>
                                              <th className="p-2 text-hunter-text3 uppercase font-black tracking-widest">Reps</th>
                                              <th className="p-2 text-hunter-text3 uppercase font-black tracking-widest text-right">Volume</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {g.sets.map((s, idx) => (
                                              <tr key={idx} className="border-t border-hunter-b1/30">
                                                <td className="p-2 text-hunter-text2 font-bold">{idx + 1}</td>
                                                <td className="p-2 text-hunter-cyan">{s.weight} kg</td>
                                                <td className="p-2 text-hunter-gold">{s.reps}</td>
                                                <td className="p-2 text-right text-hunter-text3 font-mono">{(s.weight * s.reps).toLocaleString()}</td>
                                              </tr>
                                            ))}
                                            <tr className="bg-hunter-s1/30 border-t border-hunter-b1">
                                              <td colSpan={3} className="p-2 text-hunter-text3 uppercase font-bold text-[8px]">Total Session Volume</td>
                                              <td className="p-2 text-right text-hunter-green font-black">
                                                {g.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0).toLocaleString()}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                      {g.notes && (
                                        <div className="bg-hunter-s1/20 p-2 rounded border border-hunter-b1/30 text-[10px] text-hunter-text2 italic">
                                          <span className="text-hunter-blue font-bold uppercase tracking-widest mr-2 non-italic">Logs:</span>
                                          {g.notes}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ));
            })()}
          </div>
          
          {state.steps && state.steps.length > 0 && (
            <div className="hunter-card p-3 border-hunter-gold/30">
              <div className="text-[9px] text-hunter-text3 uppercase tracking-widest mb-2">STEP HISTORY</div>
              <div className="space-y-1">
                {state.steps.slice(-7).reverse().map(s => (
                  <div key={s.id} className="flex justify-between text-xs py-1 border-b border-hunter-b1/30 last:border-0">
                    <span className="text-hunter-text3">{s.date}</span>
                    <span className={cn("font-mono", s.steps >= 10000 ? "text-hunter-green" : "text-hunter-gold")}>
                      {s.steps.toLocaleString()} steps
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {subTab === 'prs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mt-4">PERSONAL RECORDS</div>
          {(Object.values(state.gym.reduce((acc: Record<string, GymLog>, curr: GymLog) => {
            const name = normalizeName(curr.exercise);
            
            // Find best set in current log
            let bestSetCurr = curr.sets[0];
            curr.sets.forEach(s => {
              if (s.weight > bestSetCurr.weight) bestSetCurr = s;
              else if (s.weight === bestSetCurr.weight && s.reps > bestSetCurr.reps) bestSetCurr = s;
            });

            if (!acc[name]) {
              acc[name] = { ...curr, exercise: name };
            } else {
              // Compare with existing best for this exercise
              let bestSetExist = acc[name].sets[0];
              acc[name].sets.forEach(s => {
                if (s.weight > bestSetExist.weight) bestSetExist = s;
                else if (s.weight === bestSetExist.weight && s.reps > bestSetExist.reps) bestSetExist = s;
              });

              if (bestSetCurr.weight > bestSetExist.weight || (bestSetCurr.weight === bestSetExist.weight && bestSetCurr.reps > bestSetExist.reps)) {
                acc[name] = { ...curr, exercise: name };
              }
            }
            return acc;
          }, {})) as GymLog[]).map((g, i) => {
            let bestSet = g.sets[0];
            g.sets.forEach(s => {
              if (s.weight > bestSet.weight) bestSet = s;
              else if (s.weight === bestSet.weight && s.reps > bestSet.reps) bestSet = s;
            });
            return (
              <div key={i} className="hunter-card p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">{g.exercise}</div>
                  <div className="text-[9px] text-hunter-text3">{g.muscle} • {g.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg text-hunter-gold">{bestSet.weight}kg</div>
                  <div className="text-[9px] text-hunter-text3">{bestSet.reps} Reps</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {subTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between mt-4">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 flex items-center gap-2">
              <TrendingUp size={12} className="text-hunter-green" />
              PROGRESSION ANALYSIS
            </div>
            <select 
              className="bg-hunter-s1 border border-hunter-b1 rounded px-2 py-1 text-[10px] text-hunter-text2 outline-none"
              value={selectedMuscle}
              onChange={e => setSelectedMuscle(e.target.value)}
            >
              {muscleGroups.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          {chartDataByMuscle[selectedMuscle]?.data && chartDataByMuscle[selectedMuscle].data.length > 0 ? (
            <div className="space-y-6">
              <div className="hunter-card p-4 h-[250px] border-hunter-green/20">
                <div className="text-[10px] text-hunter-text3 mb-4 uppercase tracking-widest flex justify-between">
                  <span>{selectedMuscle} Group Volume</span>
                  <span className="text-hunter-green font-bold">
                    Atmospheric Evolution
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataByMuscle[selectedMuscle].data}>
                    <defs>
                      {chartDataByMuscle[selectedMuscle].exercises.map((ex, idx) => (
                        <linearGradient key={`grad-${ex}`} id={`color-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={['#10b981', '#4f8ef7', '#b06ef3', '#f5a623', '#22d3ee', '#f43f5e'][idx % 6]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={['#10b981', '#4f8ef7', '#b06ef3', '#f5a623', '#22d3ee', '#f43f5e'][idx % 6]} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '9px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', marginTop: '10px' }} />
                    {chartDataByMuscle[selectedMuscle].exercises.map((ex, idx) => (
                      <Area 
                        key={ex} 
                        type="monotone"
                        dataKey={ex} 
                        stackId="1" 
                        stroke={['#10b981', '#4f8ef7', '#b06ef3', '#f5a623', '#22d3ee', '#f43f5e'][idx % 6]} 
                        fillOpacity={1}
                        fill={`url(#color-${idx})`}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="text-[9px] tracking-[3px] uppercase text-hunter-text3 px-1">TRAINING PROGRESSION ARCHIVES</div>
                  {Object.entries(exerciseCharts).map(([name, data]) => {
                    const chartData = data as { date: string; weight: number; reps: number }[];
                    return (
                      <div key={name} className="hunter-card p-4 h-[220px] border-hunter-cyan/20 bg-gradient-to-br from-bg to-[#0c0c1a]">
                        <div className="text-[10px] text-hunter-text3 mb-4 uppercase tracking-widest flex justify-between">
                          <span className="text-white font-bold">{name}</span>
                          <div className="flex gap-2">
                             <span className="text-hunter-cyan bg-hunter-cyan/10 px-1.5 py-0.5 rounded text-[8px] font-black border border-hunter-cyan/20">PR: {Math.max(...chartData.map(d => d.weight))}kg</span>
                             <span className="text-hunter-gold bg-hunter-gold/10 px-1.5 py-0.5 rounded text-[8px] font-black border border-hunter-gold/20">REPS: {Math.max(...chartData.map(d => d.reps))}</span>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorReps" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f5a623" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '9px' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '8px', textTransform: 'uppercase', marginTop: '10px' }} />
                            <Area yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" />
                            <Area yAxisId="right" type="monotone" dataKey="reps" name="Reps" stroke="#f5a623" strokeWidth={2} fillOpacity={1} fill="url(#colorReps)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="hunter-card p-8 text-center text-hunter-text3">
              <ChartIcon className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No data for {selectedMuscle} yet.</div>
            </div>
          )}

          {state.steps && state.steps.length > 0 && (
            <div className="hunter-card p-4 h-[200px] border-hunter-gold/20">
              <div className="text-[10px] text-hunter-text3 mb-4 uppercase tracking-widest">Step Progression</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={state.steps.slice(-7).map(s => ({
                  date: s.date.split(' ').slice(1, 3).join(' '),
                  steps: s.steps
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '9px' }}
                    itemStyle={{ color: '#f5a623' }}
                  />
                  <Line type="monotone" dataKey="steps" stroke="#f5a623" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
