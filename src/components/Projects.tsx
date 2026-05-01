import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Check, Calendar, Hammer, BarChart2, PieChart as PieIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Project, Task, AppState } from '../types';
import { Badge } from './Common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProjectsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  subTab: string;
  setSubTab: (sub: string) => void;
  gainXP: (xp: number, pts: number) => void;
  showToast: (msg: string, color?: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ state, setState, subTab, setSubTab, gainXP, showToast }) => {
  const [newProj, setNewProj] = useState({ name: '', desc: '', cat: 'Work', color: 'blue', deadline: '', target: 10 });
  const [newTask, setNewTask] = useState({ title: '', projId: '', prio: 'mid' as const, due: '', pts: 20, notes: '' });

  const addProject = () => {
    if (!newProj.name) return showToast('⚠ Enter project name!', '#f43f5e');
    const project: Project = {
      id: Date.now(),
      name: newProj.name,
      desc: newProj.desc,
      cat: newProj.cat,
      color: newProj.color,
      deadline: newProj.deadline,
      target: newProj.target,
      progress: 0,
      done: false,
      created: Date.now()
    };
    setState(prev => ({ ...prev, projects: [...prev.projects, project] }));
    setNewProj({ name: '', desc: '', cat: 'Work', color: 'blue', deadline: '', target: 10 });
    gainXP(10, 20);
    showToast('🛠 Project created!');
    setSubTab('view');
  };

  const addTask = () => {
    if (!newTask.title) return showToast('⚠ Enter task title!', '#f43f5e');
    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      projId: newTask.projId ? Number(newTask.projId) : null,
      prio: newTask.prio,
      due: newTask.due,
      pts: newTask.pts,
      notes: newTask.notes,
      done: false,
      created: Date.now()
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
    setNewTask({ title: '', projId: '', prio: 'mid', due: '', pts: 20, notes: '' });
    showToast('✅ Task added!');
  };

  const toggleTask = (id: number) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    
    const isDone = !task.done;
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, done: isDone } : t)
    }));

    if (isDone) {
      gainXP(10, task.pts);
      showToast(`✅ +${task.pts} PTS`, '#f5a623');
    }
  };

  const deleteTask = (id: number) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const deleteProject = (id: number) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tasks: prev.tasks.filter(t => t.projId !== id)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-hunter-s1 border border-hunter-b1 rounded-xl p-1">
        {['view', 'tasks', 'add', 'stats'].map(t => (
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

      {subTab === 'view' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {state.projects.length === 0 ? (
            <div className="text-center py-10 text-hunter-text3">
              <Hammer className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No projects yet. Create one!</div>
            </div>
          ) : (
            state.projects.map(p => {
              const tasks = state.tasks.filter(t => t.projId === p.id);
              const done = tasks.filter(t => t.done).length;
              const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
              const colorClass = `border-hunter-${p.color}/30`;
              
              return (
                <div key={p.id} className={cn("hunter-card p-3 border-l-4", `border-l-hunter-${p.color}`, colorClass)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-hunter-text3 line-clamp-1">{p.desc}</div>
                    </div>
                    <span className={cn("hunter-badge", `bg-hunter-${p.color}/10 text-hunter-${p.color}`)}>{p.cat}</span>
                  </div>
                  <div className="h-1 bg-hunter-b1 rounded-full my-2 overflow-hidden">
                    <div className={cn("h-full transition-all duration-500", `bg-hunter-${p.color}`)} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-mono" style={{ color: `var(--color-hunter-${p.color})` }}>{pct}%</span>
                    <span className="text-hunter-text3">{done}/{tasks.length} tasks</span>
                    <button onClick={() => deleteProject(p.id)} className="text-hunter-text3 hover:text-hunter-red">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      )}

      {subTab === 'tasks' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {state.tasks.length === 0 ? (
            <div className="text-center py-10 text-hunter-text3">
              <Check className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">No tasks yet.</div>
            </div>
          ) : (
            state.tasks.sort((a, b) => Number(a.done) - Number(b.done)).map(t => (
              <div key={t.id} className={cn("flex items-start gap-3 bg-hunter-s3 border border-hunter-b1 rounded-xl p-3 transition-all", t.done && "opacity-50 border-l-4 border-l-hunter-green")}>
                <button 
                  onClick={() => toggleTask(t.id)}
                  className={cn("w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5", t.done ? "bg-hunter-green border-hunter-green" : "border-hunter-b3")}
                >
                  {t.done && <Check size={12} className="text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-medium", t.done && "line-through text-hunter-text3")}>{t.title}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant={t.prio === 'high' ? 'red' : t.prio === 'low' ? 'green' : 'gold'}>{t.prio}</Badge>
                    {t.projId && (
                      <Badge variant="blue">{state.projects.find(p => p.id === t.projId)?.name}</Badge>
                    )}
                    <span className="font-mono text-[10px] text-hunter-gold">+{t.pts} pts</span>
                    {t.due && <span className="text-[10px] text-hunter-text3 flex items-center gap-1"><Calendar size={10} /> {t.due}</span>}
                  </div>
                </div>
                <button onClick={() => deleteTask(t.id)} className="text-hunter-text3 hover:text-hunter-red">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </motion.div>
      )}

      {subTab === 'add' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative h-24 rounded-2xl overflow-hidden border border-hunter-purple/30">
            <img src="https://images.unsplash.com/photo-1510511459019-5dee667ff18b?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-black tracking-[4px] text-hunter-purple uppercase">GUILD HALL</div>
            </div>
          </div>

          <div className="hunter-card p-4 border-hunter-purple/30">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mb-3 flex items-center gap-1.5">
              <div className="w-[3px] h-[11px] bg-hunter-purple rounded-[2px]" />
              NEW PROJECT
            </div>
            <div className="space-y-3">
              <input 
                type="text" className="hunter-input" placeholder="Project Name" 
                value={newProj.name} onChange={e => setNewProj(prev => ({ ...prev, name: e.target.value }))} 
              />
              <textarea 
                className="hunter-input min-h-[60px]" placeholder="Description"
                value={newProj.desc} onChange={e => setNewProj(prev => ({ ...prev, desc: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <select className="hunter-input" value={newProj.cat} onChange={e => setNewProj(prev => ({ ...prev, cat: e.target.value }))}>
                  <option>Work</option><option>Personal</option><option>Learning</option><option>Health</option><option>Finance</option>
                </select>
                <select className="hunter-input" value={newProj.color} onChange={e => setNewProj(prev => ({ ...prev, color: e.target.value }))}>
                  <option value="blue">Blue</option><option value="purple">Purple</option><option value="gold">Gold</option><option value="green">Green</option><option value="red">Red</option><option value="cyan">Cyan</option>
                </select>
              </div>
              <button className="hunter-btn bg-hunter-purple text-white w-full shadow-lg" onClick={addProject}>CREATE PROJECT</button>
            </div>
          </div>

          <div className="hunter-card p-4 border-hunter-blue/30">
            <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mb-3 flex items-center gap-1.5">
              <div className="w-[3px] h-[11px] bg-hunter-blue rounded-[2px]" />
              ADD TASK
            </div>
            <div className="space-y-3">
              <input 
                type="text" className="hunter-input" placeholder="Task Title" 
                value={newTask.title} onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))} 
              />
              <div className="grid grid-cols-2 gap-2">
                <select className="hunter-input" value={newTask.projId} onChange={e => setNewTask(prev => ({ ...prev, projId: e.target.value }))}>
                  <option value="">— No Project —</option>
                  {state.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select className="hunter-input" value={newTask.prio} onChange={e => setNewTask(prev => ({ ...prev, prio: e.target.value as any }))}>
                  <option value="high">🔴 High</option><option value="mid">🟡 Mid</option><option value="low">🟢 Low</option>
                </select>
              </div>
              <button className="hunter-btn bg-hunter-blue text-white w-full shadow-lg" onClick={addTask}>ADD TASK</button>
            </div>
          </div>
        </motion.div>
      )}
      {subTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="text-[9px] tracking-[2px] uppercase text-hunter-text3 mt-4 flex items-center gap-2">
            <BarChart2 size={12} className="text-hunter-purple" />
            PROJECT PERFORMANCE
          </div>

          {state.projects.length === 0 ? (
            <div className="hunter-card p-8 text-center text-hunter-text3">
              <PieIcon className="mx-auto mb-2 opacity-20" size={40} />
              <div className="text-sm">Create projects to see stats</div>
            </div>
          ) : (() => {
            const chartData = state.projects.map(p => {
              const tasks = state.tasks.filter(t => t.projId === p.id);
              const done = tasks.filter(t => t.done).length;
              return {
                name: p.name.length > 10 ? p.name.slice(0, 8) + '..' : p.name,
                completed: done,
                total: tasks.length,
                color: `var(--color-hunter-${p.color})`
              };
            });

            return (
              <div className="space-y-4">
                <div className="hunter-card p-4 h-[250px] border-hunter-purple/20">
                  <div className="text-[10px] text-hunter-text3 mb-4 uppercase tracking-widest">Tasks Completed per Project</div>
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
                      <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#8b5cf6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="hunter-card p-3 border-hunter-purple/20">
                    <div className="text-[8px] text-hunter-text3 uppercase mb-1">Active Projects</div>
                    <div className="text-xl font-black text-hunter-purple">{state.projects.length}</div>
                  </div>
                  <div className="hunter-card p-3 border-hunter-green/20">
                    <div className="text-[8px] text-hunter-text3 uppercase mb-1">Total Tasks</div>
                    <div className="text-xl font-black text-hunter-green">{state.tasks.length}</div>
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
