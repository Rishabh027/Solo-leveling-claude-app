import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AppState, TimerSession } from '../types';

interface TimerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  gainXP: (xp: number, pts: number) => void;
  showToast: (msg: string, color?: string) => void;
}

export const Timer: React.FC<TimerProps> = ({ state, setState, gainXP, showToast }) => {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      const session: TimerSession = {
        id: Math.random().toString(36).substr(2, 9),
        label: label || 'Focus Session',
        mins: duration,
        date: new Date().toDateString(),
        ts: Date.now()
      };
      setState(prev => ({ ...prev, timerSessions: [...prev.timerSessions, session] }));
      gainXP(duration, duration * 2);
      showToast(`🎉 Session complete! +${duration} XP`, '#f5a623');
      setLabel('');
      setTimeLeft(duration * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, duration, label, setState, gainXP, showToast]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 65;
  const progress = (duration * 60 - timeLeft) / (duration * 60);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="bg-hunter-s2 border border-hunter-b2 rounded-2xl p-6 text-center">
        <div className="relative w-[150px] h-[150px] mx-auto mb-4">
          <svg width="150" height="150" viewBox="0 0 150 150" className="absolute inset-0">
            <circle cx="75" cy="75" r="65" fill="none" stroke="#1a1a2e" strokeWidth="8" />
            <circle 
              cx="75" cy="75" r="65" fill="none" 
              stroke={timeLeft < 60 ? "var(--color-hunter-red)" : "var(--color-hunter-blue)"} 
              strokeWidth="8" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 linear"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '75px 75px' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-3xl font-black text-white">{formatTime(timeLeft)}</div>
            <div className="text-[9px] text-hunter-text3 tracking-widest uppercase">FOCUS</div>
          </div>
        </div>
        <input 
          type="text" className="hunter-input text-center mb-4" 
          placeholder="What are you focusing on?" 
          value={label} onChange={e => setLabel(e.target.value)}
        />
        <div className="flex gap-2">
          <button 
            className={cn("hunter-btn flex-1 shadow-lg flex items-center justify-center gap-2", isRunning ? "bg-hunter-s4 text-white" : "bg-hunter-blue text-white")}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />} {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button className="hunter-btn bg-hunter-s1 border border-hunter-b3 text-hunter-text2" onClick={() => { setIsRunning(false); setTimeLeft(duration * 60); }}>
            <RotateCcw size={16} />
          </button>
          <select className="hunter-input w-20 px-2" value={duration} onChange={e => { setDuration(Number(e.target.value)); setTimeLeft(Number(e.target.value) * 60); setIsRunning(false); }}>
            <option value={25}>25m</option><option value={50}>50m</option><option value={90}>90m</option><option value={10}>10m</option>
          </select>
        </div>
      </div>
      {state.timerSessions.length > 0 && (
        <div className="space-y-2">
          <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 flex items-center gap-1.5">
            <div className="w-[3px] h-[11px] bg-hunter-cyan rounded-[2px]" /> TODAY'S SESSIONS
          </div>
          {state.timerSessions.filter(s => s.date === new Date().toDateString()).map(s => (
            <div key={s.id} className="flex items-center gap-3 bg-hunter-s3 border border-hunter-b1 rounded-xl p-3">
              <div className="font-mono text-xs text-hunter-cyan w-12 shrink-0">{s.mins}m</div>
              <div className="text-sm font-medium text-white">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
