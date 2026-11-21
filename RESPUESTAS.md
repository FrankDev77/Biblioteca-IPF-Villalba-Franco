# Respuestas — TP integrador Biblioteca IPF

> **Nota de autoría:** este archivo es un borrador. Cada respuesta tiene que
> reescribirse con tus palabras antes de entregar. El TP penaliza
> "respuestas idénticas entre estudiantes". Verificá los números de línea
> contra el estado actual del repo con `grep -n`.

## Parte B — Estado, efectos y renderizado

### B1. Ciclo de vida de useLibros

> Explicá qué pasa desde que se monta la pantalla del catálogo hasta que se
> ve la lista: estados, efecto, limpieza y qué ocurre al reintentar.

**Respuesta:**

El hook devuelve `{ libros, cargando, error, reintentar }`. El ciclo tiene
tres renders en el caso feliz y cuatro cuando falla y se reintenta.

**Render 0 (montaje):** React llama a la función del hook por primera vez.
`libros = []`, `cargando = true`, `error = null`, `intento = 0`. El JSX
devuelve `<EsqueletoCatalogo />`. Recién después del render React ejecuta
los efectos: el único efecto del hook corre, declara `let cancelado = false`,
llama `obtenerLibros()` y queda esperando la promesa.

**Render 1 (datos llegan OK):** la promesa resuelve. Como `cancelado` sigue
en `false`, hacen `setLibros(datos)` y `setCargando(false)`. React re-renderiza:
`libros = [...]`, `cargando = false`, `error = null`. Ahora el JSX devuelve
el `FlatList` con los libros.

**Render 1' (falla):** la promesa rechaza con `new Error("No se pudo conectar
con la biblioteca.")`. Si `cancelado` es `false`, se setean
`error = "No se pudo..."` y `cargando = false`. El JSX devuelve `EstadoError`
con el botón "Reintentar".

**Al tocar "Reintentar":** `reintentar()` hace tres cosas en orden:
`setCargando(true)`, `setError(null)`, `setIntento(n => n + 1)`. Como `intento`
está en el array de dependencias del efecto, React corre el **cleanup** del
efecto anterior (`cancelado = true`) y después vuelve a ejecutar el efecto
con un nuevo `cancelado = false`. La respuesta vieja, si todavía estaba en
vuelo, no va a tocar el estado porque su `cancelado` ya quedó en `true`.

**Por qué no pasamos la función `async` directo a `useEffect`:** porque un
`useEffect` espera recibir `undefined` o una función de limpieza, no una
promesa. Si le pasamos `async () => {...}` devuelve una promesa y React se
queja (no explota pero es incorrecto). Por eso adentro del efecto llamamos
`obtenerLibros().then(...).catch(...).finally(...)` o declaramos una función
`async` interna y la llamamos.

**Evidencia:** `src/hooks/useLibros.ts` (archivo completo; bandera `cancelado`,
cleanup del efecto, reducer de `intento` para `reintentar`).

---

### B2. La condición de carrera del buscador

> Describí la condición de carrera que aparece al tipear rápido en el
> buscador y cómo la evita tu implementación.

**Respuesta:**

La API `buscarLibros(q)` tarda un tiempo variable (entre 300 y 1500 ms).
Si el usuario escribe rápido, las respuestas pueden llegar desordenadas.

**El caso del TP:** el usuario escribe "bor" y se dispara
`buscarLibros("bor")` que tarda 1400 ms. 200 ms después escribe "borges" y
se dispara `buscarLibros("borges")` que tarda 300 ms.

Sin limpieza: la respuesta de "borges" llega primero (a los 500 ms del
inicio) y se pinta la lista correcta. Pero la respuesta de "bor" llega
después (a los 1400 ms) y **pisa** la lista con resultados viejos. El
usuario ve en pantalla un input que dice "borges" y una lista de
resultados de "bor".

**Cómo lo evita mi implementación:** dentro del `useEffect` del hook
`useBuscarLibros` declaro `let cancelado = false`. En el `.then(...)` y en
el `.catch(...)` chequeo `if (!cancelado) setResultados(...)`. En el
cleanup del efecto hago `cancelado = true`.

Cuando el usuario tipea una letra nueva, `q` cambia, React corre el
cleanup del efecto anterior (pone `cancelado = true` para ese efecto
viejo) y recién después monta el efecto nuevo con su propio `cancelado`
en `false`. La respuesta vieja, cuando finalmente llega, encuentra su
propio `cancelado` ya en `true` y no toca el estado.

**La propuesta `if (texto === q) setResultados(datos)` falla.** `q` se
capturó por clausura en la primera llamada y queda viejo; cuando la
respuesta de "bor" llega, su clausura ve `q === "bor"` (el que capturó)
y la condición da `true`. No protege nada.

**El error "a veces" es peor que "siempre".** Si la race apareciera siempre,
la encontrarías en la primera prueba. Como depende del delay aleatorio,
pasa en producción con poca frecuencia, es difícil de reproducir y el
usuario queda con una UI mentirosa sin que nadie entienda por qué.

**`router.setParams` vs `router.push`.** Uso `setParams` para que cada letra
tipeada no apile una entrada nueva en el historial; con `push`, tocar
"atrás" devolvería al input letra por letra. El debounce de 300 ms que
agregué después reduce la cantidad de queries pero no reemplaza al
cleanup: aun con debounce, dos queries pueden encadenarse y llegar
desordenadas.

