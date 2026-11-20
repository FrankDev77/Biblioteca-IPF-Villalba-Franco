Biblioteca IPF

App de la biblioteca del Instituto Politécnico Formosa. TP integrador del Taller Complementario React Native II.

Cómo correr
bash
npm install
npx expo start

Escaneá el QR con Expo Go en un teléfono real (Android o iOS).

SDK de Expo: (poner el que arroje npx expo --version).
Probado en: (teléfono/modelo).
Árbol de src/app
app/
├─ _layout.tsx                # Stack raíz con Stack.Protected y Provider
├─ +not-found.tsx             # 404
├─ (tabs)/
│  ├─ _layout.tsx             # Tabs: Catálogo y Mis reservas
│  ├─ index.tsx               # /       (Catálogo)
│  ├─ libro/[isbn].tsx        # /libro/[isbn]
│  └─ reservas.tsx            # /reservas
├─ buscar.tsx                 # /buscar?q=
├─ escanear.tsx               # /escanear
├─ reservar/[isbn].tsx        # /reservar/[isbn]   (modal)
├─ permisos/[recurso].tsx     # /permisos/[recurso] (modal)
├─ login.tsx                  # /login             (modal)
├─ mostrador.tsx              # /mostrador         (protegida)
└─ reserva.tsx                # redirect → /reservas
app.json — bloque plugins
json
"plugins": [
  "expo-router",
  ["expo-camera", {
    "cameraPermission": "Usamos la cámara para escanear el código de barras del libro y abrir su detalle sin que tengas que escribir el ISBN.",
    "microphonePermission": false,
    "recordAudioAndroid": false
  }],
  ["expo-notifications", { "icon": "./assets/notification-icon.png", "color": "#2563EB" }]
]
Tabla de permisos
Recurso	Módulo	Cuándo se pide	Alternativa si se niega
Cámara	expo-camera	Al entrar a /escanear después de "Continuar"	Escribir ISBN a mano
Notificaciones	expo-notifications	Al activar el interruptor "Recordarme" en /reservas	Aviso dentro de la app al vencer
blockedPermissions

android.permission.RECORD_AUDIO está en android.blockedPermissions porque expo-camera lo agrega por defecto y la app no graba audio.

Deep links de prueba
bibliotecaipf://libro/9788437604947
bibliotecaipf://libro/123
bibliotecaipf://buscar?q=borges
bibliotecaipf://mostrador
bibliotecaipf://reserva
bibliotecaipf://escanear
Scripts
bash
npx tsc --noEmit    # chequeo de tipos
npx expo lint       # lint