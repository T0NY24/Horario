# 🔐 Configurar Secrets de GitHub - Guía Rápida

Tu repositorio: **https://github.com/T0NY24/Horario**

## ⚠️ ¿Por qué NO poner tokens en el código?

❌ **MAL**: Poner tokens directamente en `deploy.yml`
- Se suben a GitHub (público)
- Cualquiera puede verlos y usar tu cuenta
- Riesgo de seguridad ALTO

✅ **BIEN**: Usar GitHub Secrets
- Encriptados y seguros
- Solo tú y GitHub Actions pueden verlos
- Práctica estándar de la industria

---

## 🚀 Paso a Paso (5 minutos)

### 1. Obtener Token de Vercel

1. Ve a: https://vercel.com/account/tokens
2. Haz clic en **"Create Token"**
3. Nombre: `GitHub Actions`
4. Scope: `Full Account`
5. **COPIA EL TOKEN** (solo lo verás una vez)

Ejemplo del token: `vercel_xxxxxxxxxxxxxxxxxxxxx`

---

### 2. Obtener IDs de Vercel (FÁCIL)

#### Opción A: Desde tu archivo local

Ya tienes un archivo `.vercel/project.json` después de hacer `vercel link`. 

```bash
# Ver el archivo
cat dashboard-ti/.vercel/project.json
```

Verás algo como:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxx"
}
```

#### Opción B: Crear el archivo ahora

```bash
cd C:\Users\anper\Downloads\Horario\dashboard-ti

# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Login y link
vercel login
vercel link

# Ver los IDs
type .vercel\project.json
```

---

### 3. Agregar Secrets a GitHub

1. Ve a: **https://github.com/T0NY24/Horario/settings/secrets/actions**

2. Haz clic en **"New repository secret"** 4 veces (uno para cada secret):

#### Secret 1: VERCEL_TOKEN
- **Name**: `VERCEL_TOKEN`
- **Value**: El token que copiaste en el Paso 1
- Clic en **Add secret**

#### Secret 2: VERCEL_ORG_ID  
- **Name**: `VERCEL_ORG_ID`
- **Value**: El `orgId` de `.vercel/project.json`
- Ejemplo: `team_xxxxxxxxxxxxxxxx`
- Clic en **Add secret**

#### Secret 3: VERCEL_PROJECT_ID
- **Name**: `VERCEL_PROJECT_ID`
- **Value**: El `projectId` de `.vercel/project.json`
- Ejemplo: `prj_xxxxxxxxxxxxxxxx`
- Clic en **Add secret**

#### Secret 4: VITE_DATABASE_URL
- **Name**: `VITE_DATABASE_URL`
- **Value**: Tu URL de base de datos del archivo `.env`
- **IMPORTANTE**: Asegúrate de copiar la URL completa
- Ejemplo: `postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.aws.neon.tech/neondb?sslmode=require`
- Clic en **Add secret**

---

## ✅ Verificar que Funcionó

Una vez agregados los 4 secrets, deberías ver:

```
VERCEL_TOKEN          Updated X minutes ago
VERCEL_ORG_ID         Updated X minutes ago  
VERCEL_PROJECT_ID     Updated X minutes ago
VITE_DATABASE_URL     Updated X minutes ago
```

---

## 🎯 Probar el Deploy

```bash
cd C:\Users\anper\Downloads\Horario\dashboard-ti

# Hacer un cambio pequeño
echo "# Test CI/CD" >> README.md

# Commit y push
git add .
git commit -m "test: verificar CI/CD"
git push
```

Luego ve a: **https://github.com/T0NY24/Horario/actions**

Verás el workflow ejecutándose. Si todo está bien:
- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Install Vercel CLI
- ✅ Pull Vercel Environment
- ✅ Build Project
- ✅ Deploy to Vercel

---

## 🐛 Troubleshooting

### Error: "Secret VERCEL_TOKEN not found"
→ Asegúrate que el nombre del secret sea EXACTAMENTE `VERCEL_TOKEN` (mayúsculas)

### Error: "Invalid token"
→ Genera un nuevo token en Vercel y reemplázalo

### Error: "Project not found"
→ Verifica que `VERCEL_PROJECT_ID` sea correcto

### Build exitoso pero página en blanco
→ Verifica que `VITE_DATABASE_URL` esté correcto

---

## 📺 Video Tutorial (Alternativa)

Si prefieres ver un video: https://www.youtube.com/watch?v=xxx (busca "GitHub Secrets tutorial")

---

## ✨ Una Vez Configurado

Después de configurar los secrets UNA VEZ, **nunca más tendrás que hacerlo**.

Cada push a `main` desplegará automáticamente a Vercel 🚀