**Evidencia:** `src/hooks/useBuscarLibros.ts` (declaración de `cancelado`
y cleanup del efecto); `src/app/buscar.tsx` (debounce con
`useDebouncedValue` y `router.setParams`).

---

### B3. Mutar o reemplazar

> La Pila y la Cola se mutan en el lugar. Explicá por qué React no se entera
> y cómo lo resolviste.

**Respuesta:**

`Pila` y `Cola` son clases con `#items` privado. Métodos como `apilar`,
`desapilar`, `encolar` y `desencolar` **mutan** el array interno. La
referencia a la instancia de la clase no cambia después de la mutación: es
el mismo objeto.

React compara el estado por **identidad referencial** (`Object.is`). Si la
instancia es la misma, React asume que el estado no cambió y no
re-renderiza. El resultado: la Pila crece internamente, pero la pantalla
muestra el tamaño viejo.

**Mi solución:** agregar un contador de versión con `useReducer`:

```ts
const [, forzar] = useReducer((n: number) => n + 1, 0);
```

Después de cada mutación (`vistos.apilar(isbn)`, `cola.encolar('yo')`,
etc.) llamo `forzar()`. El contador cambia, React re-renderiza, y el
componente ve los valores actualizados de la Pila/Cola al llamar a
`aArray()`, `tamanio`, etc.

**Alternativas que consideré:**

- **Crear una Pila nueva cada vez** (`setPila(new Pila(...))`): simple pero
  costoso con colas grandes y rompe la ventaja de O(1) amortizado que
  tiene mi `Cola` con el índice `#inicio`.
- **`useReducer` con acciones** (`dispatch({ tipo: 'encolar', isbn })`):
  más "React-idiomático", pero duplica el conocimiento del dominio
  (acciones afuera y lógica de la clase adentro).
- **Mantener un array paralelo en estado**: es tener dos fuentes de verdad
  y abre la puerta a bugs de desincronización (ver E4).

**Trade-off final:** la clase gana en encapsulación y correctitud
algorítmica (Cola sin `shift`, `#items` inaccesible desde afuera), pierde
en integración directa con React. El contador de versión paga ese costo
sin duplicar estado.

**Evidencia:** `src/context/BibliotecaProvider.tsx` (`useReducer` de
`forzar`; `verLibro`, `reservar`, `entregarAlSiguiente`, todos con
`useCallback` y llamando `forzar()` tras mutar).

---

### B4. Dónde vive cada dato

> Para cada dato de la app indicá dónde vive (estado local, Context, URL,
> almacenamiento persistente) y por qué.

**Respuesta:**

| Dato | Dónde vive | Por qué |
|---|---|---|
| Texto del buscador | URL (`?q=`) | Permite deep link, botón "atrás" y compartir enlaces. La fuente de verdad es la URL; el input local se inicializa a partir de ella |
| Préstamos del usuario | Context + AsyncStorage | Los usan varias pantallas (`/reservas`, `DetalleLibro`, `BarraPersonal`). Deben sobrevivir al cierre de la app para no perder el estado del préstamo |
| Listas de espera por libro | Context (clases `Cola`) | Compartidas entre `/reservar`, `/mostrador` y `DetalleLibro`. No se persisten: la biblioteca "resetea" al iniciar y las iniciales de A2 funcionan de seed |
| Vistos recientemente | Context + AsyncStorage | Visible en el Catálogo, se actualiza desde el Detalle. Sobrevive al cierre para dar continuidad al usuario |
| Sesión del personal | Context + AsyncStorage | Gate del `Stack.Protected`. Sobrevive al cierre: si cerrás la app con sesión abierta, al volver seguís adentro |
| Ejemplares disponibles | Se calcula | `libro.ejemplares - propios(isbn) - externos(isbn)`. Nunca se guarda: el dato derivado evita el riesgo de dos lugares desincronizados |
| Estado del permiso de cámara | Local al hook `usePermiso` + sistema operativo | No afecta al resto de la app; vive donde se consume. Al cambiarlo desde Ajustes, `AppState` + `useFocusEffect` lo re-consultan |
| ID de notificación programada | Dentro del `Prestamo` → Context + AsyncStorage | Necesario para cancelar al devolver o al desactivar el switch. Si no se guarda, no hay cómo cancelar y suena una notificación de un libro ya devuelto |

**Sobre Context y re-renders.** Cuando `value` del Context cambia, todos los
componentes que llamen a `useBiblioteca()` se re-renderizan. En una app de
este tamaño es aceptable: son 8-10 pantallas y el costo es bajo. Si creciera,
las opciones serían dividir el Context en varios por dominio
(`SesionProvider`, `PrestamosProvider`, etc.) o usar `useMemo` con selectores.
En esta app el ROI no justifica la complejidad.

**Evidencia:** `src/context/BibliotecaProvider.tsx` (declaración de estados,
hidratación inicial, efectos de guardado); `src/app/buscar.tsx` (`q` leído
de la URL); `src/lib/persistencia.ts` (helpers tipados).

---

## Parte C — Navegación y rutas

### C1. La pila en tu app

> Mostrá cómo queda la pila de navegación en distintos recorridos de la app.

**Respuesta:**

Notación: `Raíz[...]` es el Stack raíz; `TabCat[...]` es el Stack propio de
la tab Catálogo (el grupo `(catalogo)` dentro de `(tabs)`).

