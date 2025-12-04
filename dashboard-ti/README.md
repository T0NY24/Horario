# Student Dashboard TI

Dashboard interactivo para gestión de horarios universitarios con tema claro y sincronización en la nube.

## 🚀 Demo en Vivo

[Ver Demo](https://tu-dashboard.vercel.app) (Configurar después del deploy)

## ✨ Características

- 📅 **Gestión de Horario Semanal** - Visualiza y organiza tu semana completa
- ✅ **Tracking de Tareas** - Marca actividades completadas con progreso en tiempo real
- 📝 **Notas Cloud** - Sincronización automática con base de datos Neon
- 🎨 **Tema Claro Moderno** - Diseño limpio con gradientes y animaciones suaves
- 📱 **Responsive** - Funciona perfectamente en móvil y desktop
- 🔄 **CI/CD Automático** - Deploy automático con GitHub Actions + Vercel

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS v3
- **Base de Datos**: Neon PostgreSQL (Serverless)
- **ORM**: @neondatabase/serverless
- **Iconos**: Lucide React
- **Deploy**: Vercel
- **CI/CD**: GitHub Actions

## 📦 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/dashboard-ti.git
cd dashboard-ti

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crea un archivo .env y agrega:
VITE_DATABASE_URL=tu_url_de_neon

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🗄️ Configuración de Base de Datos

Este proyecto usa **Instagres** para auto-generar una base de datos Neon temporal.

### Primera vez:
1. Ejecuta `npm run dev`
2. Instagres creará automáticamente una DB y la poblará con `init.sql`
3. **IMPORTANTE**: Revisa la terminal y copia el link de reclamo
4. Haz clic en el link para hacer la DB permanente en Neon

### Para producción:
1. Reclama tu base de datos en [Neon](https://neon.tech)
2. Copia la connection string
3. Agrégala como `VITE_DATABASE_URL` en:
   - Archivo `.env` (local)
   - Vercel Environment Variables (producción)
   - GitHub Secrets (CI/CD)

## 🚀 Deployment

### Deploy Automático (Recomendado)

Cada push a `main` despliega automáticamente vía GitHub Actions.

Ver guía completa: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y deploy
vercel login
vercel --prod
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter ESLint
```

## 📂 Estructura del Proyecto

```
dashboard-ti/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD workflow
├── src/
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entry point
│   └── index.css          # Estilos globales + Tailwind
├── init.sql               # Schema + seed data
├── vite.config.js         # Config Vite + Instagres
├── tailwind.config.js     # Tema personalizado
├── vercel.json            # Config Vercel
└── DEPLOYMENT.md          # Guía de deployment
```

## 🎨 Personalización

### Cambiar Colores
Edita `tailwind.config.js`:
```javascript
colors: { 
  light: '#f8fafc',    // Background
  card: '#ffffff',     // Tarjetas
  accent: '#8b5cf6',   // Color principal
}
```

### Modificar Horario
Edita `init.sql` y reinicia el servidor de desarrollo.

## 📄 Licencia

MIT License - Anthony Pérez

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Anthony Pérez - [@tu_twitter](https://twitter.com/tu_usuario)

Project Link: [https://github.com/TU_USUARIO/dashboard-ti](https://github.com/TU_USUARIO/dashboard-ti)
