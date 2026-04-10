import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gem, Trophy, History, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Reward, RewardHistory, AppState } from '../types';
import { DEFAULT_REWARDS, ACHIEVEMENTS, SYSTEM_SHOP_ITEMS } from '../constants';
import { InventoryItem } from '../types';
import { ShoppingBag, Package } from 'lucide-react';

interface RewardsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  subTab: string;
  setSubTab: (sub: string) => void;
  showToast: (msg: string, color?: string) => void;
  showAchPop: (icon: string, name: string) => void;
}

export const Rewards: React.FC<RewardsProps> = ({ state, setState, subTab, setSubTab, showToast, showAchPop }) => {
  const [newReward, setNewReward] = useState({ name: '', icon: '🎁', cost: 100 });

  const claimReward = (r: Reward) => {
    if (state.pts < r.cost) return showToast('⚠ Not enough points!', '#f43f5e');
    
    const history: RewardHistory = {
      ...r,
      claimedAt: Date.now(),
      date: new Date().toDateString()
    };

    setState(prev => ({
      ...prev,
      pts: prev.pts - r.cost,
      rwHistory: [...prev.rwHistory, history]
    }));

    showToast(`${r.icon} REWARD CLAIMED: ${r.name}`, '#f5a623');
    showAchPop(r.icon, `Reward: ${r.name}`);
  };

  const addReward = () => {
    if (!newReward.name) return showToast('⚠ Enter reward name!', '#f43f5e');
    const reward: Reward = {
      id: Date.now(),
      ...newReward,
      desc: 'Custom reward',
      type: 'custom'
    };
    setState(prev => ({ ...prev, rewards: [...prev.rewards, reward] }));
    setNewReward({ name: '', icon: '🎁', cost: 100 });
    showToast('🎁 Reward added!');
  };

  const buyItem = (item: any) => {
    if (state.pts < item.cost) return showToast('⚠ Not enough gold!', '#f43f5e');
    
    const invItem: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: item.name,
      icon: item.icon,
      desc: item.desc,
      rarity: item.rarity,
      type: item.type,
      acquiredAt: Date.now()
    };

    setState(prev => ({
      ...prev,
      pts: prev.pts - item.cost,
      inventory: [...prev.inventory, invItem]
    }));

    showToast(`⚔️ ACQUIRED: ${item.name}`, '#f5a623');
    showAchPop(item.icon, `Item: ${item.name}`);
  };

  const useItem = (id: string) => {
    const item = state.inventory.find(i => i.id === id);
    if (!item) return;

    if (item.type !== 'Item') {
      showToast('Cannot consume this item.', '#3d4566');
      return;
    }

    if (item.name === 'Healing Potion') {
      setState(prev => ({ ...prev, energy: 4 }));
      showToast('🧪 HP Recovered. Energy at MAX.', '#10b981');
    } else if (item.name === 'Mana Potion') {
      setState(prev => ({ ...prev, xp: prev.xp + 50 }));
      showToast('💧 MP Recovered. +50 XP.', '#4f8ef7');
    }

    setState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.id !== id)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1 overflow-x-auto no-scrollbar">
        {['store', 'shop', 'inventory', 'achievements', 'history'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap",
              subTab === t ? "bg-hunter-gold text-black shadow-lg" : "text-hunter-text3 hover:text-hunter-text2"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {subTab === 'store' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-gold/30 mb-3">
            <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1512428559083-a40ce12b26f0?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-gold uppercase">TREASURE VAULT</div>
            </div>
          </div>

          <div className="hunter-card p-4 border-hunter-gold/30 bg-gradient-to-br from-hunter-s3 to-hunter-s2 flex items-center justify-between">
            <div>
              <div className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1">YOUR BALANCE</div>
              <div className="font-display text-3xl font-black text-hunter-gold">{state.pts.toLocaleString()}</div>
            </div>
            <div className="text-4xl">💎</div>
          </div>

          {[...DEFAULT_REWARDS, ...state.rewards.filter(r => r.type === 'custom')].map(r => (
            <div key={r.id} className="hunter-card p-4 flex items-center gap-4 border-hunter-b2 bg-gradient-to-br from-hunter-s3 to-hunter-s2">
              <div className="text-3xl shrink-0">{r.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{r.name}</div>
                <div className="text-[10px] text-hunter-text3 line-clamp-1">{r.desc}</div>
                <div className="font-mono text-xs text-hunter-gold mt-1">{r.cost.toLocaleString()} pts</div>
                <div className="mt-2">
                  <div className="flex justify-between text-[8px] text-hunter-text3 mb-1">
                    <span>{Math.min(state.pts, r.cost).toLocaleString()} / {r.cost.toLocaleString()}</span>
                    <span>{state.pts >= r.cost ? 'READY!' : Math.round((state.pts / r.cost) * 100) + '%'}</span>
                  </div>
                  <div className="h-1 bg-hunter-b1 rounded-full overflow-hidden">
                    <div className="h-full bg-hunter-gold transition-all duration-500" style={{ width: `${Math.min(100, (state.pts / r.cost) * 100)}%` }} />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => claimReward(r)}
                className={cn("hunter-btn btn-sm shrink-0", state.pts >= r.cost ? "bg-hunter-gold text-black" : "bg-hunter-b3 text-hunter-text3")}
              >
                CLAIM
              </button>
            </div>
          ))}

          <div className="text-[9px] tracking-[2.5px] uppercase text-hunter-text3 mt-4 mb-2">ADD CUSTOM REWARD</div>
          <div className="hunter-card p-4">
            <div className="space-y-3">
              <input type="text" className="hunter-input" placeholder="Reward Name" value={newReward.name} onChange={e => setNewReward(prev => ({ ...prev, name: e.target.value }))} />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" className="hunter-input" placeholder="🎁" maxLength={2} value={newReward.icon} onChange={e => setNewReward(prev => ({ ...prev, icon: e.target.value }))} />
                <input type="number" className="hunter-input" placeholder="Cost" value={newReward.cost} onChange={e => setNewReward(prev => ({ ...prev, cost: Number(e.target.value) }))} />
              </div>
              <button className="hunter-btn bg-hunter-gold text-black w-full shadow-lg" onClick={addReward}>ADD REWARD</button>
            </div>
          </div>
        </motion.div>
      )}

      {subTab === 'shop' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-blue/30 mb-3">
            <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-blue uppercase">SYSTEM SHOP</div>
            </div>
          </div>

          <div className="hunter-card p-4 border-hunter-gold/30 bg-gradient-to-br from-hunter-s3 to-hunter-s2 flex items-center justify-between">
            <div>
              <div className="text-[9px] text-hunter-text3 tracking-widest uppercase mb-1">CURRENT GOLD</div>
              <div className="font-display text-3xl font-black text-hunter-gold">{state.pts.toLocaleString()}</div>
            </div>
            <div className="text-4xl">💰</div>
          </div>

          {SYSTEM_SHOP_ITEMS.map(item => (
            <div key={item.id} className="hunter-card p-4 flex items-center gap-4 border-hunter-b2 bg-gradient-to-br from-hunter-s3 to-hunter-s2">
              <div className="text-3xl shrink-0">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <span className={cn(
                    "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase",
                    item.rarity === 'Common' ? "bg-gray-500/20 text-gray-400" :
                    item.rarity === 'Rare' ? "bg-blue-500/20 text-blue-400" :
                    item.rarity === 'Epic' ? "bg-purple-500/20 text-purple-400" :
                    "bg-hunter-gold/20 text-hunter-gold"
                  )}>
                    {item.rarity}
                  </span>
                </div>
                <div className="text-[10px] text-hunter-text3 line-clamp-1">{item.desc}</div>
                <div className="font-mono text-xs text-hunter-gold mt-1">{item.cost.toLocaleString()} gold</div>
              </div>
              <button 
                onClick={() => buyItem(item)}
                className={cn("hunter-btn btn-sm shrink-0", state.pts >= item.cost ? "bg-hunter-gold text-black" : "bg-hunter-b3 text-hunter-text3")}
              >
                BUY
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {subTab === 'inventory' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-purple/30 mb-3">
            <img src="https://images.weserv.nl/?url=https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-purple uppercase">INVENTORY</div>
            </div>
          </div>

          {state.inventory.length === 0 ? (
            <div className="text-center py-10 text-hunter-text3">
              <Package className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">Your inventory is empty</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {state.inventory.map(item => (
                <div key={item.id} className="hunter-card p-4 flex items-center gap-4 border-hunter-b2 bg-gradient-to-br from-hunter-s3 to-hunter-s2">
                  <div className="text-3xl shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <span className={cn(
                        "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase",
                        item.rarity === 'Common' ? "bg-gray-500/20 text-gray-400" :
                        item.rarity === 'Rare' ? "bg-blue-500/20 text-blue-400" :
                        item.rarity === 'Epic' ? "bg-purple-500/20 text-purple-400" :
                        "bg-hunter-gold/20 text-hunter-gold"
                      )}>
                        {item.rarity}
                      </span>
                    </div>
                    <div className="text-[10px] text-hunter-text3">{item.desc}</div>
                    <div className="text-[9px] text-hunter-text3 mt-1 uppercase tracking-wider">{item.type}</div>
                  </div>
                  {item.type === 'Item' && (
                    <button 
                      onClick={() => useItem(item.id)}
                      className="hunter-btn btn-sm bg-hunter-blue text-white px-4"
                    >
                      USE
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {subTab === 'achievements' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {ACHIEVEMENTS.map(a => {
            const earned = JSON.parse(localStorage.getItem('hunter_os_achs') || '[]').includes(a.id);
            return (
              <div key={a.id} className={cn("hunter-card p-4 flex items-center gap-4 border-hunter-b2", !earned && "opacity-50 grayscale")}>
                <div className="text-3xl shrink-0">{a.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{a.name}</div>
                  <div className="text-[10px] text-hunter-text3">{a.desc}</div>
                  {earned && <div className="text-[9px] text-hunter-green font-bold mt-1">✓ UNLOCKED</div>}
                </div>
                <div className="text-2xl">{earned ? '✅' : '🔒'}</div>
              </div>
            );
          })}
        </motion.div>
      )}

      {subTab === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {state.rwHistory.length === 0 ? (
            <div className="text-center py-10 text-hunter-text3">
              <History className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No rewards claimed yet</div>
            </div>
          ) : (
            [...state.rwHistory].reverse().map((r, i) => (
              <div key={i} className="hunter-card p-3 flex items-center gap-3">
                <div className="text-2xl">{r.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{r.name}</div>
                  <div className="text-[10px] text-hunter-text3">{r.date}</div>
                </div>
                <div className="font-mono text-sm text-hunter-red">-{r.cost}</div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};