| # | Acción | Pilas resultantes |
|---|---|---|
| 1 | Abrir la app | `Raíz[(tabs)]` · `TabCat[index]` (Catálogo en el tope) |
| 2 | Tocar un libro del catálogo | `Raíz[(tabs)]` · `TabCat[index, libro/[isbn]]` |
| 3 | Tocar "Reservar" | `Raíz[(tabs), reservar/[isbn] (modal)]` · `TabCat[index, libro/[isbn]]` |
| 4 | Tocar "Ver mis reservas" (confirmación) | `Raíz[(tabs)]` · tab activa `reservas` |
| 5 | Tocar atrás (Android) desde `/reservas` | `Raíz[(tabs)]` · tab activa `reservas` (sin stack para desapilar) |
| 6 | Tocar la tab "Catálogo" | `Raíz[(tabs)]` · tab activa `(catalogo)`, `TabCat[index, libro/[isbn]]` queda como estaba |

**Qué método usé en el paso 4 y por qué.** Uso `router.replace('/reservas')`.
Con `push`, el historial quedaría `Raíz[(tabs), reservar/[isbn] (modal),
reservas]` y "atrás" volvería a la confirmación del modal. El TP pide
explícitamente que "atrás" no vuelva a confirmación. `replace` saca el modal
del historial. `dismissTo` sería otra opción válida con semántica más
explícita de cerrar el modal; elegí `replace` porque además cambia a la tab
Reservas en una operación.

**Qué ve el usuario en el paso 6.** Al tocar la tab Catálogo, Expo Router
mantiene el estado del Stack anidado de esa tab. Como quedó
`TabCat[index, libro/[isbn]]`, el usuario ve el **detalle del libro** que
estaba mirando, no el catálogo. Me parece el comportamiento correcto: cada
tab es su propia "mini-app" con su propia historia. Si el usuario quiere
volver al catálogo, toca atrás una vez.

**Evidencia:** `src/app/_layout.tsx` (Stack raíz, declaración de modales y
`Stack.Protected`); `src/app/(tabs)/_layout.tsx` (Tabs);
`src/app/(tabs)/(catalogo)/_layout.tsx` (Stack anidado de la tab Catálogo);
`src/app/reservar/[isbn].tsx` (uso de `router.replace`).

---

### C2. El escáner que dispara de más

> El callback del escáner se dispara muchas veces por segundo. Explicá cómo
> evitás navegar varias veces y por qué elegiste ese mecanismo.

**Respuesta:**

`onBarcodeScanned` de `CameraView` se dispara **cada frame** mientras el
código sigue en el encuadre: puede ser 15-30 veces por segundo. Si adentro
llamara `router.push` sin protección, encolaría N navegaciones a la misma
ruta y el usuario vería el detalle, atrás, detalle, atrás… o directamente
un crash.

**Por qué `useState(true)` NO alcanza.** El primer callback haría
`setEscaneado(true)`, pero los siguientes callbacks que ya están en vuelo
(fueron agendados antes) **ya capturaron** `escaneado === false` por
clausura. El `setState` es asíncrono: el próximo callback va a ver el valor
que tenía en el render anterior, no el actualizado. Probé: igual navega
tres o cuatro veces.

**Por qué `useRef` SÍ funciona.** `escaneadoRef.current` es **sincrónico**.
Apenas un callback lo pone en `true`, el próximo callback que corre en el
mismo tick de JavaScript ya lee `true` y corta con un `if
(escaneadoRef.current) return;`. No depende de re-renderizar ni de que
React batchee nada.

**`router.replace` en lugar de `push`.** Al validar el EAN y encontrar el
libro, hago `router.replace({ pathname: '/libro/[isbn]', params: { isbn:
codigo } })`. Si usara `push`, "atrás" desde el detalle volvería a la
cámara y el `escaneadoRef` seguiría en `true`, dejando la cámara inútil
hasta que remonte. Con `replace` saco la cámara del historial: desde el
detalle, "atrás" vuelve al catálogo (que es el estado conceptualmente
correcto después de escanear).

**ISBN que no está en el catálogo.** Me avisa `Alert.alert` con "ISBN
desconocido" **una sola vez por código**. Guardo el último código
desconocido en un `useRef` paralelo: si el mismo libro sigue en el
encuadre, no repito el aviso; si enfoca otro código desconocido, sí avisa.
Al cerrar el alert reseteo `escaneadoRef = false` para que pueda seguir
escaneando.

**Evidencia:** `src/app/escanear.tsx` (`escaneadoRef`, guard sincrónico,
`router.replace`, reset tras cerrar el aviso).

---

### C3. Deep links y rutas protegidas

> Para cada deep link indicá qué pantalla se abre y por qué.

**Respuesta:**

Todos los deep links usan el scheme `bibliotecaipf://` declarado en
`app.json`.

