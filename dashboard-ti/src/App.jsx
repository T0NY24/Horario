import { useState, useEffect, useMemo } from 'react';
import { neon } from '@neondatabase/serverless';
import {
  CheckCircle2, Circle, Clock, MapPin, Music, Monitor, Bus, Dumbbell,
  Calendar, CheckSquare, Wallet, Activity, ArrowRight, ArrowLeft, Plus, Trash2,
  Heart, Stethoscope, LogOut, Flame, Download, Edit3, X, Save, Infinity as InfinityIcon,
  Sun, Moon, Sparkles, Utensils, BookOpen, Coffee, TrendingUp, PieChart as PieIcon
} from 'lucide-react';
// IMPORTAMOS LOS GRÁFICOS
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const sql = neon(import.meta.env.VITE_DATABASE_URL);

// Colores para gráficos
const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1'];

function App() {
  // --- STATES ---
  const [currentUser, setCurrentUser] = useState(null);
  const [activeDay, setActiveDay] = useState('Lunes');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [rightTab, setRightTab] = useState('kanban');
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [theme, setTheme] = useState('dark');

  const [schedule, setSchedule] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [finance, setFinance] = useState([]);
  const [habits, setHabits] = useState([]);
  const [gymLogs, setGymLogs] = useState([]);

  // --- FORM STATES ---
  const [newClass, setNewClass] = useState({ title: '', start: '07:00', end: '09:00', type: 'Presencial', location: '', day: 'Lunes' });
  const [newTask, setNewTask] = useState('');
  const [newFin, setNewFin] = useState({ desc: '', amount: '', type: 'gasto', date: new Date().toISOString().split('T')[0] });
  const [newHabit, setNewHabit] = useState({ title: '', freq: 'Siempre', selectedDays: [] });
  const [newGym, setNewGym] = useState({ exercise: '', weight: '', reps: '' });

  // --- HOOKS ---
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

  // Notificaciones
  useEffect(() => {
    if (Notification.permission !== 'granted') Notification.requestPermission();
  }, []);

  useEffect(() => {
    const checkNotifications = () => {
      if (Notification.permission !== 'granted' || !currentUser) return;
      const now = new Date();
      const currentDayName = days[now.getDay() - 1];
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      const userSchedule = schedule.filter(t => t.day === currentDayName);
      userSchedule.forEach(task => {
        const startTime = task.time_range.split(' - ')[0].trim();
        if (startTime === currentTimeStr && now.getSeconds() < 2) {
          try {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            new Notification(`🔔 ${task.title}`, {
              body: `Es hora de ${task.title} en ${task.location}`,
              icon: '/pwa-192x192.png',
              vibrate: [200, 100, 200]
            });
          } catch (e) { console.error(e); }
        }
      });
    };
    const interval = setInterval(checkNotifications, 1000);
    return () => clearInterval(interval);
  }, [schedule, currentUser]);

  // --- DATA PROCESSING FOR CHARTS ---
  const financeChartData = useMemo(() => {
    // Agrupar finanzas por fecha para el gráfico de área
    const grouped = {};
    finance.forEach(f => {
      const date = f.date; // Asumimos formato YYYY-MM-DD
      if (!grouped[date]) grouped[date] = { date, ingresos: 0, gastos: 0 };
      if (f.type === 'ingreso') grouped[date].ingresos += parseFloat(f.amount);
      else grouped[date].gastos += parseFloat(f.amount);
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7); // Últimos 7 movimientos
  }, [finance]);

  const financePieData = useMemo(() => {
    const totalIng = finance.filter(f => f.type === 'ingreso').reduce((a, b) => a + parseFloat(b.amount), 0);
    const totalGas = finance.filter(f => f.type === 'gasto').reduce((a, b) => a + parseFloat(b.amount), 0);
    return [
      { name: 'Ingresos', value: totalIng },
      { name: 'Gastos', value: totalGas }
    ];
  }, [finance]);

  const habitChartData = useMemo(() => {
    return habits.map(h => {
      const historyArr = h.history ? h.history.split(',') : [];
      return {
        name: h.title.substring(0, 10) + '...', // Acortar nombre
        dias: historyArr.length
      };
    });
  }, [habits]);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const scheduleData = await sql`SELECT * FROM schedule WHERE owner = ${currentUser} ORDER BY day, time_range ASC`;
      const tasksData = await sql`SELECT * FROM tasks WHERE owner = ${currentUser} ORDER BY id DESC`;
      const financeData = await sql`SELECT * FROM finance WHERE owner = ${currentUser} ORDER BY date DESC`;
      const habitsData = await sql`SELECT * FROM habits WHERE owner = ${currentUser} ORDER BY id ASC`;
      const gymData = await sql`SELECT * FROM gym_logs WHERE owner = ${currentUser} ORDER BY date DESC, id DESC LIMIT 50`;

      setSchedule(scheduleData);
      setTasks(tasksData);
      setFinance(financeData);
      setHabits(habitsData);
      setGymLogs(gymData);
      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "SECCION,TITULO/DESC,DETALLE,EXTRA\n";
    schedule.forEach(r => csvContent += `Horario,${r.title},${r.day} ${r.time_range},${r.location}\n`);
    finance.forEach(r => csvContent += `Finanzas,${r.description},${r.type} $${r.amount},${r.date}\n`);
    gymLogs.forEach(r => csvContent += `Gym,${r.exercise},${r.weight} - ${r.reps},${r.date}\n`);
    tasks.forEach(r => csvContent += `Tarea,${r.title},${r.priority},${r.status}\n`);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentUser}_data.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // --- ACTIONS (Igual que antes) ---
  const addScheduleItem = async (e) => {
    e.preventDefault(); if (!newClass.title) return;
    const timeRange = `${newClass.start} - ${newClass.end}`;
    const res = await sql`INSERT INTO schedule (owner, day, time_range, title, type, location) VALUES (${currentUser}, ${newClass.day}, ${timeRange}, ${newClass.title}, ${newClass.type}, ${newClass.location}) RETURNING *`;
    setSchedule([...schedule, res[0]].sort((a, b) => a.day.localeCompare(b.day) || a.time_range.localeCompare(b.time_range)));
    setNewClass({ ...newClass, title: '', location: '' });
  };
  const deleteScheduleItem = async (id) => { if (!confirm("¿Borrar?")) return; setSchedule(prev => prev.filter(t => t.id !== id)); await sql`DELETE FROM schedule WHERE id = ${id}`; };
  const toggleScheduleComplete = async (id, currentStatus) => { if (isEditingSchedule) return; const newStatus = !currentStatus; setSchedule(prev => prev.map(t => t.id === id ? { ...t, is_completed: newStatus } : t)); await sql`UPDATE schedule SET is_completed = ${newStatus} WHERE id = ${id}`; };

  const addTask = async (e) => { e.preventDefault(); if (!newTask.trim()) return; const res = await sql`INSERT INTO tasks (owner, title, status, priority) VALUES (${currentUser}, ${newTask}, 'todo', 'Media') RETURNING *`; setTasks([res[0], ...tasks]); setNewTask(''); };
  const moveTask = async (id, currentStatus, direction) => {
    const statuses = ['todo', 'doing', 'done'];
    const newIndex = direction === 'next' ? statuses.indexOf(currentStatus) + 1 : statuses.indexOf(currentStatus) - 1;
    if (newIndex >= 0 && newIndex < statuses.length) {
      const newStatus = statuses[newIndex];
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await sql`UPDATE tasks SET status = ${newStatus} WHERE id = ${id}`;
    }
  };
  const deleteItem = async (table, id, setter) => { setter(prev => prev.filter(item => item.id !== id)); if (table === 'tasks') await sql`DELETE FROM tasks WHERE id = ${id}`; if (table === 'finance') await sql`DELETE FROM finance WHERE id = ${id}`; if (table === 'habits') await sql`DELETE FROM habits WHERE id = ${id}`; if (table === 'gym_logs') await sql`DELETE FROM gym_logs WHERE id = ${id}`; };

  const addTransaction = async (e) => { e.preventDefault(); if (!newFin.desc || !newFin.amount) return; const res = await sql`INSERT INTO finance (owner, description, amount, type, date) VALUES (${currentUser}, ${newFin.desc}, ${newFin.amount}, ${newFin.type}, ${newFin.date}) RETURNING *`; setFinance([res[0], ...finance]); setNewFin({ ...newFin, desc: '', amount: '' }); };
  const addGymLog = async (e) => { e.preventDefault(); if (!newGym.exercise) return; const res = await sql`INSERT INTO gym_logs (owner, exercise, weight, reps) VALUES (${currentUser}, ${newGym.exercise}, ${newGym.weight}, ${newGym.reps}) RETURNING *`; setGymLogs([res[0], ...gymLogs]); setNewGym({ exercise: '', weight: '', reps: '' }); };

  const addHabit = async (e) => { e.preventDefault(); if (!newHabit.title.trim()) return; const freqToSave = newHabit.freq === 'Siempre' ? 'Diario' : 'Semanal'; const targetDaysStr = newHabit.freq === 'Semanal' ? newHabit.selectedDays.join(',') : ''; const res = await sql`INSERT INTO habits (owner, title, frequency, target_days) VALUES (${currentUser}, ${newHabit.title}, ${freqToSave}, ${targetDaysStr}) RETURNING *`; setHabits([...habits, res[0]]); setNewHabit({ title: '', freq: 'Siempre', selectedDays: [] }); };
  const toggleHabitDaySelection = (day) => { if (newHabit.selectedDays.includes(day)) { setNewHabit({ ...newHabit, selectedDays: newHabit.selectedDays.filter(d => d !== day) }); } else { setNewHabit({ ...newHabit, selectedDays: [...newHabit.selectedDays, day] }); } };
  const toggleHabitToday = async (id, historyStr) => { const today = new Date().toISOString().split('T')[0]; let arr = historyStr ? historyStr.split(',') : []; arr.includes(today) ? arr = arr.filter(d => d !== today) : arr.push(today); const newHistory = arr.join(','); setHabits(prev => prev.map(h => h.id === id ? { ...h, history: newHistory } : h)); await sql`UPDATE habits SET history = ${newHistory} WHERE id = ${id}`; };

  const isHappeningNow = (timeRange) => { const todayName = days[new Date().getDay() - 1]; if (activeDay !== todayName) return false; try { const [start, end] = timeRange.split(' - '); const [startH, startM] = start.split(':').map(Number); const [endH, endM] = end.split(':').map(Number); const now = currentTime; const cur = now.getHours() * 60 + now.getMinutes(); let startT = startH * 60 + startM; let endT = endH * 60 + endM; if (endT < startT) endT += 24 * 60; return cur >= startT && cur < endT; } catch { return false; } };
  const getIcon = (type) => { switch (type) { case 'Virtual': return <Monitor size={18} />; case 'Música': return <Music size={18} />; case 'Deporte': return <Dumbbell size={18} />; case 'Práctica': return <Stethoscope size={18} />; case 'Presencial': return currentUser === 'sofia' ? <Heart size={18} /> : <CheckSquare size={18} />; case 'Rutina': return <Coffee size={18} />; case 'Sueño': return <Moon size={18} />; case 'Comida': return <Utensils size={18} />; case 'Estudio': return <BookOpen size={18} />; default: return <Clock size={18} />; } };

  // --- THEME ---
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-slate-50 text-slate-800';
  const bgCard = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800';

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="absolute top-6 right-6">
          <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} className={`p-3 rounded-full transition-all ${isDark ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
        </div>
        <div className="max-w-md w-full text-center space-y-8">
          <div><h1 className={`text-4xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Planner 📅</h1><p className={textMuted}>Tu centro de comando personal</p></div>
          <div className="grid grid-cols-2 gap-6">
            <button onClick={() => setCurrentUser('anthony')} className={`group p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 ${isDark ? 'bg-white/5 border-white/10 hover:border-purple-500 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-purple-500 hover:shadow-xl'}`}>
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Music size={32} className="text-purple-600" /></div><span className={`font-bold group-hover:text-purple-600 ${textMain}`}>Anthony</span>
            </button>
            <button onClick={() => setCurrentUser('sofia')} className={`group p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 ${isDark ? 'bg-white/5 border-white/10 hover:border-pink-500 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-pink-500 hover:shadow-xl'}`}>
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Stethoscope size={32} className="text-pink-600" /></div><span className={`font-bold group-hover:text-pink-600 ${textMain}`}>Sofia</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dailySchedule = schedule.filter(t => t.day === activeDay);
  const totalBalance = finance.reduce((acc, curr) => curr.type === 'ingreso' ? acc + parseFloat(curr.amount) : acc - parseFloat(curr.amount), 0);

  return (
    <div className={`min-h-screen p-4 md:p-8 font-sans transition-colors duration-500 ${bgMain}`}>
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <header className={`flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-3xl backdrop-blur-xl border ${bgCard}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentUser === 'sofia' ? 'bg-pink-500' : 'bg-purple-600'} text-white shadow-lg`}><Sparkles size={24} /></div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${textMain}`}>Planner <span className="text-sm opacity-70 font-normal">({currentUser})</span></h1>
              <p className={`${textMuted} text-sm mt-1 flex items-center gap-2`}><Calendar size={14} /> {activeDay} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button onClick={downloadCSV} className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}><Download size={16} /> CSV</button>
            <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => setCurrentUser(null)} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500'}`} title="Cerrar Sesión"><LogOut size={20} /></button>
          </div>
        </header>

        {loading ? <div className="text-center py-20 animate-pulse text-slate-400">Cargando...</div> : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* HORARIO */}
            <div className="xl:col-span-1 space-y-4">
              <div className={`p-6 rounded-3xl border h-full flex flex-col ${bgCard}`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`font-bold flex items-center gap-2 ${textMain}`}><Clock size={20} /> Horario</h2>
                  <button onClick={() => setIsEditingSchedule(!isEditingSchedule)} className={`p-2 rounded-full transition-colors ${isEditingSchedule ? 'bg-red-500/20 text-red-500' : (isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>{isEditingSchedule ? <X size={18} /> : <Edit3 size={18} />}</button>
                </div>
                {isEditingSchedule && (
                  <form onSubmit={addScheduleItem} className={`p-4 rounded-xl mb-4 space-y-2 border animate-in fade-in ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-blue-100'}`}>
                    <input value={newClass.title} onChange={e => setNewClass({ ...newClass, title: e.target.value })} placeholder="Título" className={`w-full text-sm p-2 rounded border outline-none ${inputBg}`} />
                    <div className="flex gap-2">
                      <input type="time" value={newClass.start} onChange={e => setNewClass({ ...newClass, start: e.target.value })} className={`w-1/2 text-sm p-2 rounded border outline-none ${inputBg}`} />
                      <input type="time" value={newClass.end} onChange={e => setNewClass({ ...newClass, end: e.target.value })} className={`w-1/2 text-sm p-2 rounded border outline-none ${inputBg}`} />
                    </div>
                    <div className="flex gap-2">
                      <select value={newClass.day} onChange={e => setNewClass({ ...newClass, day: e.target.value })} className={`w-1/2 text-sm p-2 rounded border outline-none ${inputBg}`}>{days.map(d => <option key={d} value={d} className="text-slate-800">{d}</option>)}</select>
                      <select value={newClass.type} onChange={e => setNewClass({ ...newClass, type: e.target.value })} className={`w-1/2 text-sm p-2 rounded border outline-none ${inputBg}`}><option value="Presencial" className="text-slate-800">Presencial</option><option value="Virtual" className="text-slate-800">Virtual</option><option value="Práctica" className="text-slate-800">Práctica</option><option value="Rutina" className="text-slate-800">Rutina</option></select>
                    </div>
                    <input value={newClass.location} onChange={e => setNewClass({ ...newClass, location: e.target.value })} placeholder="Lugar" className={`w-full text-sm p-2 rounded border outline-none ${inputBg}`} />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Agregar</button>
                  </form>
                )}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
                  {days.map(day => <button key={day} onClick={() => setActiveDay(day)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeDay === day ? (currentUser === 'sofia' ? 'bg-pink-500 text-white' : 'bg-purple-600 text-white') : (isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>{day}</button>)}
                </div>
                <div className="space-y-3 overflow-y-auto flex-grow pr-1 custom-scrollbar">
                  {dailySchedule.length === 0 && <p className="text-center text-slate-400 py-10">Nada programado</p>}
                  {dailySchedule.map(task => {
                    const active = isHappeningNow(task.time_range);
                    return (
                      <div key={task.id} className={`p-4 rounded-2xl border transition-all ${task.is_completed ? (isDark ? 'bg-white/5 border-transparent opacity-50' : 'bg-slate-50 border-transparent opacity-60 grayscale') : active ? (isDark ? 'bg-white/10 border-purple-500/50 shadow-lg' : 'bg-white ring-2 ring-purple-500 shadow-lg') : (isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-slate-300')}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${active ? (currentUser === 'sofia' ? 'bg-pink-500 text-white' : 'bg-purple-600 text-white') : (isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>{getIcon(task.type)}</div>
                          <div className="flex-grow min-w-0">
                            <h3 className={`font-bold text-sm truncate ${textMain}`}>{task.title}</h3>
                            <div className={`flex justify-between items-center text-xs mt-1 ${textMuted}`}><span className={`font-mono px-1 rounded ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>{task.time_range}</span><span className="truncate ml-2">{task.location}</span></div>
                          </div>
                          {isEditingSchedule ? <button onClick={() => deleteScheduleItem(task.id)} className="text-red-400 hover:text-red-600 bg-red-500/10 p-2 rounded-lg"><Trash2 size={16} /></button> : <button onClick={() => toggleScheduleComplete(task.id, task.is_completed)}>{task.is_completed ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : <Circle className={`w-6 h-6 ${isDark ? 'text-slate-600 hover:text-emerald-400' : 'text-slate-300 hover:text-emerald-500'}`} />}</button>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* COLUMNA 2: HERRAMIENTAS */}
            <div className="xl:col-span-2">
              <div className={`rounded-3xl border shadow-sm overflow-hidden min-h-[700px] ${bgCard}`}>
                <div className={`flex border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <button onClick={() => setRightTab('kanban')} className={`flex-1 py-4 text-sm font-bold flex gap-2 justify-center ${rightTab === 'kanban' ? (isDark ? 'text-white border-b-2 border-white' : 'text-slate-800 border-b-2 border-slate-800') : 'text-slate-400'}`}><CheckSquare size={18} /> Tareas</button>
                  <button onClick={() => setRightTab('finance')} className={`flex-1 py-4 text-sm font-bold flex gap-2 justify-center ${rightTab === 'finance' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-400'}`}><Wallet size={18} /> Finanzas</button>
                  {currentUser === 'anthony' && <button onClick={() => setRightTab('gym')} className={`flex-1 py-4 text-sm font-bold flex gap-2 justify-center ${rightTab === 'gym' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400'}`}><Dumbbell size={18} /> Gym</button>}
                  <button onClick={() => setRightTab('habits')} className={`flex-1 py-4 text-sm font-bold flex gap-2 justify-center ${rightTab === 'habits' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400'}`}><Activity size={18} /> Hábitos</button>
                </div>
                <div className={`p-6 h-full ${isDark ? 'bg-black/20' : 'bg-slate-50/50'}`}>

                  {rightTab === 'kanban' && (
                    <div className="h-full">
                      <form onSubmit={addTask} className="flex gap-2 mb-6"><input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder={`Tarea para ${currentUser}...`} className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${inputBg}`} /><button type="submit" className="bg-slate-800 text-white px-4 rounded-xl hover:bg-slate-700 transition-transform hover:scale-105"><Plus size={20} /></button></form>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['todo', 'doing', 'done'].map(status => (
                          <div key={status} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
                            <h3 className="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wider">{status}</h3>
                            <div className="space-y-3">{tasks.filter(t => t.status === status).map(task => (<div key={task.id} className={`p-3 rounded-xl border shadow-sm group transition-all ${isDark ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white border-slate-200 hover:shadow-md'}`}><div className="flex justify-between items-start mb-2"><p className={`text-sm font-medium ${textMain}`}>{task.title}</p><button onClick={() => deleteItem('tasks', task.id, setTasks)} className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button></div><div className="flex justify-between">{status !== 'todo' && <button onClick={() => moveTask(task.id, status, 'prev')}><ArrowLeft size={16} className="text-slate-400 hover:text-purple-500" /></button>}<span />{status !== 'done' && <button onClick={() => moveTask(task.id, status, 'next')}><ArrowRight size={16} className="text-slate-400 hover:text-purple-500" /></button>}</div></div>))}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {rightTab === 'finance' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* BALANCE */}
                        <div className={`rounded-3xl p-8 text-white shadow-xl relative overflow-hidden ${totalBalance >= 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20'}`}><div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div><p className="opacity-90 text-sm font-medium">Balance Total</p><h2 className="text-5xl font-black mt-2 tracking-tight">${totalBalance.toFixed(2)}</h2></div>

                        {/* GRÁFICO PASTEL (Ingresos vs Gastos) */}
                        <div className={`rounded-3xl p-4 border flex flex-col items-center justify-center ${bgCard}`}>
                          <h4 className={`text-xs font-bold uppercase mb-2 ${textMuted}`}>Distribución</h4>
                          <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                              <Pie data={financePieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                {financePieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* GRÁFICO DE ÁREA (Historial) */}
                      <div className={`rounded-3xl p-4 border ${bgCard} h-64`}>
                        <h4 className={`text-xs font-bold uppercase mb-4 ${textMuted}`}>Historial de Movimientos</h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={financeChartData}>
                            <defs>
                              <linearGradient id="colorIng" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                              <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                            <XAxis dataKey="date" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={10} tickFormatter={(str) => str.substring(5)} />
                            <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: isDark ? 'none' : '1px solid #e2e8f0', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="ingresos" stroke="#10B981" fillOpacity={1} fill="url(#colorIng)" />
                            <Area type="monotone" dataKey="gastos" stroke="#EF4444" fillOpacity={1} fill="url(#colorGas)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <form onSubmit={addTransaction} className={`p-4 rounded-2xl border flex flex-wrap gap-2 ${bgCard}`}><input type="date" value={newFin.date} onChange={e => setNewFin({ ...newFin, date: e.target.value })} className={`p-2 rounded-lg text-xs outline-none ${inputBg}`} /><input value={newFin.desc} onChange={e => setNewFin({ ...newFin, desc: e.target.value })} placeholder="Gasto..." className={`flex-grow p-2 rounded-lg text-sm outline-none ${inputBg}`} /><input type="number" value={newFin.amount} onChange={e => setNewFin({ ...newFin, amount: e.target.value })} placeholder="$" className={`w-20 p-2 rounded-lg text-sm outline-none ${inputBg}`} /><select value={newFin.type} onChange={e => setNewFin({ ...newFin, type: e.target.value })} className={`p-2 rounded-lg text-sm outline-none ${inputBg}`}><option value="gasto" className="text-slate-800">Gasto</option><option value="ingreso" className="text-slate-800">Ingreso</option></select><button type="submit" className="bg-emerald-600 text-white px-4 rounded-lg font-bold hover:bg-emerald-700">+</button></form>
                      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">{finance.map(f => (<div key={f.id} className={`flex justify-between items-center p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}><div className="flex flex-col"><span className={`font-bold ${textMain}`}>{f.description}</span><span className="text-xs text-slate-400">{f.date}</span></div><div className="flex items-center gap-2"><span className={`font-bold ${f.type === 'ingreso' ? 'text-emerald-500' : 'text-red-500'}`}>{f.type === 'ingreso' ? '+' : '-'}${f.amount}</span><button onClick={() => deleteItem('finance', f.id, setFinance)}><Trash2 size={14} className="text-slate-400 hover:text-red-400" /></button></div></div>))}</div>
                    </div>
                  )}

                  {rightTab === 'gym' && (
                    <div className="space-y-6">
                      <form onSubmit={addGymLog} className={`p-4 rounded-2xl border flex gap-2 ${bgCard}`}><input value={newGym.exercise} onChange={e => setNewGym({ ...newGym, exercise: e.target.value })} placeholder="Ejercicio (ej: Press Banca)" className={`flex-grow p-2 rounded-lg text-sm outline-none ${inputBg}`} /><input value={newGym.weight} onChange={e => setNewGym({ ...newGym, weight: e.target.value })} placeholder="Kg" className={`w-16 p-2 rounded-lg text-sm outline-none ${inputBg}`} /><input value={newGym.reps} onChange={e => setNewGym({ ...newGym, reps: e.target.value })} placeholder="Reps" className={`w-16 p-2 rounded-lg text-sm outline-none ${inputBg}`} /><button type="submit" className="bg-blue-600 text-white px-4 rounded-lg font-bold hover:bg-blue-700"><Save size={16} /></button></form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{gymLogs.map(log => (<div key={log.id} className={`p-4 rounded-xl border shadow-sm relative group ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}><h3 className={`font-bold ${textMain}`}>{log.exercise}</h3><div className="flex gap-4 mt-2 text-sm text-slate-500"><span className="bg-blue-500/20 text-blue-500 px-2 rounded font-bold">{log.weight}</span><span>{log.reps}</span></div><span className="absolute top-4 right-4 text-xs text-slate-400">{log.date}</span><button onClick={() => deleteItem('gym_logs', log.id, setGymLogs)} className="absolute bottom-4 right-4 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button></div>))}</div>
                    </div>
                  )}

                  {/* HABITS TAB (UPDATED WITH CHART) */}
                  {rightTab === 'habits' && (
                    <div className="space-y-6">
                      {/* GRÁFICO DE HÁBITOS */}
                      <div className={`p-4 rounded-3xl border ${bgCard} h-48`}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={habitChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                            <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={10} interval={0} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }} />
                            <Bar dataKey="dias" fill="#F97316" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className={`p-4 rounded-2xl border ${bgCard}`}>
                        <h3 className={`font-bold mb-2 ${textMain}`}>Nuevo Hábito</h3>
                        <div className="flex flex-col gap-2">
                          <input value={newHabit.title} onChange={e => setNewHabit({ ...newHabit, title: e.target.value })} placeholder="Título..." className={`p-2 rounded-lg text-sm w-full outline-none ${inputBg}`} />
                          <div className="flex gap-2">
                            <select value={newHabit.freq} onChange={e => setNewHabit({ ...newHabit, freq: e.target.value })} className={`p-2 rounded-lg text-sm w-1/3 outline-none ${inputBg}`}>
                              <option value="Siempre" className="text-slate-800">Siempre (Todos los días)</option>
                              <option value="Semanal" className="text-slate-800">Semanal</option>
                            </select>
                            {newHabit.freq === 'Semanal' && (
                              <div className={`flex gap-1 flex-wrap flex-grow p-1 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                {days.map(d => <button key={d} onClick={() => toggleHabitDaySelection(d)} className={`w-8 h-8 rounded text-xs font-bold transition-all ${newHabit.selectedDays.includes(d) ? 'bg-orange-500 text-white' : (isDark ? 'bg-white/10 text-slate-400' : 'bg-white text-slate-400')}`}>{d.substring(0, 2)}</button>)}
                              </div>
                            )}
                          </div>
                          <button onClick={addHabit} className="bg-orange-500 text-white py-2 rounded-lg font-bold mt-1 hover:bg-orange-600 transition-transform hover:scale-[1.02]">Crear Hábito</button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {habits.map(h => {
                          const historyArr = h.history ? h.history.split(',') : [];
                          const isDone = historyArr.includes(new Date().toISOString().split('T')[0]);
                          return (
                            <div key={h.id} className={`p-4 rounded-2xl border flex justify-between items-center ${isDone ? (isDark ? 'bg-orange-500/10 border-orange-500/50' : 'bg-orange-50 border-orange-200') : (isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200')}`}>
                              <div>
                                <span className={`font-bold block ${textMain}`}>{h.title}</span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  {h.frequency === 'Semanal' ? `📅 ${h.target_days}` : <><InfinityIcon size={12} /> Siempre</>}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-orange-400 font-bold flex items-center gap-1"><Flame size={12} /> {historyArr.length}</span>
                                <button onClick={() => toggleHabitToday(h.id, h.history)} className={`px-4 py-1 rounded-lg text-xs font-bold ${isDone ? 'bg-orange-500 text-white' : (isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>{isDone ? 'Hecho' : 'Marcar'}</button>
                                <button onClick={() => deleteItem('habits', h.id, setHabits)} className="text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                              </div>
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