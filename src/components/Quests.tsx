import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Check, Trash2, Plus, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Quest, AppState } from '../types';

interface QuestsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  subTab: string;
  setSubTab: (sub: string) => void;
  gainXP: (xp: number, pts: number) => void;
  showToast: (msg: string, color?: string) => void;
}

export const Quests: React.FC<QuestsProps> = ({ state, setState, subTab, setSubTab, gainXP, showToast }) => {
  const [newQuest, setNewQuest] = useState({ title: '', desc: '', type: 'daily', prio: 'Normal', xp: 100, pts: 50, target: 1, deadline: '' });
  const [completingQuestId, setCompletingQuestId] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');

  const addQuest = () => {
    if (!newQuest.title) return showToast('⚠ Enter quest title!', '#f43f5e');
    const quest: Quest = {
      id: Date.now(),
      ...newQuest,
      progress: 0,
      done: false,
      created: Date.now()
    };
    setState(prev => ({ ...prev, quests: [...prev.quests, quest] }));
    setNewQuest({ title: '', desc: '', type: 'daily', prio: 'Normal', xp: 100, pts: 50, target: 1, deadline: '' });
    showToast('🎯 Quest created!');
    setSubTab('active');
  };

  const completeQuest = (id: number) => {
    const q = state.quests.find(x => x.id === id);
    if (!q || q.done) return;
    setCompletingQuestId(id);
    setReflection('');
  };

  const submitCompletion = () => {
    if (!completingQuestId) return;
    if (!reflection.trim()) return showToast('⚠ System requires a completion report!', '#f43f5e');

    const q = state.quests.find(x => x.id === completingQuestId);
    if (!q) return;

    setState(prev => ({
      ...prev,
      quests: prev.quests.map(x => x.id === completingQuestId ? { 
        ...x, 
        done: true, 
        progress: x.target, 
        reflection: reflection.trim(),
        completedAt: Date.now() 
      } : x)
    }));
    gainXP(q.xp, q.pts);
    showToast(`✨ +${q.xp} XP  +${q.pts} PTS — QUEST COMPLETE!`, '#f5a623');
    setCompletingQuestId(null);
  };

  const updateProgress = (id: number, val: number) => {
    const q = state.quests.find(x => x.id === id);
    if (!q) return;
    const progress = Math.min(q.target, Math.max(0, val));
    if (progress >= q.target && !q.done) {
      completeQuest(id);
    } else {
      setState(prev => ({
        ...prev,
        quests: prev.quests.map(x => x.id === id ? { ...x, progress } : x)
      }));
    }
  };

  const renderQuestList = (quests: Quest[], isDone: boolean) => {
    if (quests.length === 0) return (
      <div className="text-center py-10 text-hunter-text3">
        <Target className="mx-auto mb-2 opacity-20" size={40} />
        <div className="text-sm">No quests here</div>
      </div>
    );

    return quests.map(q => (
      <div key={q.id} className={cn("hunter-card p-3 border-l-4", q.type === 'learning' ? 'border-l-hunter-purple' : q.prio === 'Urgent' ? 'border-l-hunter-red' : 'border-l-hunter-blue')}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className={cn("text-sm font-bold text-white", isDone && "line-through text-hunter-text3")}>{q.title}</div>
            <div className="text-[10px] text-hunter-text3">{q.desc}</div>
          </div>
          {!isDone ? (
            <button onClick={() => completeQuest(q.id)} className="hunter-btn bg-hunter-green text-white p-1.5 rounded-lg">
              <Check size={14} />
            </button>
          ) : (
            <span className="hunter-badge bg-hunter-green/10 text-hunter-green">DONE</span>
          )}
        </div>

        {q.instructions && q.instructions.length > 0 && (
          <div className="mt-2 mb-3">
            <div className="text-[8px] text-hunter-text3 uppercase tracking-widest font-black mb-1">SYSTEM INSTRUCTIONS</div>
            <ul className="space-y-1 ml-4 list-disc">
              {q.instructions.map((inst, i) => (
                <li key={i} className="text-[10px] text-hunter-text2 leading-relaxed">{inst}</li>
              ))}
            </ul>
          </div>
        )}

        {q.reflection && isDone && (
          <div className="mt-2 mb-3">
            <div className="text-[8px] text-hunter-gold uppercase tracking-widest font-black mb-1">BATTLE REPORT (DATA LOG)</div>
            <div className="p-2 bg-hunter-gold/5 border-l-2 border-hunter-gold rounded-r italic text-[10px] text-white leading-relaxed">
              "{q.reflection}"
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="hunter-badge bg-hunter-blue/10 text-hunter-blue">{q.type}</span>
          {q.prio === 'Urgent' && <span className="hunter-badge bg-hunter-red/10 text-hunter-red">URGENT</span>}
          <span className="font-mono text-[10px] text-hunter-gold">+{q.xp} XP  +{q.pts} PTS</span>
        </div>
        <div className="h-1 bg-hunter-b1 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-hunter-blue transition-all duration-500" style={{ width: `${(q.progress / q.target) * 100}%` }} />
        </div>
        {!isDone && (
          <div className="flex items-center gap-2">
            <input 
              type="number" value={q.progress} min="0" max={q.target} 
              onChange={e => updateProgress(q.id, Number(e.target.value))}
              className="w-12 bg-hunter-s1 border border-hunter-b2 rounded px-1.5 py-0.5 text-xs text-white"
            />
            <span className="text-[10px] text-hunter-text3">/ {q.target}</span>
            <button onClick={() => setState(prev => ({ ...prev, quests: prev.quests.filter(x => x.id !== q.id) }))} className="ml-auto text-hunter-text3 hover:text-hunter-red">
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1">
        {['active', 'done'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
              subTab === t ? "bg-hunter-purple text-white shadow-lg" : "text-hunter-text3 hover:text-hunter-text2"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {subTab === 'active' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">{renderQuestList(state.quests.filter(q => !q.done), false)}</motion.div>}
      {subTab === 'done' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">{renderQuestList(state.quests.filter(q => q.done), true)}</motion.div>}
      
      <AnimatePresence>
        {completingQuestId && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="hunter-card w-full max-w-md p-6 border-hunter-gold/50"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="font-display text-lg font-black text-hunter-gold tracking-widest uppercase">QUEST CLEARED?</div>
                <button onClick={() => setCompletingQuestId(null)} className="text-hunter-text3 hover:text-white"><X size={20} /></button>
              </div>
              
              <div className="text-xs text-hunter-text2 mb-4">
                {state.quests.find(x => x.id === completingQuestId)?.title}
              </div>

              <div className="text-[9px] text-hunter-blue font-bold tracking-widest uppercase mb-2">SYSTEM REQUIREMENT: BATTLE REPORT</div>
              <textarea 
                className="hunter-input min-h-[120px] italic text-sm mb-6"
                placeholder="Hunter, detail exactly how you conquered this quest..."
                value={reflection}
                onChange={e => setReflection(e.target.value)}
              />

              <div className="flex gap-3">
                <button 
                  className="hunter-btn flex-1 bg-hunter-s3 text-hunter-text3 border border-hunter-b2"
                  onClick={() => setCompletingQuestId(null)}
                >
                  CANCEL
                </button>
                <button 
                  className="hunter-btn flex-[2] bg-hunter-gold text-black shadow-lg shadow-hunter-gold/20"
                  onClick={submitCompletion}
                >
                  SUBMIT & CLAIM REWARD
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