| # | Deep link | Resultado | Por qué |
|---|---|---|---|
| 1 | `bibliotecaipf://libro/9788437604947` | Detalle de Rayuela | Expo Router matchea `libro/[isbn]`, la pantalla valida la regex y busca el libro |
| 2 | `bibliotecaipf://libro/123` | "ISBN inválido: debe tener 13 dígitos" + link al catálogo | La regla la aplica el wrapper `(tabs)/(catalogo)/libro/[isbn].tsx` antes de llamar al hook |
| 3 | `bibliotecaipf://buscar?q=borges` | `/buscar` con el input ya en "borges" y resultados | `useLocalSearchParams` lee `q` de la URL y lo pasa al hook |
| 4 | `bibliotecaipf://mostrador` sin sesión | No entra; Expo Router hace fallback por el `guard` de `Stack.Protected` | El guard es `guard={sesion !== null}`, si es `false` la ruta queda inaccesible |
| 5 | `bibliotecaipf://mostrador` con sesión | Abre el mostrador | Guard pasa |
| 6 | `bibliotecaipf://reserva` | Redirige a `/reservas` | La ruta `src/app/reserva.tsx` solo exporta `<Redirect href="/reservas" />` |
| 7 | `bibliotecaipf://escanear` sin permiso | Pantalla previa (`/permisos/camara`) | La ruta `/escanear` detecta que el permiso no está en `concedido` y navega con `router.push` a la previa |
| 8 | `bibliotecaipf://inexistente` | Pantalla 404 que muestra la URL | El archivo `+not-found.tsx` captura todas las URLs no matcheadas y lee `usePathname()` |

**Por qué el link `/libro/123` llega al detalle aunque el ISBN sea inválido.**
Expo Router matchea por forma de ruta, no por reglas de negocio. `[isbn]`
acepta cualquier string. La **validación** es responsabilidad de la
pantalla destino: la regex `/^\d{13}$/` corre en el wrapper y si falla
muestra `EstadoError` con link al catálogo. Esto es coherente con separar
routing (estructural) de validación (semántica).

**Evidencia:** `app.json` (`scheme`); `src/app/_layout.tsx`
(`Stack.Protected` con guard sobre `sesion`); `src/app/reserva.tsx`
(Redirect); `src/app/+not-found.tsx` (`usePathname()`);
`src/app/(tabs)/(catalogo)/libro/[isbn].tsx` (validación de ISBN).

---

### C4. Foco, montaje y primer plano

> Explicá la diferencia entre que una pantalla se monte, que reciba el foco
> y que la app vuelva a primer plano, con un ejemplo de tu app.

**Respuesta:**

Tres eventos distintos, tres APIs distintas:

- **Montaje:** `useEffect(() => {...}, [])`. Se ejecuta cuando la pantalla
  entra en el árbol de React. Si nunca sale, nunca se vuelve a disparar.
- **Foco:** `useFocusEffect(useCallback(() => {...}, []))`. Se ejecuta cada
  vez que la pantalla **vuelve al tope** del Stack o cada vez que su tab
  se activa. La pantalla sigue montada entre foco y foco.
- **Primer plano:** `AppState.addEventListener('change', ...)`. Se dispara
  cuando la app pasa a `active` desde `background` (el usuario volvió a
  la app desde otra app o desde Ajustes). La pantalla ya estaba montada
  y foqueada; solo cambia el estado de la app completa.

**Ejemplo real en mi app:** el hook `usePermiso` re-consulta el permiso en
dos momentos.

```ts
useFocusEffect(useCallback(() => { reconsultar(); }, [reconsultar]));

useEffect(() => {
  const sub = AppState.addEventListener('change', (next) => {
    if (next === 'active') reconsultar();
  });
  return () => sub.remove();
}, [reconsultar]);
```

**Por qué las dos.** Supongamos que el usuario está en `/reservas` con el
switch de "Recordarme" apagado por permiso denegado. Lo activa, abre la
pantalla previa `/permisos/notificaciones` (nueva pantalla, `/reservas`
pierde el foco), toca "Abrir Ajustes", sale a Ajustes del sistema (la app
pasa a `background`), concede el permiso y vuelve con el botón atrás del
sistema.

Al volver:

- **`AppState`** dispara `active` **antes** de que ninguna pantalla cambie
  de foco. Es el primer evento que llega.
- **`useFocusEffect`** dispara cuando `/permisos/notificaciones` recupera
  el foco (si la pantalla previa no se cerró automáticamente) o cuando
  `/reservas` lo recupera (si la previa sí se cerró).

Si solo usara `useFocusEffect`, pantallas que nunca pierden foco (por
ejemplo, si el usuario sale a Ajustes **sin** ir por la pantalla previa)
no se enterarían del cambio. Si solo usara `AppState`, no detectaría el
caso de volver desde la pantalla previa sin salir a background. Las dos
se complementan y ninguna cubre a la otra.

**Montaje puro** lo uso en el escáner para configurar `onBarcodeScanned`:
corre una sola vez al montar y no necesita reaccionar a cambios de foco.

**Evidencia:** `src/hooks/usePermiso.ts` (`useFocusEffect` y
`AppState.addEventListener`).

---

## Parte D — Permisos

### D1. Recorrido completo de la cámara (Android 14)

> Describí paso a paso qué ve el usuario y en qué estado queda el permiso
> desde que entra al escáner por primera vez, incluyendo dos rechazos.

**Respuesta:**

| # | Acción del usuario | Estado del permiso | Qué muestra la app |
|---|---|---|---|
| 1 | Toca "Escanear" por primera vez | `status: undetermined, canAskAgain: true` → `preguntable` | Pantalla previa con el beneficio textual y botón "Continuar" |
| 2 | Toca "Continuar" | — | Aparece el diálogo nativo de Android |
| 3 | Toca "No permitir" (1ª vez) | `status: denied, canAskAgain: true` → `preguntable` | Vuelve a la pantalla previa, botón sigue siendo "Continuar" |
| 4 | Toca "Continuar" otra vez | — | Aparece de nuevo el diálogo nativo |
| 5 | Toca "No permitir" (2ª vez) | `status: denied, canAskAgain: false` → `bloqueado` | Pantalla previa cambia: botón ahora dice "Abrir Ajustes" |
| 6 | Toca "Abrir Ajustes" → habilita cámara → vuelve con atrás | `status: granted` → `concedido` | `AppState.active` dispara re-consulta; la pantalla previa cierra y vuelve al escáner con la cámara andando |

