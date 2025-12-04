# CI/CD Setup con GitHub Actions y Vercel

Este proyecto está configurado para despliegue automático usando GitHub Actions + Vercel.

## 🚀 Configuración Inicial

### 1. Crear Repositorio en GitHub

```bash
cd C:\Users\anper\Downloads\Horario\dashboard-ti
git init
git add .
git commit -m "Initial commit: Student Dashboard with Instagres"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/dashboard-ti.git
git push -u origin main
```

### 2. Configurar Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta (usa tu GitHub)
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio `dashboard-ti`
4. Vercel detectará automáticamente que es un proyecto Vite
5. **IMPORTANTE**: Antes de Deploy, agrega la variable de entorno:
   - **Name**: `VITE_DATABASE_URL`
   - **Value**: Tu URL de Neon (la misma del archivo `.env`)
   ```
   postgresql://neondb_owner:npg_6FdoHvESaxV4@ep-young-butterfly-agaerxp2-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
   ```
6. Haz clic en **Deploy**

### 3. Obtener Tokens para GitHub Actions

#### Vercel Token
1. Ve a [Vercel Settings → Tokens](https://vercel.com/account/tokens)
2. Crea un nuevo token
3. Copia el token

#### Vercel Project IDs
```bash
# Instala Vercel CLI
npm i -g vercel

# Login y obtén los IDs
vercel login
cd C:\Users\anper\Downloads\Horario\dashboard-ti
vercel link
```

Esto creará un archivo `.vercel/project.json` con:
- `orgId` (VERCEL_ORG_ID)
- `projectId` (VERCEL_PROJECT_ID)

### 4. Configurar Secrets en GitHub

Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agrega estos 4 secrets:

| Name | Value |
|------|-------|
| `VERCEL_TOKEN` | Token de Vercel del paso 3 |
| `VERCEL_ORG_ID` | `orgId` de `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` de `.vercel/project.json` |
| `VITE_DATABASE_URL` | URL completa de tu base de datos Neon |

## 📦 Workflow de CI/CD

### ¿Qué hace el workflow?

1. **Trigger**: Se activa en cada push a `main` o `master`
2. **Build**: 
   - Instala dependencias
   - Ejecuta el linter (opcional, no bloquea)
   - Construye el proyecto con `npm run build`
3. **Deploy**: 
   - Solo en push a main/master (no en PRs)
   - Despliega automáticamente a Vercel Production

### Comandos manuales

```bash
# Correr build localmente
npm run build

# Preview del build
npm run preview

# Deploy manual a Vercel
vercel --prod
```

## 🔄 Proceso de Desarrollo

### Flujo Normal
```bash
# 1. Hacer cambios en tu código
# 2. Commit y push
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push

# 3. GitHub Actions automáticamente:
#    - Ejecuta tests/lints
#    - Hace build
#    - Despliega a Vercel
```

### Ver el Deploy
- Ve a la pestaña **Actions** en GitHub para ver el progreso
- Una vez completado, tu app estará en: `https://dashboard-ti-XXXXXX.vercel.app`

## 🌐 URLs Importantes

- **GitHub Actions**: `https://github.com/TU_USUARIO/dashboard-ti/actions`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Production URL**: Se genera automáticamente por Vercel

## ⚠️ Notas Importantes

1. **Base de Datos Permanente**: Asegúrate de [reclamar tu base de datos Neon](https://neon.new/database/c82cd9db-1c5a-418a-b58e-cfc20e842624) para que no expire en 72 horas

2. **Archivo `.env`**: 
   - NUNCA hagas commit del archivo `.env` (ya está en `.gitignore`)
   - Las variables se configuran en Vercel/GitHub Secrets

3. **Environment Variables**:
   - Local: usa `.env`
   - Vercel: configura en dashboard
   - GitHub Actions: usa Secrets

## 🐛 Troubleshooting

### Build falla en GitHub Actions
- Verifica que `VITE_DATABASE_URL` esté en GitHub Secrets
- Revisa los logs en la pestaña Actions

### Deploy exitoso pero página en blanco
- Verifica que `VITE_DATABASE_URL` esté en Vercel
- Ve a Vercel → Settings → Environment Variables

### Database connection error en producción
- Asegúrate que la URL tiene `sslmode=require`
- Verifica que la base de datos Neon esté activa
