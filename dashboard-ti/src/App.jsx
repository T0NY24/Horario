import { useState, useEffect } from 'react';
import { neon } from '@neondatabase/serverless';
import { CheckCircle2, Circle, Clock, MapPin, Music, Monitor, Bus, Dumbbell, Save, AlertCircle, Coffee, Moon, Utensils, BookOpen } from 'lucide-react';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const sql = neon(import.meta.env.VITE_DATABASE_URL);

function App() {
  const [schedule, setSchedule] = useState([]);
  const [activeDay, setActiveDay] = useState('Lunes');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const todayIndex = new Date().getDay();
    if (todayIndex >= 1 && todayIndex <= 6) setActiveDay(days[todayIndex - 1]);

    // Actualizar reloj cada minuto para el "En Vivo"
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    fetchData();
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      // Ordenamos por 'id' (funciona con cualquier versión de la DB)
      const scheduleData = await sql`SELECT * FROM schedule ORDER BY id ASC`;
      const notesData = await sql`SELECT content FROM notes LIMIT 1`;

      setSchedule(scheduleData);
      if (notesData.length > 0) setNote(notesData[0].content);
      setLoading(false);
    } catch (error) {
      console.error("Error DB:", error);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setSchedule(prev => prev.map(t => t.id === id ? { ...t, is_completed: newStatus } : t));
    await sql`UPDATE schedule SET is_completed = ${newStatus} WHERE id = ${id}`;
  };

  const saveNote = async () => {
    await sql`DELETE FROM notes`;
    await sql`INSERT INTO notes (content) VALUES (${note})`;
    alert("Nota guardada en la nube ☁️");
  };

  const dailyTasks = schedule.filter(t => t.day === activeDay);
  const progress = dailyTasks.length > 0
    ? Math.round((dailyTasks.filter(t => t.is_completed).length / dailyTasks.length) * 100)
    : 0;

  // Lógica para detectar si una tarea está ocurriendo AHORA
  const isHappeningNow = (timeRange) => {
    // Si no es el día activo, no resaltar
    const todayName = days[new Date().getDay() - 1];
    if (activeDay !== todayName) return false;

    try {
      const [start, end] = timeRange.split(' - ');
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);

      const now = currentTime;
      const currentH = now.getHours();
      const currentM = now.getMinutes();
      const currentTotal = currentH * 60 + currentM;

      const startTotal = startH * 60 + startM;

      // Manejo especial para rangos que cruzan medianoche (ej: 22:00 - 06:00)
      let endTotal = endH * 60 + endM;
      if (endTotal < startTotal) endTotal += 24 * 60;

      return currentTotal >= startTotal && currentTotal < endTotal;
    } catch (e) {
      return false;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Virtual': return <Monitor className="text-blue-600" />;
      case 'Transporte': return <Bus className="text-orange-500" />;
      case 'Música': return <Music className="text-pink-600" />;
      case 'Deporte': return <Dumbbell className="text-emerald-600" />;
      case 'Rutina': return <Clock className="text-gray-500" />;
      case 'Sueño': return <Moon className="text-indigo-900" />;
      case 'Comida': return <Utensils className="text-red-400" />;
      case 'Estudio': return <BookOpen className="text-violet-600" />;
      default: return <Clock className="text-gray-400" />;
    }
  };

  // Color de fondo dinámico según el tipo de tarea
  const getBgColor = (type, isActive) => {
    if (isActive) return 'bg-white ring-2 ring-accent shadow-lg scale-[1.02]';
    switch (type) {
      case 'Transporte': return 'bg-orange-50/50';
      case 'Sueño': return 'bg-indigo-50/50';
      case 'Música': return 'bg-pink-50/50';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-slate-50 text-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Agenda <span className="text-accent">Pro</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {activeDay} • Hora actual: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">{progress}%</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Productividad</div>
            </div>
            {/* Circular Progress */}
            <div className="w-14 h-14 rounded-full border-[5px] border-slate-100 flex items-center justify-center relative">
              <div
                className="absolute inset-0 rounded-full border-[5px] border-accent border-t-transparent transition-all duration-500"
                style={{ transform: `rotate(${progress * 3.6}deg)` }}
              ></div>
              <CheckCircle2 size={24} className="text-accent" />
            </div>
          </div>
        </header>

        {/* DAY SELECTOR */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap ${activeDay === day
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 transform -translate-y-1'
                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN SCHEDULE LIST */}
          <div className="lg:col-span-2 space-y-4 relative">
            {/* Línea de tiempo visual */}
            <div className="absolute left-8 top-5 bottom-5 w-0.5 bg-slate-200 z-0 hidden md:block"></div>

            {loading ? (
              <div className="text-center py-12 text-slate-400">Sincronizando...</div>
            ) : dailyTasks.map((task, index) => {
              const active = isHappeningNow(task.time_range);
              return (
                <div
                  key={task.id}
                  className={`relative z-10 flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${task.is_completed
                    ? 'bg-slate-100 border-transparent opacity-60 grayscale'
                    : `${getBgColor(task.type, active)} border-slate-100`
                    }`}
                >
                  {/* Badge de "AHORA" */}
                  {active && (
                    <div className="absolute -top-3 left-10 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-bounce">
                      AHORA
                    </div>
                  )}

                  <div className="flex items-center gap-5 w-full">
                    <div className={`p-3.5 rounded-2xl shadow-sm ${active ? 'bg-accent text-white' : 'bg-white text-slate-600 border border-slate-100'}`}>
                      {getIcon(task.type)}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-bold text-lg ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </h3>
                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${active ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-500'}`}>
                          {task.time_range}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium text-xs uppercase tracking-wide opacity-70">
                          <MapPin size={10} /> {task.location}
                        </span>
                        {task.type !== 'Rutina' && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 uppercase">
                            {task.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTask(task.id, task.is_completed)}
                    className="ml-4 focus:outline-none transform hover:scale-110 transition-transform"
                  >
                    {task.is_completed
                      ? <CheckCircle2 className="text-emerald-500 w-7 h-7" />
                      : <Circle className="text-slate-300 hover:text-accent w-7 h-7" />
                    }
                  </button>
                </div>
              );
            })}
            {dailyTasks.length === 0 && !loading && (
              <div className="text-center p-10 text-slate-400 italic bg-white rounded-2xl border border-slate-100">
                Día libre. ¡Disfruta!
              </div>
            )}
          </div>

          {/* SIDEBAR: NOTES & INFO */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-yellow-100 p-1.5 rounded-lg text-yellow-700"><BookOpen size={16} /></span>
                  Notas
                </h2>
                <button onClick={saveNote} className="text-slate-400 hover:text-accent hover:bg-slate-50 p-2 rounded-full transition-all">
                  <Save size={20} />
                </button>
              </div>
              <textarea
                className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none font-medium text-sm leading-relaxed"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Objetivos del día..."
              />

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl">
                  <AlertCircle className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Estado: Cloud Sync</h4>
                    <p className="text-xs text-blue-700/70 mt-1 leading-relaxed">
                      Tus datos están seguros en Neon. Si es una DB temporal, recuerda reclamarla en 72h.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;