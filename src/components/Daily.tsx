import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Trash2, Edit2, X } from 'lucide-react';
import { Activity, AppState } from '../types';
import { CAT_LABELS } from '../constants';
import { Badge, Card, SectionTitle } from './Common';
import { Timer } from './Timer';
import { cn } from '@/src/lib/utils';

interface DailyProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  subTab: string;
  setSubTab: (sub: string) => void;
  gainXP: (xp: number, pts: number) => void;
  showToast: (msg: string, color?: string) => void;
  today: string;
  todayActivities: Activity[];
  calcHours: (from: string, to: string) => number;
}

export const Daily = ({ 
  state, setState, subTab, setSubTab, 
  gainXP, showToast, today, todayActivities, calcHours 
}: DailyProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    from: '09:00',
    to: '10:00',
    activity: '',
    cat: 'deep'
  });

  const handleEdit = (act: Activity) => {
    setEditingId(act.id);
    setForm({
      from: act.from,
      to: act.to,
      activity: act.activity,
      cat: act.cat
    });
    setSubTab('log');
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      from: '09:00',
      to: '10:00',
      activity: '',
      cat: 'deep'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1">
        {['log', 'timer', 'today'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
              subTab === t ? "bg-hunter-blue text-white shadow-lg" : "text-hunter-text3 hover:text-hunter-text2"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {subTab === 'log' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-blue/30">
            <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1455391727323-7bbda5ee440a?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-blue uppercase">
                {editingId ? 'RECALIBRATING TIMELINE' : 'DAILY LOGBOOK'}
              </div>
            </div>
          </div>

          <Card variant="blue" className="p-4">
            <div className="flex justify-between items-center mb-4">
              <SectionTitle className="my-0">{editingId ? 'EDIT LOG ENTRY' : 'LOG HOUR BLOCK'}</SectionTitle>
              {editingId && (
                <button onClick={resetForm} className="text-hunter-red text-[10px] font-bold uppercase flex items-center gap-1">
                  <X size={12} /> Cancel
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1">From</div>
                <input 
                  type="time" className="hunter-input" 
                  value={form.from} 
                  onChange={e => setForm(prev => ({ ...prev, from: e.target.value }))} 
                />
              </div>
              <div>
                <div className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1">To</div>
                <input 
                  type="time" className="hunter-input" 
                  value={form.to} 
                  onChange={e => setForm(prev => ({ ...prev, to: e.target.value }))} 
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1">Activity</div>
              <input 
                type="text" className="hunter-input" placeholder="What did you do?" 
                value={form.activity} 
                onChange={e => setForm(prev => ({ ...prev, activity: e.target.value }))} 
              />
            </div>
            <div className="mb-4">
              <div className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1">Category</div>
              <select 
                className="hunter-input" 
                value={form.cat} 
                onChange={e => setForm(prev => ({ ...prev, cat: e.target.value }))}
              >
                <option value="deep">⚡ Deep Work / Focus</option>
                <option value="health">💪 Health & Fitness</option>
                <option value="learn">📚 Learning & Study</option>
                <option value="project">🛠 Project Work</option>
                <option value="admin">📋 Admin & Errands</option>
                <option value="social">🤝 Social & Network</option>
                <option value="creative">🎨 Creative</option>
                <option value="rest">😴 Rest & Recovery</option>
                <option value="chores">🧹 Chores & Maintenance</option>
                <option value="slack">🔴 Slack Off / Doomscroll</option>
              </select>
            </div>
            <button 
              className="hunter-btn bg-hunter-blue text-white w-full shadow-lg"
              onClick={() => {
                if (!form.activity) return showToast('⚠ Enter an activity!', '#f43f5e');
                
                if (editingId) {
                  setState(prev => ({
                    ...prev,
                    activities: prev.activities.map(a => a.id === editingId ? { ...a, ...form } : a)
                  }));
                  showToast('⚡ Log updated!');
                  resetForm();
                } else {
                  const newAct: Activity = {
                    id: Math.random().toString(36).substr(2, 9),
                    ...form,
                    date: today,
                    energy: 2,
                    ts: Date.now()
                  };
                  setState(prev => ({ ...prev, activities: [...prev.activities, newAct] }));
                  
                  if (form.cat === 'slack') {
                    const penaltyXP = 20;
                    const penaltyPts = 30;
                    gainXP(-penaltyXP, -penaltyPts);
                    showToast(`🔴 SLACK DETECTED: -${penaltyXP} XP`, '#f43f5e');
                  } else {
                    gainXP(5, 10);
                    showToast('⚡ Activity logged!');
                  }
                  setForm(prev => ({ ...prev, activity: '' }));
                }
              }}
            >
              {editingId ? 'UPDATE ENTRY' : 'LOG (+5 XP, +10 PTS)'}
            </button>
          </Card>
        </motion.div>
      )}

      {subTab === 'timer' && (
        <Timer 
          state={state} 
          setState={setState} 
          gainXP={gainXP} 
          showToast={showToast} 
        />
      )}

      {subTab === 'today' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {todayActivities.length === 0 ? (
            <div className="text-center py-10 text-hunter-text3">
              <ClipboardList className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No activities today — start logging!</div>
            </div>
          ) : (
            todayActivities.sort((a, b) => a.from.localeCompare(b.from)).map(a => (
              <div key={a.id} className={cn(
                "flex gap-3 bg-hunter-s3 border border-hunter-b1 rounded-xl p-3 border-l-4",
                a.cat === 'slack' ? "border-l-hunter-red" : "border-l-hunter-green"
              )}>
                <div className="font-mono text-[10px] text-hunter-text3 w-16 pt-1">{a.from}–{a.to}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.activity}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={a.cat === 'deep' ? 'blue' : a.cat === 'health' ? 'green' : a.cat === 'slack' ? 'red' : 'purple'}>
                      {CAT_LABELS[a.cat] || a.cat}
                    </Badge>
                    <span className="text-[10px] text-hunter-text3">{calcHours(a.from, a.to).toFixed(1)}h</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(a)}
                    className="text-hunter-text3 hover:text-hunter-blue"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, activities: prev.activities.filter(x => x.id !== a.id) }))}
                    className="text-hunter-text3 hover:text-hunter-red"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};
