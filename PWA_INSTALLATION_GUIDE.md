# LifeHub PWA Installation Guide

## 🚀 Quick Start - Instalar LifeHub como APP

### El Problema
Chrome en Android requiere **HTTPS** para mostrar el botón de instalación. Tu servidor local HTTP no cumple este requisito.

### La Solución: ngrok (Crea un túnel HTTPS)

#### Paso 1: Instala ngrok (una sola vez)
```bash
npm install -g ngrok
```

#### Paso 2: Starts dos terminales simultáneamente

**Terminal 1 - Dev server:**
```bash
npm run dev -- --host
```
Verás:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.0.186:5173/
```

**Terminal 2 - ngrok tunnel:**
```bash
ngrok http 5173
```
Verás algo como:
```
Forwarding   https://abc-123-def-456.ngrok.io -> http://localhost:5173
```

#### Paso 3: En tu celular (Android Chrome)
1. Abre **Chrome** en tu Android
2. Ve a la URL del ngrok: `https://abc-123-def-456.ngrok.io`
3. **Espera 2-3 segundos**
4. ¡Deberías ver un banner "Instalar LifeHub" en la parte inferior!
5. Presiona "Instalar"
6. Confirma en el popup de Chrome
7. ¡Listo! La app se instalará en tu home screen

#### Paso 4: Abre tu app
- La app aparecerá como icon en home screen
- Se abre **sin la barra de Chrome** (modo fullscreen)
- Funciona offline completamente
- Se actualiza automáticamente

---

## 🍎 iOS (iPhone/iPad)

iOS no soporta PWA como Android, pero puedes agregar a pantalla de inicio:

1. Abre **Safari**
2. Ve a tu app (IP local o ngrok URL)
3. Presiona el botón **Compartir** (↗️) abajo a la derecha
4. Busca **"Agregar a pantalla de inicio"**
5. Confirma el nombre
6. ¡Listo! Aparecerá como un "web clip" en tu home screen

---

## 🆚 Comparación

| Aspecto | HTTP Local | ngrok + HTTPS |
|--------|-----------|---------------|
| Banner de instalación | ❌ No aparece | ✅ Aparece automático |
| Se instala como app | ❌ No | ✅ Sí |
| Abre sin Chrome UI | ❌ No | ✅ Sí |
| Offline | ✅ Sí | ✅ Sí |
| Fácil para pruebas | ✅ Sí | ⚠️ Necesita ngrok |

---

## 🔧 Troubleshooting

### No veo el banner en ngrok
1. Verifica que estés usando **HTTPS** (no HTTP)
2. Recarga la página completamente (Ctrl+F5)
3. Espera 2-3 segundos
4. Revisa la consola (F12) para logs `[PWA]`

### Banner aparece pero "Instalar" no funciona
1. Verifica que el manifest.json sea válido
2. En DevTools → Application → Manifest, busca errores
3. Asegúrate que Service Worker esté instalado

### App instalada pero abre en Chrome
- Esto no debería pasar si instalaste via ngrok correctamente
- Intenta desinstalando y reinstalando

---

## 📱 Cómo Verificar que Está Instalado Correctamente

Cuando abras la app instalada, en la URL verás solo la URL del sitio sin:
- ❌ Barra de Chrome (arriba y abajo)
- ❌ Botón atrás del navegador  
- ❌ Barra de búsqueda
- ✅ Solo tu app fullscreen

---

## 🌐 Deploy a Producción

Cuando hagas deploy a un servidor con HTTPS real (Netlify, Vercel, Firebase Hosting, etc.):
- ✅ PWA Installation funciona directo sin ngrok
- ✅ No necesitas ngrok más
- ✅ Todo es automático

---

## Comandos Útiles

```bash
# Dev Server (para ngrok)
npm run dev -- --host

# Build para producción
npm run build

# Preview del build
npm run preview

# Generar iconos (si cambias el logo)
npm run generate:icons
```

---

## 📖 Más Info

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google - Install your PWA](https://web.dev/install-criteria/)
- [ngrok Documentation](https://ngrok.com/docs)

---

**¿Aún hay problemas?** Abre DevTools (F12) en Android Chrome y busca errores en la consola.
