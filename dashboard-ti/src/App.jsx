import { useState, useEffect } from 'react';
import { neon } from '@neondatabase/serverless';
import { CheckCircle2, Circle, Clock, MapPin, Music, Monitor, Bus, Dumbbell, Save, Plus, Trash2, AlertCircle, Calendar, CheckSquare, ChevronDown, ChevronUp, History } from 'lucide-react';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const sql = neon(import.meta.env.VITE_DATABASE_URL);

function App() {
  // --- ESTADOS ---
  const [schedule, setSchedule] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeDay, setActiveDay] = useState('Lunes');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Estado para Planner
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Media');
  const [showCompletedHistory, setShowCompletedHistory] = useState(false);

  useEffect(() => {
    const todayIndex = new Date().getDay();
    if (todayIndex >= 1 && todayIndex <= 6) setActiveDay(days[todayIndex - 1]);

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    fetchData();
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const scheduleData = await sql`SELECT * FROM schedule ORDER BY sort_order ASC`;
      const notesData = await sql`SELECT content FROM notes LIMIT 1`;
      const tasksData = await sql`SELECT * FROM tasks ORDER BY id DESC`;

      setSchedule(scheduleData);
      setTasks(tasksData);
      if (notesData.length > 0) setNote(notesData[0].content);

      setLoading(false);
    } catch (error) {
      console.error("Error DB:", error);
    }
  };

  // --- FUNCIONES ---
  const toggleScheduleItem = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setSchedule(prev => prev.map(t => t.id === id ? { ...t, is_completed: newStatus } : t));
    await sql`UPDATE schedule SET is_completed = ${newStatus} WHERE id = ${id}`;
  };

  const saveNote = async () => {
    await sql`DELETE FROM notes`;
    await sql`INSERT INTO notes (content) VALUES (${note})`;
    alert("Nota guardada 💾");
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const result = await sql`INSERT INTO tasks (title, priority) VALUES (${newTaskTitle}, ${newTaskPriority}) RETURNING *`;
    setTasks([result[0], ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: newStatus } : t));
    await sql`UPDATE tasks SET is_completed = ${newStatus} WHERE id = ${id}`;
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await sql`DELETE FROM tasks WHERE id = ${id}`;
  };

  // --- UI HELPERS ---
  const isHappeningNow = (timeRange) => {
    const todayName = days[new Date().getDay() - 1];
    if (activeDay !== todayName) return false;
    try {
      const [start, end] = timeRange.split(' - ');
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const now = currentTime;
      const currentTotal = now.getHours() * 60 + now.getMinutes();
      const startTotal = startH * 60 + startM;
      let endTotal = endH * 60 + endM;
      if (endTotal < startTotal) endTotal += 24 * 60;
      return currentTotal >= startTotal && currentTotal < endTotal;
    } catch (e) { return false; }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'bg-red-50 text-red-600 border-red-100';
      case 'Media': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Baja': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Virtual': return <Monitor className="text-blue-600" />;
      case 'Transporte': return <Bus className="text-orange-500" />;
      case 'Música': return <Music className="text-pink-600" />;
      case 'Deporte': return <Dumbbell className="text-emerald-600" />;
      default: return <Clock className="text-slate-400" />;
    }
  };

  // Filtrados
  const dailySchedule = schedule.filter(t => t.day === activeDay);
  const progress = dailySchedule.length > 0
    ? Math.round((dailySchedule.filter(t => t.is_completed).length / dailySchedule.length) * 100)
    : 0;

  // Separamos tareas pendientes de completadas
  const pendingTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Agenda <span className="text-accent">Pro</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <Calendar size={14} /> {activeDay} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-bold text-slate-800">{progress}%</div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Rendimiento Día</div>
            </div>
            <div className="w-14 h-14 rounded-full border-[5px] border-slate-100 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-[5px] border-accent border-t-transparent transition-all duration-500" style={{ transform: `rotate(${progress * 3.6}deg)` }}></div>
              <CheckCircle2 size={24} className="text-accent" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* HORARIO (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-5 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeDay === day
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-100'
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {loading ? <div className="text-center py-12 text-slate-400">Cargando...</div> : dailySchedule.map((task) => {
                const active = isHappeningNow(task.time_range);
                return (
                  <div key={task.id} className={`relative flex items-center justify-between p-5 rounded-2xl border transition-all ${task.is_completed ? 'bg-slate-50 opacity-60 grayscale border-transparent' : active ? 'bg-white ring-2 ring-accent shadow-lg scale-[1.01]' : 'bg-white border-slate-100'
                    }`}>
                    {active && <div className="absolute -top-2 left-4 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">EN VIVO</div>}
                    <div className="flex items-center gap-4 w-full">
                      <div className={`p-3 rounded-xl ${active ? 'bg-accent text-white' : 'bg-slate-50 text-slate-500'}`}>{getIcon(task.type)}</div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-slate-800">{task.title}</h3>
                          <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{task.time_range}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1"><MapPin size={12} /> {task.location}</div>
                      </div>
                    </div>
                    <button onClick={() => toggleScheduleItem(task.id, task.is_completed)} className="ml-4">
                      {task.is_completed ? <CheckCircle2 className="text-emerald-500 w-7 h-7" /> : <Circle className="text-slate-300 hover:text-accent w-7 h-7" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PLANNER & NOTAS (1/3) */}
          <div className="space-y-6">

            {/* PLANNER CARD */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <CheckSquare size={20} className="text-accent" /> Planner
                </h2>
                <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-full">{pendingTasks.length} activas</span>
              </div>

              <form onSubmit={addTask} className="mb-6 space-y-3">
                <input
                  type="text"
                  placeholder="Añadir tarea..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="Alta">🔥 Alta</option>
                    <option value="Media">⚡ Media</option>
                    <option value="Baja">☕ Baja</option>
                  </select>
                  <button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg py-2 transition-colors flex justify-center items-center gap-2">
                    <Plus size={14} />
                  </button>
                </div>
              </form>

              {/* LISTA DE PENDIENTES */}
              <div className="space-y-2 mb-4">
                {pendingTasks.length === 0 && <p className="text-center text-xs text-slate-400 py-2">Todo al día 🎉</p>}
                {pendingTasks.map(task => (
                  <div key={task.id} className="group flex items-start gap-3 p-3 rounded-xl border bg-white border-slate-100 hover:shadow-sm transition-all">
                    <button onClick={() => toggleTask(task.id, task.is_completed)} className="mt-0.5 shrink-0">
                      <div className="w-5 h-5 border-2 border-slate-300 rounded hover:border-accent transition-colors"></div>
                    </button>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-slate-700 leading-tight">{task.title}</p>
                      <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>

              {/* HISTORIAL DESPLEGABLE */}
              {completedTasks.length > 0 && (
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <button
                    onClick={() => setShowCompletedHistory(!showCompletedHistory)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="flex items-center gap-2"><History size={14} /> Completadas ({completedTasks.length})</span>
                    {showCompletedHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {/* Lista Oculta */}
                  {showCompletedHistory && (
                    <div className="space-y-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {completedTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-slate-50 opacity-60">
                          <button onClick={() => toggleTask(task.id, task.is_completed)} className="shrink-0">
                            <div className="w-5 h-5 bg-emerald-500 rounded text-white flex items-center justify-center"><CheckCircle2 size={14} /></div>
                          </button>
                          <p className="text-sm font-medium text-slate-500 line-through flex-grow">{task.title}</p>
                          <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* NOTAS */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-700 text-sm">Notas Rápidas</h3>
                <button onClick={saveNote} className="text-slate-400 hover:text-accent"><Save size={16} /></button>
              </div>
              <textarea
                className="w-full h-32 bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-600 focus:outline-none focus:border-accent resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;