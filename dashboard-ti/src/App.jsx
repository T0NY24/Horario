import { useState, useEffect } from 'react';
import { neon } from '@neondatabase/serverless';
import {
  CheckCircle2, Circle, Clock, MapPin, Music, Monitor, Bus, Dumbbell,
  Calendar, CheckSquare, Wallet, Activity, ArrowRight, ArrowLeft, Plus, Trash2,
  Heart, Stethoscope, LogOut, Flame, Sun, Moon, Sparkles, Utensils, BookOpen, Coffee
} from 'lucide-react';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const sql = neon(import.meta.env.VITE_DATABASE_URL);

function App() {
  // --- LOGIN STATE ---
  const [currentUser, setCurrentUser] = useState(null); // 'anthony' | 'sofia' | null

  // --- APP STATE ---
  const [activeDay, setActiveDay] = useState('Lunes');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [rightTab, setRightTab] = useState('kanban');
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'

  // --- DATA ---
  const [schedule, setSchedule] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [finance, setFinance] = useState([]);
  const [habits, setHabits] = useState([]);

  // --- FORMS ---
  const [newTask, setNewTask] = useState('');
  const [newFinanceDesc, setNewFinanceDesc] = useState('');
  const [newFinanceAmount, setNewFinanceAmount] = useState('');
  const [newFinanceType, setNewFinanceType] = useState('gasto');
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      fetchData();
    }
    const todayIndex = new Date().getDay();
    if (todayIndex >= 1 && todayIndex <= 6) setActiveDay(days[todayIndex - 1]);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const scheduleData = await sql`SELECT * FROM schedule WHERE owner = ${currentUser} ORDER BY sort_order ASC`;
      const tasksData = await sql`SELECT * FROM tasks WHERE owner = ${currentUser} ORDER BY id DESC`;
      const financeData = await sql`SELECT * FROM finance WHERE owner = ${currentUser} ORDER BY id DESC`;
      const habitsData = await sql`SELECT * FROM habits WHERE owner = ${currentUser} ORDER BY id ASC`;

      setSchedule(scheduleData);
      setTasks(tasksData);
      setFinance(financeData);
      setHabits(habitsData);
      setLoading(false);
    } catch (error) { console.error("Error DB:", error); setLoading(false); }
  };

  // --- ACCIONES ---
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const res = await sql`INSERT INTO tasks (owner, title, status, priority) VALUES (${currentUser}, ${newTask}, 'todo', 'Media') RETURNING *`;
    setTasks([res[0], ...tasks]);
    setNewTask('');
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!newFinanceDesc || !newFinanceAmount) return;
    const res = await sql`INSERT INTO finance (owner, description, amount, type) VALUES (${currentUser}, ${newFinanceDesc}, ${newFinanceAmount}, ${newFinanceType}) RETURNING *`;
    setFinance([res[0], ...finance]);
    setNewFinanceDesc(''); setNewFinanceAmount('');
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    const res = await sql`INSERT INTO habits (owner, title) VALUES (${currentUser}, ${newHabit}) RETURNING *`;
    setHabits([...habits, res[0]]);
    setNewHabit('');
  };

  // --- UTILS ---
  const moveTask = async (id, currentStatus, direction) => {
    const statuses = ['todo', 'doing', 'done'];
    const newIndex = direction === 'next' ? statuses.indexOf(currentStatus) + 1 : statuses.indexOf(currentStatus) - 1;
    if (newIndex >= 0 && newIndex < statuses.length) {
      const newStatus = statuses[newIndex];
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await sql`UPDATE tasks SET status = ${newStatus} WHERE id = ${id}`;
    }
  };

  const deleteItem = async (table, id, setter) => {
    setter(prev => prev.filter(item => item.id !== id));
    if (table === 'tasks') await sql`DELETE FROM tasks WHERE id = ${id}`;
    if (table === 'finance') await sql`DELETE FROM finance WHERE id = ${id}`;
    if (table === 'habits') await sql`DELETE FROM habits WHERE id = ${id}`;
  };

  const toggleScheduleItem = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setSchedule(prev => prev.map(t => t.id === id ? { ...t, is_completed: newStatus } : t));
    await sql`UPDATE schedule SET is_completed = ${newStatus} WHERE id = ${id}`;
  };

  const toggleHabitToday = async (id, historyStr) => {
    const today = new Date().toISOString().split('T')[0];
    let arr = historyStr ? historyStr.split(',') : [];
    arr.includes(today) ? arr = arr.filter(d => d !== today) : arr.push(today);
    const newHistory = arr.join(',');
    setHabits(prev => prev.map(h => h.id === id ? { ...h, history: newHistory } : h));
    await sql`UPDATE habits SET history = ${newHistory} WHERE id = ${id}`;
  };

  const isHappeningNow = (timeRange) => {
    const todayName = days[new Date().getDay() - 1];
    if (activeDay !== todayName) return false;
    try {
      const [start, end] = timeRange.split(' - ');
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const now = currentTime;
      const cur = now.getHours() * 60 + now.getMinutes();
      let startT = startH * 60 + startM;
      let endT = endH * 60 + endM;
      if (endT < startT) endT += 24 * 60;
      return cur >= startT && cur < endT;
    } catch { return false; }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Virtual': return <Monitor size={18} />;
      case 'Transporte': return <Bus size={18} />;
      case 'Música': return <Music size={18} />;
      case 'Deporte': return <Dumbbell size={18} />;
      case 'Práctica': return <Stethoscope size={18} />;
      case 'Presencial': return currentUser === 'sofia' ? <Heart size={18} /> : <CheckSquare size={18} />;
      case 'Rutina': return <Coffee size={18} />;
      case 'Sueño': return <Moon size={18} />;
      case 'Comida': return <Utensils size={18} />;
      case 'Estudio': return <BookOpen size={18} />;
      default: return <Clock size={18} />;
    }
  };

  const getTypeColor = (type, isActive) => {
    if (isActive) return 'from-violet-500 to-purple-600 text-white';
    switch (type) {
      case 'Virtual': return 'from-blue-400 to-blue-500 text-white';
      case 'Transporte': return 'from-orange-400 to-orange-500 text-white';
      case 'Música': return 'from-pink-400 to-pink-500 text-white';
      case 'Deporte': return 'from-emerald-400 to-emerald-500 text-white';
      case 'Práctica': return 'from-red-400 to-red-500 text-white';
      case 'Rutina': return 'from-slate-300 to-slate-400 text-slate-700';
      case 'Sueño': return 'from-indigo-400 to-indigo-500 text-white';
      case 'Comida': return 'from-red-400 to-red-500 text-white';
      case 'Estudio': return 'from-violet-400 to-violet-500 text-white';
      default: return 'from-slate-400 to-slate-500 text-white';
    }
  };

  const dailySchedule = schedule.filter(t => t.day === activeDay);
  const progress = dailySchedule.length > 0 ? Math.round((dailySchedule.filter(t => t.is_completed).length / dailySchedule.length) * 100) : 0;
  const totalBalance = finance.reduce((acc, curr) => curr.type === 'ingreso' ? acc + parseFloat(curr.amount) : acc - parseFloat(curr.amount), 0);

  // --- THEME STYLES ---
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-slate-50 text-slate-800';
  const bgCard = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800';

  // --- VISTA DE BIENVENIDA ---
  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="absolute top-6 right-6">
          <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} className={`p-3 rounded-full transition-all ${isDark ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <h1 className={`text-4xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>¡Hola! 👋</h1>
            <p className={textMuted}>¿Quién eres hoy?</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => setCurrentUser('anthony')}
              className={`group p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 ${isDark ? 'bg-white/5 border-white/10 hover:border-purple-500 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-purple-500 hover:shadow-xl'}`}
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music size={32} className="text-purple-600" />
              </div>
              <span className={`font-bold group-hover:text-purple-600 ${textMain}`}>Anthony</span>
            </button>

            <button
              onClick={() => setCurrentUser('sofia')}
              className={`group p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 ${isDark ? 'bg-white/5 border-white/10 hover:border-pink-500 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-pink-500 hover:shadow-xl'}`}
            >
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope size={32} className="text-pink-600" />
              </div>
              <span className={`font-bold group-hover:text-pink-600 ${textMain}`}>Sofia</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">Anthony & Sofia OS • Neon DB</p>
        </div>
      </div>
    );
  }

  // --- DASHBOARD PRINCIPAL ---
  return (
    <div className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-500 ${bgMain}`}>

      {/* Background Effects (Only Dark Mode) */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <header className={`flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-3xl backdrop-blur-xl border ${bgCard}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentUser === 'sofia' ? 'bg-pink-500' : 'bg-purple-600'} text-white shadow-lg`}>
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${textMain}`}>
                {currentUser === 'anthony' ? 'Anthony OS' : 'Sofia OS'}
              </h1>
              <p className={`${textMuted} text-sm mt-1 flex items-center gap-2`}>
                <Calendar size={14} /> {activeDay} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-right hidden sm:block mr-4">
              <div className={`text-2xl font-bold ${textMain}`}>{progress}%</div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Progreso</div>
            </div>

            <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setCurrentUser(null)} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500'}`} title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Cargando datos...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* HORARIO */}
            <div className="xl:col-span-1 space-y-6">
              <div className={`p-6 rounded-3xl border h-full ${bgCard}`}>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
                  {days.map(day => (
                    <button key={day} onClick={() => setActiveDay(day)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeDay === day ? (currentUser === 'sofia' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-purple-600 text-white shadow-lg shadow-purple-500/30') : (isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>
                      {day}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {dailySchedule.length === 0 && <p className="text-center text-slate-400 py-10">Día libre 🙌</p>}
                  {dailySchedule.map(task => {
                    const active = isHappeningNow(task.time_range);
                    return (
                      <div key={task.id} className={`p-4 rounded-2xl border transition-all ${task.is_completed ? (isDark ? 'bg-white/5 border-transparent opacity-50' : 'bg-slate-50 border-transparent opacity-60 grayscale') : active ? (isDark ? 'bg-white/10 border-purple-500/50 shadow-lg' : 'bg-white ring-2 ring-purple-500 shadow-lg') : (isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-slate-300')}`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl shadow-sm ${active ? (currentUser === 'sofia' ? 'bg-pink-500 text-white' : 'bg-purple-600 text-white') : (isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>{getIcon(task.type)}</div>
                          <div className="flex-grow">
                            <h3 className={`font-bold text-sm ${textMain}`}>{task.title}</h3>
                            <span className={`text-xs font-mono ${textMuted}`}>{task.time_range}</span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1"><MapPin size={10} /> {task.location}</div>
                          </div>
                          <button onClick={() => toggleScheduleItem(task.id, task.is_completed)}>
                            {task.is_completed ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : <Circle className={`w-6 h-6 ${isDark ? 'text-slate-600 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'}`} />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* HERRAMIENTAS (Kanban, Finanzas, Hábitos) */}
            <div className="xl:col-span-2">
              <div className={`rounded-3xl border shadow-sm overflow-hidden min-h-[700px] ${bgCard}`}>
                <div className={`flex border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <button onClick={() => setRightTab('kanban')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${rightTab === 'kanban' ? (isDark ? 'text-white border-b-2 border-white' : 'text-slate-800 border-b-2 border-slate-800') : 'text-slate-400'}`}><CheckSquare size={18} /> Tareas</button>
                  <button onClick={() => setRightTab('finance')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${rightTab === 'finance' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400'}`}><Wallet size={18} /> Finanzas</button>
                  <button onClick={() => setRightTab('habits')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${rightTab === 'habits' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400'}`}><Activity size={18} /> Hábitos</button>
                </div>

                <div className={`p-6 h-full ${isDark ? 'bg-black/20' : 'bg-slate-50/50'}`}>

                  {/* KANBAN */}
                  {rightTab === 'kanban' && (
                    <div className="h-full">
                      <form onSubmit={addTask} className="flex gap-2 mb-6">
                        <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder={`Tarea para ${currentUser}...`} className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${inputBg}`} />
                        <button type="submit" className="bg-slate-800 text-white px-4 rounded-xl hover:bg-slate-700 transition-transform hover:scale-105"><Plus size={20} /></button>
                      </form>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['todo', 'doing', 'done'].map(status => (
                          <div key={status} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
                            <h3 className="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wider">{status}</h3>
                            <div className="space-y-3">
                              {tasks.filter(t => t.status === status).map(task => (
                                <div key={task.id} className={`p-3 rounded-xl border shadow-sm group transition-all ${isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white border-slate-200 hover:shadow-md'}`}>
                                  <div className="flex justify-between items-start mb-2"><p className={`text-sm font-medium ${textMain}`}>{task.title}</p><button onClick={() => deleteItem('tasks', task.id, setTasks)} className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button></div>
                                  <div className="flex justify-between">{status !== 'todo' && <button onClick={() => moveTask(task.id, status, 'prev')}><ArrowLeft size={16} className="text-slate-400 hover:text-purple-500" /></button>}<span />{status !== 'done' && <button onClick={() => moveTask(task.id, status, 'next')}><ArrowRight size={16} className="text-slate-400 hover:text-purple-500" /></button>}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FINANZAS */}
                  {rightTab === 'finance' && (
                    <div className="space-y-6">
                      <div className={`rounded-3xl p-8 text-white shadow-xl relative overflow-hidden ${totalBalance >= 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20'}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                        <p className="opacity-90 text-sm font-medium">Balance Total</p>
                        <h2 className="text-5xl font-black mt-2 tracking-tight">${totalBalance.toFixed(2)}</h2>
                      </div>
                      <form onSubmit={addTransaction} className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 ${bgCard}`}>
                        <input value={newFinanceDesc} onChange={e => setNewFinanceDesc(e.target.value)} placeholder="Motivo" className={`flex-grow px-4 py-2 rounded-xl text-sm outline-none ${inputBg}`} />
                        <input type="number" value={newFinanceAmount} onChange={e => setNewFinanceAmount(e.target.value)} placeholder="$" className={`w-24 px-4 py-2 rounded-xl text-sm outline-none ${inputBg}`} />
                        <select value={newFinanceType} onChange={e => setNewFinanceType(e.target.value)} className={`px-4 py-2 rounded-xl text-sm outline-none ${inputBg}`}><option value="gasto" className="text-slate-800">Gasto</option><option value="ingreso" className="text-slate-800">Ingreso</option></select>
                        <button type="submit" className="bg-emerald-500 text-white px-6 rounded-xl hover:bg-emerald-600 font-bold text-sm transition-transform hover:scale-105">+</button>
                      </form>
                      <div className="space-y-2">
                        {finance.map(f => (
                          <div key={f.id} className={`flex justify-between items-center p-4 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-200 hover:shadow-sm'}`}>
                            <span className={`text-sm font-medium ${textMain}`}>{f.description}</span>
                            <div className="flex gap-4 items-center"><span className={`font-bold text-lg ${f.type === 'ingreso' ? 'text-emerald-500' : 'text-red-500'}`}>{f.type === 'ingreso' ? '+' : '-'}${f.amount}</span><button onClick={() => deleteItem('finance', f.id, setFinance)} className="text-slate-400 hover:text-red-400"><Trash2 size={16} /></button></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HÁBITOS */}
                  {rightTab === 'habits' && (
                    <div className="space-y-6">
                      <form onSubmit={addHabit} className="flex gap-3">
                        <input value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="Nuevo hábito..." className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all ${inputBg}`} />
                        <button type="submit" className="bg-orange-500 text-white px-4 rounded-xl hover:bg-orange-600 transition-transform hover:scale-105"><Plus size={20} /></button>
                      </form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {habits.map(h => {
                          const historyArr = h.history ? h.history.split(',') : [];
                          const today = new Date().toISOString().split('T')[0];
                          const isDone = historyArr.includes(today);
                          return (
                            <div key={h.id} className={`p-5 rounded-2xl border transition-all ${isDone ? (isDark ? 'bg-orange-500/10 border-orange-500/50' : 'bg-orange-50 border-orange-200') : (isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200')}`}>
                              <div className="flex justify-between mb-4"><h3 className={`font-bold text-lg ${textMain}`}>{h.title}</h3><button onClick={() => deleteItem('habits', h.id, setHabits)} className="text-slate-400 hover:text-red-400"><Trash2 size={16} /></button></div>
                              <button onClick={() => toggleHabitToday(h.id, h.history)} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isDone ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : (isDark ? 'bg-white/10 text-slate-400 hover:bg-white/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}>{isDone ? '¡Completado! 🔥' : 'Marcar como hecho'}</button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}; }
      `}</style>
    </div>
  );
}

export default App;