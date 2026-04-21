import React from 'react';
import { motion } from 'motion/react';
import { Zap, TrendingUp, BarChart2, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, startOfWeek, addDays, isSameDay, subDays } from 'date-fns';
import { AppState, Rank } from '../types';
import { SL_QUOTES, RANKS, CAT_COLORS, CAT_LABELS, SYSTEM_QUESTS_90 } from '../constants';
import { Badge, Card, SectionTitle } from './Common';
import { cn } from '@/src/lib/utils';

interface DashboardProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  rank: Rank;
  nextRank: Rank | null;
  totalHoursToday: number;
  pieData: { name: string, value: number }[];
  calcHours: (from: string, to: string) => number;
  showToast: (msg: string, color?: string) => void;
  acceptDailySystemQuest: () => void;
}

export const Dashboard = ({ 
  state, setState, rank, nextRank, 
  totalHoursToday, pieData, calcHours, showToast,
  acceptDailySystemQuest
}: DashboardProps) => {
  const quote = SL_QUOTES[Math.floor(Date.now() / 86400000) % SL_QUOTES.length];
  const todayStr = format(new Date(), 'EEE MMM dd yyyy');
  const hasAcceptedSystemQuest = state.lastQuestDate === todayStr;
  const currentDay = Number(state.systemDay) || 1;
  const currentSystemQuest = hasAcceptedSystemQuest 
    ? SYSTEM_QUESTS_90[Math.max(0, (currentDay - 2) % 90)]
    : SYSTEM_QUESTS_90[Math.max(0, (currentDay - 1) % 90)];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <div className="relative h-[140px] rounded-2xl overflow-hidden border border-hunter-b2 bg-gradient-to-br from-[#050520] to-[#0a0a30]">
        <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1510511459019-5dee667ff18b?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050514]/90 via-[#050514]/40 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <div className="text-xs text-hunter-text2 italic mb-1 line-clamp-2">"{quote.q}"</div>
          <div className="text-[10px] text-hunter-blue tracking-[2px] uppercase">— {quote.by}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-hunter-gold/10 border border-hunter-gold/20 rounded-xl p-3">
        <div className="text-3xl animate-pulse">🔥</div>
        <div className="flex-1">
          <div className="font-display text-2xl font-black text-hunter-gold">{state.streak}</div>
          <div className="text-[9px] text-hunter-gold tracking-[2px] uppercase">Day Streak</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-hunter-text3">Best</div>
          <div className="font-mono text-sm text-hunter-gold">{state.bestStreak}</div>
        </div>
      </div>

      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-display text-[10px] font-bold text-hunter-blue tracking-widest">RANK PROGRESSION</div>
          <Badge variant="gold">{nextRank ? `${nextRank.r}-Rank at ${nextRank.minXP} XP` : 'MAX RANK'}</Badge>
        </div>
        <div className="flex items-center relative py-2">
          {RANKS.map((r, i) => (
            <div key={r.r} className="flex-1 flex flex-col items-center gap-1 relative z-10">
              <div className={cn(
                "w-7 h-7 rounded-full border-2 flex items-center justify-center font-display text-[10px] font-bold transition-all duration-500",
                state.xp >= r.minXP ? (r.r === rank.r ? "bg-hunter-gold border-hunter-gold text-black shadow-[0_0_15px_rgba(245,166,35,0.6)]" : "bg-hunter-blue/20 border-hunter-blue text-hunter-blue") : "bg-hunter-s1 border-hunter-b2 text-hunter-text3"
              )}>
                {r.r}
              </div>
              <div className="text-[8px] text-hunter-text3 tracking-wider">{r.r}</div>
              {i < RANKS.length - 1 && (
                <div className="absolute left-[50%] top-[14px] w-full h-[2px] bg-hunter-b1 -z-10" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <SectionTitle>TIME DISTRIBUTION TODAY</SectionTitle>
      <Card className="p-3">
        <div className="flex items-center gap-4">
          <div className="w-[110px] h-[110px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={35}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CAT_COLORS[entry.name] || '#3d4566'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="font-mono text-lg font-bold text-white">{totalHoursToday.toFixed(1)}h</div>
              <div className="text-[8px] text-hunter-text3 tracking-widest uppercase">today</div>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CAT_COLORS[d.name] }} />
                <div className="flex-1 text-[11px] text-hunter-text2 capitalize">{CAT_LABELS[d.name] || d.name}</div>
                <div className="font-mono text-[11px] text-hunter-text3">{d.value.toFixed(1)}h</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {totalHoursToday < 12 && (
        <div className="bg-hunter-red/10 border border-hunter-red/30 rounded-xl p-3 flex items-center gap-3">
          <Info className="text-hunter-red" size={20} />
          <div className="text-[10px] text-hunter-text2">
            Target 18h of total logs to avoid the <span className="text-hunter-red font-bold">Incomplete Logs Penalty</span>.
          </div>
        </div>
      )}

      <SectionTitle>WEEKLY ACTIVITY LEVEL</SectionTitle>
      <Card className="p-3 h-[180px]">
        {(() => {
          const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const date = subDays(new Date(), 6 - i);
            const dayActs = state.activities.filter(a => isSameDay(new Date(a.ts), date));
            
            const productive = dayActs
              .filter(a => ['deep', 'health', 'learn', 'project', 'social', 'creative'].includes(a.cat))
              .reduce((acc, a) => acc + calcHours(a.from, a.to), 0);
            
            const slack = dayActs
              .filter(a => a.cat === 'slack')
              .reduce((acc, a) => acc + calcHours(a.from, a.to), 0);
            
            const other = dayActs
              .filter(a => !['deep', 'health', 'learn', 'project', 'social', 'creative', 'slack'].includes(a.cat))
              .reduce((acc, a) => acc + calcHours(a.from, a.to), 0);

            return {
              name: format(date, 'EEE'),
              productive: Number(productive.toFixed(1)),
              slack: Number(slack.toFixed(1)),
              other: Number(other.toFixed(1))
            };
          });

          return (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
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
                  unit="h"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }}
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', marginTop: '10px' }} />
                <Bar dataKey="productive" stackId="a" fill="#10b981" name="Productive" radius={0} />
                <Bar dataKey="other" stackId="a" fill="#3d4566" name="Other" radius={0} />
                <Bar dataKey="slack" stackId="a" fill="#ef4444" name="Slack Off" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          );
        })()}
      </Card>

      <SectionTitle>SYSTEM DIRECTIVE</SectionTitle>
      <Card className={cn(
        "p-4 relative overflow-hidden transition-all",
        hasAcceptedSystemQuest ? "border-hunter-blue/50 bg-hunter-blue/5" : "border-hunter-gold/50 bg-hunter-gold/5"
      )}>
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Zap size={60} className={hasAcceptedSystemQuest ? "text-hunter-blue" : "text-hunter-gold"} />
        </div>
        <div className="relative z-10">
          <div className={cn(
            "font-display text-[9px] font-black tracking-[2px] mb-1",
            hasAcceptedSystemQuest ? "text-hunter-blue" : "text-hunter-gold"
          )}>
            {hasAcceptedSystemQuest ? `SYSTEM QUEST [DAY ${currentDay - 1}/90]` : `NEW DIRECTIVE PENDING [DAY ${currentDay}/90]`}
          </div>
          <div className="text-sm font-bold text-white mb-1">{currentSystemQuest?.t || 'System Directive'}</div>
          <div className="text-[11px] text-hunter-text2 line-clamp-2 mb-3">{currentSystemQuest?.desc || 'The system is calculating your next directive...'}</div>
          
          <button 
            onClick={acceptDailySystemQuest}
            disabled={hasAcceptedSystemQuest}
            className={cn(
              "hunter-btn w-full text-[10px] py-2 shadow-lg transition-all",
              hasAcceptedSystemQuest 
                ? "bg-hunter-green/20 text-hunter-green border-hunter-green/30 cursor-default" 
                : "bg-hunter-gold text-black shadow-hunter-gold/20"
            )}
          >
            {hasAcceptedSystemQuest ? "⚡ SYSTEM QUEST ACCEPTED" : "⚡ ACCEPT SYSTEM QUEST"}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-hunter-s3 border border-hunter-b1 rounded-xl p-2 text-center">
          <div className="font-mono text-lg font-bold text-hunter-purple">{state.projects.length}</div>
          <div className="text-[8px] text-hunter-text3 tracking-widest uppercase">Projects</div>
        </div>
        <div className="bg-hunter-s3 border border-hunter-b1 rounded-xl p-2 text-center">
          <div className="font-mono text-lg font-bold text-hunter-cyan">₹{Math.round(state.investments.reduce((s, i) => s + i.amount, 0) / 1000)}K</div>
          <div className="text-[8px] text-hunter-text3 tracking-widest uppercase">Invested</div>
        </div>
        <div className="bg-hunter-s3 border border-hunter-b1 rounded-xl p-2 text-center">
          <div className="font-mono text-lg font-bold text-hunter-red">{new Set(state.gym.map(g => g.date)).size}</div>
          <div className="text-[8px] text-hunter-text3 tracking-widest uppercase">Gym Visits</div>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-hunter-b2 mt-2">
        <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop" className="w-full h-32 object-cover opacity-60" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050509] via-transparent to-transparent p-4 flex flex-col justify-end">
          <div className="text-xs text-hunter-text2 italic">"The moment you give up is the moment you lose."</div>
          <div className="text-[9px] text-hunter-blue tracking-[2px] uppercase mt-1">SOLO LEVELING — SYSTEM</div>
        </div>
      </div>
    </motion.div>
  );
};
