import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Camera, History } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Photo, Metric, AppState } from '../types';
import { CHARACTERS } from '../constants';

interface BodyProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  subTab: string;
  setSubTab: (sub: string) => void;
  gainXP: (xp: number, pts: number) => void;
  showToast: (msg: string, color?: string) => void;
}

export const Body: React.FC<BodyProps> = ({ state, setState, subTab, setSubTab, gainXP, showToast }) => {
  const [metrics, setMetrics] = useState({ wt: 75, bf: 15, ch: 100, wa: 80, ar: 35 });
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const savePhysique = async () => {
    if (!preview) return;
    setIsSaving(true);
    
    const photo: Photo = {
      id: Date.now().toString(),
      thumb: preview,
      date: new Date().toDateString(),
      metrics: { ...metrics },
      analysis: "Physique record updated in the System Database."
    };

    const metric: Metric = {
      id: Date.now().toString(),
      date: new Date().toDateString(),
      ...metrics
    };

    setState(prev => ({
      ...prev,
      photos: [...prev.photos, photo],
      metrics: [...prev.metrics, metric]
    }));

    setIsSaving(false);
    gainXP(25, 50);
    showToast('📸 Physique record saved! +25 XP');
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1">
        {['up', 'gallery', 'metrics', 'shadows'].map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
              subTab === t ? "bg-hunter-purple text-white shadow-lg" : "text-hunter-text3 hover:text-hunter-text2"
            )}
          >
            {t === 'shadows' ? 'Army' : t}
          </button>
        ))}
      </div>

      {subTab === 'up' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-purple/30">
            <img src="https://images.unsplash.com/photo-1510511459019-5dee667ff18b?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-purple uppercase">PHYSIQUE RE-EVALUATION</div>
            </div>
          </div>

          <div 
            className="border-2 border-dashed border-hunter-b3 rounded-2xl p-8 text-center cursor-pointer hover:bg-hunter-blue/5 transition-all"
            onClick={() => document.getElementById('body-file')?.click()}
          >
            <Camera className="mx-auto mb-2 text-hunter-text2" size={40} />
            <div className="text-sm font-bold text-hunter-text2">Upload Progress Photo</div>
            <div className="text-[10px] text-hunter-text3 mt-1">Record your physique progress in the System</div>
          </div>
          <input type="file" id="body-file" className="hidden" accept="image/*" onChange={handleFile} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] text-hunter-text3 uppercase mb-1">Weight (kg)</div>
              <input type="number" className="hunter-input" value={metrics.wt} onChange={e => setMetrics(prev => ({ ...prev, wt: Number(e.target.value) }))} />
            </div>
            <div>
              <div className="text-[9px] text-hunter-text3 uppercase mb-1">Body Fat %</div>
              <input type="number" className="hunter-input" value={metrics.bf} onChange={e => setMetrics(prev => ({ ...prev, bf: Number(e.target.value) }))} />
            </div>
          </div>

          {preview && (
            <div className="space-y-3">
              <img src={preview} className="w-full rounded-xl border border-hunter-b2" />
              <button 
                className="hunter-btn bg-hunter-purple text-white w-full shadow-lg flex items-center justify-center gap-2"
                onClick={savePhysique}
                disabled={isSaving}
              >
                {isSaving ? 'SAVING...' : '💾 SAVE PHYSIQUE RECORD (+25 XP)'}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {subTab === 'gallery' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-2">
          {state.photos.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-hunter-text3">
              <Camera className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No photos yet</div>
            </div>
          ) : (
            [...state.photos].reverse().map((p, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-hunter-b1 relative group">
                <img src={p.thumb} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <div className="text-[8px] text-white font-mono">{p.date}</div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {subTab === 'metrics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {state.metrics.length === 0 ? (
            <div className="text-center py-10 text-hunter-text3">
              <History className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No metrics yet</div>
            </div>
          ) : (
            [...state.metrics].reverse().map((m, i) => (
              <div key={i} className="hunter-card p-3">
                <div className="text-[10px] text-hunter-text3 font-mono mb-2">{m.date}</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-hunter-s1 border border-hunter-b1 rounded p-1.5 text-center">
                    <div className="text-hunter-blue font-mono text-xs font-bold">{m.wt}kg</div>
                    <div className="text-[7px] text-hunter-text3 uppercase">wt</div>
                  </div>
                  <div className="bg-hunter-s1 border border-hunter-b1 rounded p-1.5 text-center">
                    <div className="text-hunter-gold font-mono text-xs font-bold">{m.bf}%</div>
                    <div className="text-[7px] text-hunter-text3 uppercase">bf%</div>
                  </div>
                  <div className="bg-hunter-s1 border border-hunter-b1 rounded p-1.5 text-center">
                    <div className="text-hunter-green font-mono text-xs font-bold">{m.ch}</div>
                    <div className="text-[7px] text-hunter-text3 uppercase">chest</div>
                  </div>
                  <div className="bg-hunter-s1 border border-hunter-b1 rounded p-1.5 text-center">
                    <div className="text-hunter-cyan font-mono text-xs font-bold">{m.wa}</div>
                    <div className="text-[7px] text-hunter-text3 uppercase">waist</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {subTab === 'shadows' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-purple/30">
            <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-purple uppercase">SHADOW ARMY</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CHARACTERS.map(char => {
              const isUnlocked = state.unlockedCharacters.includes(char.id);
              return (
                <div key={char.id} className={cn(
                  "hunter-card p-0 overflow-hidden transition-all duration-500 relative group",
                  isUnlocked ? "border-hunter-purple/50 opacity-100 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "border-hunter-b1 opacity-40 grayscale"
                )}>
                  <div className="relative aspect-[3/4]">
                    <img 
                      src={char.image} 
                      className={cn(
                         "w-full h-full object-cover transition-all duration-700",
                         isUnlocked ? "brightness-110 contrast-110 saturate-[1.2]" : "brightness-50 grayscale"
                      )} 
                      referrerPolicy="no-referrer" 
                    />
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-gradient-to-t from-hunter-purple/20 to-transparent pointer-events-none" />
                    )}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-3 text-center">
                        <div className="text-[8px] text-hunter-text3 uppercase tracking-widest mb-1">Locked</div>
                        <div className="text-[7px] text-hunter-purple font-mono">
                          {char.unlockRequirement.tasks && `Tasks: ${state.tasks.filter(t => t.done).length}/${char.unlockRequirement.tasks}`}
                          {char.unlockRequirement.xp && <><br />XP: {state.xp}/{char.unlockRequirement.xp}</>}
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center font-display text-[10px] font-bold border",
                        char.rank === 'S' ? "bg-hunter-gold border-hunter-gold text-black" : "bg-hunter-b2 border-hunter-b1 text-hunter-text3"
                      )}>
                        {char.rank}
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-white truncate">{char.name}</div>
                    <div className="text-[8px] text-hunter-text3 line-clamp-1">{char.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
