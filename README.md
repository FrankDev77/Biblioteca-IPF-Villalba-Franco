# Biblioteca IPF

App de la biblioteca del Instituto Politécnico Formosa. TP integrador del
Taller Complementario React Native II.

## Cómo correr

```bash
npm install --legacy-peer-deps
npx expo start
```

Escaneá el QR con Expo Go en un teléfono real (Android o iOS).

`--legacy-peer-deps` hace falta porque `react-dom` (peer de expo-router para web)
pide una versión de `react` un parche más nueva que la que fija el SDK.

- SDK de Expo: **58** (`expo@58.0.26`).
- Probado en: (teléfono/modelo).

## Credenciales del mostrador

Para entrar al mostrador desde "Personal" en el header del catálogo:

- Usuario: `biblioteca`
- Clave: `ipf2026`

## Árbol de `src/app`

```
app/
├─ _layout.tsx                    # Provider + NavegacionRaiz (Stack raíz con Stack.Protected)
├─ +not-found.tsx                 # 404 con la ruta que no existe
├─ (tabs)/
│  ├─ _layout.tsx                 # Tabs: Catálogo y Mis reservas
│  ├─ (catalogo)/                 # Stack propio de la tab Catálogo
│  │  ├─ _layout.tsx              # Stack: catálogo → detalle
│  │  ├─ index.tsx                # /                (Catálogo)
│  │  └─ libro/[isbn].tsx         # /libro/[isbn]
│  └─ reservas.tsx                # /reservas
├─ buscar.tsx                     # /buscar?q=
├─ escanear.tsx                   # /escanear        (?manual=1 para escribir el ISBN)
├─ reservar/[isbn].tsx            # /reservar/[isbn]   (modal)
├─ permisos/[recurso].tsx         # /permisos/[recurso] (modal)
├─ login.tsx                      # /login             (modal)
├─ mostrador.tsx                  # /mostrador         (protegida)
└─ reserva.tsx                    # redirect → /reservas
```

## Árbol de `src`

```
src/
├─ app/            # solo rutas de Expo Router
├─ components/     # un componente por archivo (cards, estados, permisos, escáner)
├─ constants/      # tema.ts: paletas claro/oscuro, espaciados, tipografía
├─ context/        # BibliotecaProvider: préstamos, colas, vistos, sesión
├─ data/           # libros.ts (catálogo fijo del TP)
├─ estructuras/    # Pila y Cola + tests
├─ hooks/          # useLibros, useBuscarLibros, usePermiso, useRecordatorio, useTema...
├─ lib/            # api.ts (del TP), fechas, isbn, notificaciones, persistencia, haptica
└─ types/          # index.ts (del TP) y biblioteca.ts
```

## `app.json` — bloque `plugins`

```json
"plugins": [
  "expo-router",
  [
    "expo-camera",
    {
      "cameraPermission": "Usamos la cámara para escanear el código de barras del libro y abrir su detalle sin que tengas que escribir el ISBN.",
      "microphonePermission": false,
      "recordAudioAndroid": false
    }
  ],
  [
    "expo-notifications",
    {
      "icon": "./assets/notification-icon.png",
      "color": "#2563EB"
    }
  ]
]
```

## Tabla de permisos

| Permiso | Plataforma | Cuándo se pide | Alternativa si se niega |
|---|---|---|---|
| Cámara (`NSCameraUsageDescription`) | iOS | Al entrar a `/escanear`, después de la pantalla previa y "Continuar" | Escribir el ISBN a mano |
| Cámara (`android.permission.CAMERA`) | Android | Al entrar a `/escanear`, después de la pantalla previa y "Continuar" | Escribir el ISBN a mano |
| Notificaciones (`POST_NOTIFICATIONS`, Android 13+) | Android | Al activar el interruptor "Recordarme" en `/reservas` | El vencimiento se ve en `/reservas` (naranja si falta un día, rojo si venció) |
| Micrófono (`android.permission.RECORD_AUDIO`) | Android | Nunca: está bloqueado | No aplica |

## `blockedPermissions`

`android.permission.RECORD_AUDIO` está bloqueado porque `expo-camera` lo agrega por defecto para grabar video y la app solo escanea códigos, nunca graba audio.

## Deep links de prueba

| Deep link | Qué tiene que pasar |
|---|---|
| `bibliotecaipf://libro/9788437604947` | Abre el detalle de Rayuela |
| `bibliotecaipf://libro/123` | "ISBN inválido: debe tener 13 dígitos" con botón al catálogo |
| `bibliotecaipf://buscar?q=borges` | Abre el buscador con "borges" escrito y sus resultados |
| `bibliotecaipf://mostrador` (con sesión) | Abre el mostrador |
| `bibliotecaipf://mostrador` (sin sesión) | No entra: `Stack.Protected` lo manda al catálogo |
| `bibliotecaipf://reserva` | Redirige a `/reservas` |
| `bibliotecaipf://escanear` (sin permiso de cámara) | Muestra primero la pantalla previa del permiso |
| `bibliotecaipf://inexistente` | Pantalla 404 con la ruta mostrada |

## Scripts

```bash
npm test            # tests de Pila y Cola (jest-expo)
npx expo lint       # lint
npx tsc --noEmit    # chequeo de tipos
```

## Dev build

```bash
npm install -g eas-cli
eas login
eas build --profile preview --platform android
```

## Decisiones de diseño

- La Pila de vistos y las Colas de espera se mutan en el lugar; un contador de versión (`useReducer`) fuerza el re-render del Provider después de cada cambio.
- Los préstamos de otras personas se cuentan en `prestamosExternos` (cantidad por ISBN) en lugar de duplicar el catálogo o inventar un modelo de usuarios; `ejemplaresDisponibles` se calcula al vuelo.
- El estado de un permiso es un discriminated union (`cargando`, `concedido`, `preguntable`, `bloqueado`) que se consume con un `switch` exhaustivo.
- El detalle se remonta con `key={isbn}`, así una respuesta del libro anterior no pisa al nuevo.
