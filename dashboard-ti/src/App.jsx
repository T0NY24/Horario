import { useState, useEffect } from 'react';
import { neon } from '@neondatabase/serverless'; // Conexión directa
import { CheckCircle2, Circle, Clock, MapPin, Music, Monitor, Bus, Dumbbell, Save, AlertTriangle } from 'lucide-react';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Obtenemos la conexión gracias al plugin de Instagres
const sql = neon(import.meta.env.VITE_DATABASE_URL);

function App() {
  const [schedule, setSchedule] = useState([]);
  const [activeDay, setActiveDay] = useState('Lunes');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    const todayIndex = new Date().getDay();
    if (todayIndex >= 1 && todayIndex <= 6) setActiveDay(days[todayIndex - 1]);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Consultas SQL directas
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
    // Actualización Optimista (UI instantánea)
    const newStatus = !currentStatus;
    setSchedule(prev => prev.map(t => t.id === id ? { ...t, is_completed: newStatus } : t));

    // Guardar en DB
    await sql`UPDATE schedule SET is_completed = ${newStatus} WHERE id = ${id}`;
  };

  const saveNote = async () => {
    await sql`DELETE FROM notes`;
    await sql`INSERT INTO notes (content) VALUES (${note})`;
    alert("Nota guardada en la nube ☁️");
  };

  // Filtrar tareas y calcular progreso
  const dailyTasks = schedule.filter(t => t.day === activeDay);
  const progress = dailyTasks.length > 0
    ? Math.round((dailyTasks.filter(t => t.is_completed).length / dailyTasks.length) * 100)
    : 0;

  const getIcon = (type) => {
    switch (type) {
      case 'Virtual': return <Monitor className="text-blue-600" />;
      case 'Transporte': return <Bus className="text-orange-600" />;
      case 'Música': return <Music className="text-pink-600" />;
      case 'Deporte': return <Dumbbell className="text-green-600" />;
      default: return <Clock className="text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
            TI Dashboard
          </h1>
          <p className="text-gray-600">Anthony Pérez • {activeDay}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-accent">{progress}%</div>
          <span className="text-xs text-gray-500">PROGRESO</span>
        </div>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-5 py-2 rounded-full font-medium transition-all ${activeDay === day
                ? 'bg-accent text-white shadow-lg shadow-purple-400/50'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? <div className="text-center py-10 text-gray-600">Conectando a Neon DB...</div> : dailyTasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${task.is_completed
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : 'bg-white border-gray-200 hover:border-accent/50 shadow-sm hover:shadow-md'
                }`}
            >
              <div className="flex items-center gap-5">
                <div className="p-3 bg-gray-100 rounded-xl">
                  {getIcon(task.type)}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="bg-purple-100 text-accent px-2 py-0.5 rounded font-mono text-xs">{task.time_range}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {task.location}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => toggleTask(task.id, task.is_completed)}>
                {task.is_completed
                  ? <CheckCircle2 className="text-green-600 w-8 h-8" />
                  : <Circle className="text-gray-400 hover:text-accent w-8 h-8 transition-colors" />
                }
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 h-fit sticky top-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg flex gap-2 items-center text-gray-900">
              📝 Notas
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Cloud</span>
            </h2>
            <button onClick={saveNote} className="hover:text-accent text-gray-600">
              <Save size={20} />
            </button>
          </div>
          <textarea
            className="w-full h-60 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none font-mono text-sm"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escribe aquí..."
          />

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="text-yellow-700 font-bold flex items-center gap-2 text-sm">
              <AlertTriangle size={16} /> IMPORTANTE
            </h3>
            <p className="text-xs text-yellow-700/80 mt-1">
              Esta base de datos es temporal (72h). Revisa tu terminal para reclamarla en Neon o se borrará.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