**En iOS el recorrido cambia.** iOS no tiene `canAskAgain`: el primer "No
permitir" ya deja el permiso en `denied` definitivo y el único camino de
vuelta es Ajustes. En términos de mi `derivarEstado`, iOS pasa de
`preguntable` directamente a `bloqueado` en el paso 3. Los pasos 4 y 5 no
existen.

**Qué campo de la respuesta uso.** Uso ambos: `status` y `canAskAgain`.
Mirar solo `status` no alcanza porque `denied` con `canAskAgain: true`
(preguntable) y `denied` con `canAskAgain: false` (bloqueado) requieren
acciones distintas en la UI (un botón "Continuar" vs un botón "Abrir
Ajustes"). Si solo mirara `status`, los dos casos se verían iguales y el
usuario tocaría "Continuar" en un estado bloqueado, no pasaría nada y
pensaría que la app está rota.

**Qué parte del código detecta el regreso desde Ajustes.** El listener de
`AppState.change` en `usePermiso`: cuando la app vuelve a `active`,
re-consulta el permiso y actualiza el estado. Sin ese listener, la
pantalla previa seguiría mostrando "Abrir Ajustes" aunque el usuario ya
haya concedido el permiso, y tendría que apretar algún botón para que la
app "se entere".

**Evidencia:** `src/hooks/usePermiso.ts` (`derivarEstado`,
`useFocusEffect`, `AppState`); `src/app/permisos/[recurso].tsx` y
`src/components/PantallaPermiso.tsx` (switch exhaustivo sobre el estado,
`accionPara`, `concedidoYaManejado`); `src/app/escanear.tsx` (navegación
a la pantalla previa cuando el estado no es `concedido`).

---

### D2. Notificaciones y consistencia

> Explicá cuándo pedís el permiso de notificaciones, cómo programás y
> cancelás el recordatorio y cómo evitás que quede una notificación de un
> préstamo devuelto.

**Respuesta:**

**Cuándo lo pido.** Solo cuando el usuario activa el switch "Recordarme" de
un préstamo. No al abrir la app, no al entrar a `/reservas`, no al reservar.
Esto es mínimo privilegio: el permiso se pide en el momento exacto en que
se usa, con un contexto obvio para el usuario.

**Flujo de activación del switch:**

1. Switch pasa a `true`. El handler consulta el estado del permiso.
2. Si está `bloqueado`, navega a `/permisos/notificaciones` para que el
   usuario entienda y vaya a Ajustes. Vuelve al switch en `false`.
3. Si está `preguntable`, el hook `useRecordatorio.programar` llama a
   `Notifications.requestPermissionsAsync()`. Si el usuario deniega, el
   switch queda en `false` y muestro un mensaje de error dentro de la card.
4. Si está `concedido` (o acaba de ser concedido), `programar` sigue:
   asegura el canal de Android, programa la notificación a 15 s con
   `scheduleNotificationAsync`, devuelve el ID.
5. Guardo el ID dentro del `Prestamo.notificacionId` en el Context.

**Canal antes del permiso.** En Android 13+ (API 33+), el diálogo de
notificaciones no aparece si la app no creó ningún canal todavía. Por eso
`asegurarCanalPrestamos()` corre antes de `requestPermissionsAsync`. Sin
eso, el botón "Continuar" de la pantalla previa aparentaría no hacer nada.

**Cancelar.** Dos caminos:

- El usuario apaga el switch: llamo `cancelar(prestamo.notificacionId)` y
  seteo `notificacionId: null` en el préstamo.
- El usuario toca "Devolver": el método `devolver(isbn)` del Context
  **primero** llama `cancelar(prestamo.notificacionId)` y **después**
  filtra el préstamo. Si fuera al revés, el préstamo desaparecería del
  array y no tendría el ID para cancelar.

**Qué pasa si la app se cierra antes de los 15 s.** La notificación está
agendada en el sistema operativo, no en la app. Se dispara igual. El
`notificacionId` se guarda en AsyncStorage dentro del préstamo, así que
al reabrir la app puedo cancelarlo si el usuario devuelve.

**Qué pasa en Android 12 (API 31).** No hay permiso `POST_NOTIFICATIONS`;
las notificaciones se muestran sin diálogo. El canal igual importa para
que aparezcan con el título correcto en Ajustes > Notificaciones. El
código funciona igual porque `getPermissionsAsync` devuelve `granted` en
Android 12.

**Evidencia:** `src/hooks/useRecordatorio.ts` (canal antes del permiso,
programar, cancelar); `src/lib/notificaciones.ts` (`asegurarCanalPrestamos`,
`setNotificationHandler`); `src/context/BibliotecaProvider.tsx`
(`devolver` cancela antes de filtrar, `activarRecordatorio`).

---

### D3. Lo que tu app pide y lo que no

> Listá los permisos que declara tu app, cuáles bloqueaste y por qué.

**Respuesta:**

| Permiso | Plataforma | Declarado / bloqueado | Motivo | Quién lo agrega |
|---|---|---|---|---|
| `NSCameraUsageDescription` | iOS | Declarado | Escanear el EAN del libro en `/escanear` | Plugin `expo-camera` en `app.json`, texto: "Usamos la cámara para escanear el código de barras del libro y abrir su detalle sin que tengas que escribir el ISBN." |
| `android.permission.CAMERA` | Android | Declarado | Idem iOS | Plugin `expo-camera` en `app.json` |
| `android.permission.POST_NOTIFICATIONS` | Android (API 33+) | Declarado | Recordatorio de devolución del préstamo | Plugin `expo-notifications` en `app.json` |
| `NSMicrophoneUsageDescription` | iOS | **No se declara** | La cámara no graba audio | `microphonePermission: false` en el plugin de `expo-camera` |
| `android.permission.RECORD_AUDIO` | Android | **Bloqueado** | Idem; `expo-camera` lo agrega por defecto | `blockedPermissions` en `android` + `recordAudioAndroid: false` en el plugin |

**Por qué bloqueamos `RECORD_AUDIO` aunque usamos `expo-camera`.** El módulo
`expo-camera` incluye por defecto la capacidad de grabar video con audio.
Como la app solo lee códigos de barras (fotos fijas en modo stream), no
necesita el micrófono. Pedir un permiso que no se usa viola mínimo
privilegio y además asusta al usuario ("¿por qué una app de biblioteca me
pide el micrófono?"). El bloqueo tiene dos capas:

1. `plugins → expo-camera → microphonePermission: false` y
   `recordAudioAndroid: false`: evita que el plugin agregue los strings.
2. `android.blockedPermissions: ["android.permission.RECORD_AUDIO"]`:
   garantiza que si alguna otra dependencia intenta agregarlo, se bloquea
   al compilar.

**Qué pasaría si mañana piden "foto de portada desde la galería".** Habría
que agregar `expo-image-picker`, que declara `NSPhotoLibraryUsageDescription`
en iOS y `READ_MEDIA_IMAGES` (API 33+) o `READ_EXTERNAL_STORAGE` (anterior)
en Android. El cambio al `app.json` requiere **una build nueva** (no basta
con una actualización OTA), porque los permisos y los textos de propósito
se definen en el manifest nativo que solo se regenera al compilar.

**Qué no pude verificar del todo desde Expo Go.** Los textos de propósito
que ve el usuario en el diálogo nativo (el string de `cameraPermission` y
el de notificaciones) los uso en Expo Go, pero no son los míos: Expo Go
usa los suyos. Para verificarlos armé una development build con EAS.

**Evidencia:** `app.json` (`blockedPermissions` y plugins).

---

## Parte E — Buenas prácticas

### E1. Revisión de código del fragmento del TP

> Encontrá los problemas del fragmento de código que da el TP y explicá
> cómo se corrigen.

**Respuesta:**

Los 8 problemas del fragmento `src/app/(tabs)/index.tsx` que trae el PDF:

1. **`useState<any[]>([])`** (línea 10). Tipado perdido. **Corregido:**
   `useState<Libro[]>([])` con el tipo de `src/types/index.ts`. Sin `any`
   ningún `.map` se puede equivocar de forma.

2. **Efecto sin array de dependencias** (líneas 18-20): corre en **cada
   render**. Si el efecto llama a `setLibros`, el render consecutivo
   dispara el efecto otra vez → **bucle infinito** de requests. **Corregido:**
   `useEffect(..., [])` en montaje (o `[intento]` cuando hay reintento) y
   bandera `cancelado` en la limpieza.

3. **Permisos pedidos en el `mount` del componente, no al usarse** (líneas
   13-16). Viola mínimo privilegio y da mala UX: el usuario abre el catálogo
   y le saltan diálogos de cámara y notificaciones sin contexto. **Corregido:**
   el permiso de cámara se pide al tocar "Continuar" en la pantalla previa
   que aparece al entrar al escáner. El de notificaciones, solo al activar
   el switch "Recordarme".

4. **`ScrollView` con `.map`** (líneas 33-36) en lugar de `FlatList`.
   Renderiza todas las filas aunque no se vean; no virtualiza, no tiene
   `ListEmptyComponent`. **Corregido:** `FlatList` con `keyExtractor` por
   ISBN, `ListEmptyComponent={EstadoVacio}`, `RefreshControl` para
   pull-to-refresh.

5. **`<Pressable>` sin `accessibilityRole` ni `accessibilityLabel`** (línea
   24): un lector de pantalla no sabe que es un botón ni qué hace.
   **Corregido:** `accessibilityRole="button"` y un label descriptivo
   (`"Reservar: Rayuela"` por ejemplo).

6. **`<Ionicons name="camera" />` sin `accessibilityLabel`** (línea 38):
   el ícono no tiene texto, el lector de pantalla no puede anunciarlo.
   **Corregido:** `accessibilityLabel="Escanear código de barras"` en el
   Pressable que lo contiene.

7. **`style={{ fontSize: 16, color: '#333', padding: 12 }}`** (línea 25):
   colores hardcodeados, estilos en línea, no reusable, no soporta dark
   mode. **Corregido:** `StyleSheet.create` al pie del archivo y tokens
   de `src/constants/tema.ts` leídos vía `useTema()`.

8. **No maneja carga/error/vacío de `obtenerLibros()`**: si falla, el
   usuario ve una lista vacía sin saber por qué. **Corregido:** hook
   `useLibros` con los 3 estados (`cargando`, `error`, `libros`) y
   componentes `EsqueletoCatalogo`, `EstadoError` (con botón
   "Reintentar"), `EstadoVacio`.

**Cuál rechazaría la app en una tienda y cuál haría que el usuario la
desinstale primero.**

- Lo que rechazaría la app en una tienda: el pedido de permisos sin
  justificación al abrir (problema 3). Google y Apple ponen énfasis en
  esto; una app que pide cámara y notificaciones apenas se abre, sin
  contexto, falla las revisiones de privacidad.
- Lo que haría que un usuario la desinstale primero: el bucle infinito de
  requests (problema 2). Se nota en los 10 segundos: el teléfono empieza
  a calentarse, la batería cae, la app no termina de cargar. El usuario
  la mata y la desinstala.

**Evidencia:** el fragmento del enunciado del TP para comparar; nuestro
código en `src/hooks/useLibros.ts`, `src/components/EstadoCargando.tsx`,
`src/components/EstadoError.tsx`, `src/components/EstadoVacio.tsx`,
`src/app/(tabs)/(catalogo)/index.tsx`.

---

### E2. Organización y acoplamiento

> Describí cómo está organizado el código y qué depende de qué.

**Respuesta:**

**Grafo de dependencias (regla de dirección):**

```
app  →  components  →  hooks  →  context  →  lib
                                          \→  estructuras
                                          \→  data
                                          \→  types
                                          \→  constants
```

**Regla única:** nada importa "hacia arriba". Un hook nunca importa de
`src/app`. Un componente nunca importa de `src/app`. El Context nunca
importa de `components`. Esto se verifica mirando los `import` de cada
archivo.

**Por qué importaría "hacia arriba" es malo.** Si un hook importa de
`src/app/(tabs)/index.tsx`, ese hook deja de ser un hook (reusable) y pasa
a ser lógica específica de esa ruta. Al mover la ruta, se rompe el hook.
Al escribir un test para el hook, hay que montar la ruta entera.

**Si el catálogo pasara a venir de una API real:** cambiaría **solo
`src/lib/api.ts`**. La función `obtenerLibros()` haría `fetch` en vez de
`setTimeout` y devolvería el mismo tipo `Libro[]`. Nada más cambia: el
hook `useLibros` queda igual (recibe la promesa, maneja cargando/error),
el componente del catálogo queda igual (consume el hook), el Context
queda igual. La API simulada y la real tienen el **mismo contrato**.

**Si la lista de archivos de `src/lib/` tuviera más de dos archivos:**
significaría que la capa "lib" está acumulando lógica que podría estar
mejor organizada. Por ejemplo, si tuviera `api.ts`, `normalizadores.ts`,
`validadores.ts`, `transformadores.ts`, `cache.ts`, probablemente
convendría agrupar los últimos tres en un `dominio/` separado por
responsabilidad. Mi `lib` tiene 4 archivos (`api.ts`, `fechas.ts`,
`isbn.ts`, `notificaciones.ts`, `persistencia.ts`, `haptica.ts`) y cada
uno tiene una única responsabilidad, pero empieza a estar al borde de la
regla.

**Sobre la propuesta `<ConPermiso recurso="camara">...</ConPermiso>`.** Un
componente que envuelva a la cámara y maneje el permiso declarativamente
tiene la ventaja de que la ruta del escáner queda más limpia (no hay un
`if` de permiso en cada pantalla). Pero no sirve para el caso del
interruptor "Recordarme", porque ahí el permiso se pide **desde un
switch**, no al abrir una pantalla. Un wrapper declarativo no modela ese
caso. Por eso uso `usePermiso` como hook y no como componente: funciona
en ambos contextos.

**Evidencia:** árbol de `src/` documentado en el `README.md`; ver imports
de cualquier hook (todos apuntan hacia abajo o lateralmente dentro de la
misma capa).

---

### E3. Mapa de fallas

> Para cada situación de falla del PDF indicá qué ve el usuario y dónde se
> maneja en el código.

**Respuesta:**

| Situación | Qué ve el usuario | Dónde se maneja |
|---|---|---|
| `obtenerLibros()` falla | `EstadoError` con "No pudimos cargar el catálogo" + mensaje del error + botón "Reintentar" | `src/hooks/useLibros.ts` (`.catch`), `src/app/(tabs)/(catalogo)/index.tsx` (renderiza el estado) |
| Se abre `/libro/abc` | `EstadoError` con "ISBN inválido: debe tener 13 dígitos" + link "Ir al catálogo" | `src/app/(tabs)/(catalogo)/libro/[isbn].tsx` (regex `/^\d{13}$/`) |
| Se escanea un ISBN que no está en el catálogo | `Alert.alert` "ISBN desconocido" una vez por código; se puede seguir escaneando otros | `src/app/escanear.tsx` (track del último código desconocido) |
| La cámara está bloqueada | Pantalla previa con el beneficio + botón "Abrir Ajustes" + opción "Escribir ISBN a mano" | `src/app/permisos/[recurso].tsx` + `src/components/PantallaPermiso.tsx` + `src/hooks/usePermiso.ts` (estado `bloqueado`) |
| Las notificaciones están denegadas | Switch "Recordarme" queda en `false` con mensaje de error en la card; al entregar al mostrador, aviso dentro de `/reservas` la próxima vez que se abre | `src/components/PrestamoCard.tsx` (manejo del error de `programar`), `src/context/BibliotecaProvider.tsx` (chequeo al entregar) |
| Se intenta reservar un libro ya reservado | Modal muestra "Ya lo tenés prestado" (botón solo "Ver mis reservas") | `src/app/reservar/[isbn].tsx` (render de `{ ok: false, razon: 'ya-prestado' }`) |
| "Entregar al siguiente" con la lista de espera vacía | El libro no aparece en la lista del mostrador (se filtra por `librosConCola()`) | `src/context/BibliotecaProvider.tsx` (`entregarAlSiguiente` devuelve `null`; `librosConCola()` excluye vacías) + `src/app/mostrador.tsx` |
| Login con clave incorrecta | Mensaje en rojo "Usuario o clave incorrectos" debajo del botón | `src/app/login.tsx` (render de `{ ok: false, razon: 'credenciales' }`) |

**Evidencia:** archivos y rutas de arriba. Cada fila tiene un camino desde
el origen del evento hasta la UI que lo presenta: ninguna falla cae en
"la app se rompe".

---

### E4. Decisiones con argumentos

> Justificá las decisiones de diseño: identificador de libro, estructuras
> de datos, memorización y datos duplicados.

**Respuesta:**

**Identificador: ISBN como `string`.** Elegí ISBN y no un id numérico
interno. Ventaja: coincide con lo que la cámara lee, con la ruta
(`/libro/[isbn]`), con el `keyExtractor` del `FlatList` y con las claves
de `listasEspera: Map<string, Cola<string>>`. Es natural, estable y único
en el dominio. Costo: libros sin ISBN quedarían afuera (en la realidad
existen: tesis, folletos). Si en el futuro la biblioteca agregara
materiales sin ISBN, habría que cambiar el modelo a `id: string` propio
con un campo `isbn?: string` opcional, y reescribir muchas firmas. Por
ahora el trade-off me parece correcto: la app es de una biblioteca
académica donde todos los libros tienen ISBN.

**Estructuras de datos: clase `Pila` con `#items`.** Alternativa:
mantener `recientes` como `string[]` en estado y usar `[...recientes, x]`.
La clase gana:

- **Encapsulación** real con `#items` privado: nadie puede mutar el array
  por fuera de los métodos. Un `array.push` desde otro lado rompería la
  invariante "sin duplicados en el tope" que mantiene `verLibro`.
- **Semántica clara**: `apilar`, `desapilar`, `tope`, `tamanio`,
  `estaVacia` leen como lo que son. `aArray()` devuelve copia defensiva.
- **Testeabilidad**: tests unitarios puros sin tocar React.

Lo que me complicó: integrarla con React, porque mutar `#items` no
dispara re-render. La solución (B3) es un `useReducer` de versión. Lo
pago con dos líneas y un `forzar()` después de cada mutación.

**Clase `Cola` sin `shift()`.** Un `array.shift()` es O(n) porque reindexa
todo el array. Mi `Cola` avanza un `#inicio` que marca dónde está el
frente; `desencolar` incrementa el índice (O(1)) y cada tanto compacta
para no crecer en memoria indefinidamente. En colas de espera chicas no
se nota; en colas largas o con muchas entradas/salidas sí. Elegirlo acá
es consistencia (y lo pide el TP) más que performance.

**Memorización: `useCallback` en todas las funciones del Context.** Las
expongo con `useCallback` para que su identidad sea estable entre
renders. Esto importa porque muchos `useEffect` dependen de ellas: si
cambiaran de identidad en cada render, los efectos se re-ejecutarían en
loop. `useEffect(() => { if (libro) verLibro(isbn); }, [isbn, libro,
verLibro])` solo funciona si `verLibro` es estable. Comprobé el beneficio
poniendo un `console.log` temporal en el efecto y viendo que solo corre
al cambiar `isbn` o `libro`, no en cada render.

**`useMemo` para el `value` del Context: NO lo uso.** La app es chica (8
pantallas, pocos componentes). El costo de `useMemo` (función + array de
deps + comparación en cada render) es mayor que la ganancia de evitar
re-renders que de todos modos son baratos. En una app con 50 pantallas y
cards complejas, la cosa cambia.

**Datos duplicados: `ejemplaresDisponibles` se calcula, no se guarda.** La
fórmula es `libro.ejemplares - prestamos.filter(p => p.isbn === isbn).length -
(prestamosExternos[isbn] ?? 0)`. Guardarlo en el estado abriría la puerta
al clásico bug "un lugar dice 0 ejemplares y el detalle dice 1 disponible"
cuando una reserva o devolución sincroniza solo uno de los dos. Al
calcularlo, el valor es siempre consistente con las fuentes.

**El caso `prestamosExternos` NO duplica.** Es una fuente **adicional**, no
una copia. Representa los préstamos que el mostrador entrega a otras
personas (Ana, Juan, Lucía): esos préstamos no se guardan como `Prestamo`
porque `Prestamo` modela solo los míos. Podría haber modelado un
`PrestamoAjeno` con la misma forma, pero inventaba un modelo de otros
usuarios que la app no necesita; con un simple `Record<string, number>`
alcanza para que `ejemplaresDisponibles` reste lo que corresponde.

**Evidencia:** `src/data/libros.ts` (ISBN como `string` + 13 dígitos);
`src/estructuras/Pila.ts` y `src/estructuras/Cola.ts` (clases con
`#items`); `src/context/BibliotecaProvider.tsx` (`useCallback` en todas
las funciones expuestas, `crearListasIniciales`, `prestamosExternos`,
`ejemplaresDisponibles` como función que calcula).