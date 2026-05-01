import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CircleDollarSign, TrendingUp, History } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Investment, AppState } from '../types';

interface InvestProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  subTab: string;
  setSubTab: (sub: string) => void;
  gainXP: (xp: number, pts: number) => void;
  showToast: (msg: string, color?: string) => void;
}

export const Invest: React.FC<InvestProps> = ({ state, setState, subTab, setSubTab, gainXP, showToast }) => {
  const [newInv, setNewInv] = useState({ name: '', amount: 5000, type: 'Mutual Fund', notes: '' });

  const logInvest = () => {
    if (!newInv.name || !newInv.amount) return showToast('⚠ Fill all fields!', '#f43f5e');
    const month = new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    const inv: Investment = {
      id: Date.now(),
      ...newInv,
      date: new Date().toDateString(),
      month,
      ts: Date.now()
    };
    setState(prev => ({ ...prev, investments: [...prev.investments, inv] }));
    setNewInv({ name: '', amount: 5000, type: 'Mutual Fund', notes: '' });
    gainXP(10, 15);
    showToast('💰 +10 XP  +15 PTS');
  };

  const totalInvested = state.investments.reduce((acc, i) => acc + i.amount, 0);
  const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  const monthInvested = state.investments.filter(i => i.month === currentMonth).reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1">
        {['add', 'portfolio'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
              subTab === t ? "bg-hunter-gold text-black shadow-lg" : "text-hunter-text3 hover:text-hunter-text2"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {subTab === 'add' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-gold/30">
            <img src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-gold uppercase">FINANCIAL DOMAIN</div>
            </div>
          </div>

          <div className="hunter-card p-4 border-hunter-gold/30">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mb-3 flex items-center gap-1.5">
              <div className="w-[3px] h-[11px] bg-hunter-gold rounded-[2px]" />
              LOG INVESTMENT
            </div>
            <div className="space-y-3">
            <input 
              type="text" className="hunter-input" placeholder="Asset Name (e.g. Nifty 50)" 
              value={newInv.name} onChange={e => setNewInv(prev => ({ ...prev, name: e.target.value }))} 
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[8px] text-hunter-text3 uppercase mb-1">Amount (₹)</div>
                <input type="number" className="hunter-input" value={newInv.amount} onChange={e => setNewInv(prev => ({ ...prev, amount: Number(e.target.value) }))} />
              </div>
              <div>
                <div className="text-[8px] text-hunter-text3 uppercase mb-1">Type</div>
                <select className="hunter-input" value={newInv.type} onChange={e => setNewInv(prev => ({ ...prev, type: e.target.value }))}>
                  <option>Mutual Fund</option><option>Stock</option><option>Crypto</option><option>FD / RD</option><option>PPF / NPS</option><option>Gold</option>
                </select>
              </div>
            </div>
            <input type="text" className="hunter-input" placeholder="Notes" value={newInv.notes} onChange={e => setNewInv(prev => ({ ...prev, notes: e.target.value }))} />
            <button className="hunter-btn bg-hunter-gold text-black w-full shadow-lg" onClick={logInvest}>LOG (+10 XP, +15 PTS)</button>
          </div>
        </div>
      </motion.div>
      )}

      {subTab === 'portfolio' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="hunter-card p-4 border-hunter-gold/30 flex justify-between items-center">
            <div>
              <div className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1">TOTAL INVESTED</div>
              <div className="font-mono text-xl font-bold text-hunter-gold">₹{totalInvested.toLocaleString('en-IN')}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1">THIS MONTH</div>
              <div className="font-mono text-sm font-bold text-white">₹{monthInvested.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {state.investments.length === 0 ? (
            <div className="text-center py-10 text-hunter-text3">
              <TrendingUp className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No investments logged</div>
            </div>
          ) : (
            [...state.investments].reverse().map((i, idx) => (
              <div key={idx} className="hunter-card p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">{i.name}</div>
                  <div className="text-[9px] text-hunter-text3">{i.type} • {i.date}</div>
                </div>
                <div className="font-mono text-base font-bold text-hunter-gold">₹{i.amount.toLocaleString('en-IN')}</div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};
