# Instrucciones del proyecto (para Claude Code)

Este archivo manda sobre cualquier default. Leelo antes de cada tarea.

## Identidad del repositorio

Este repositorio pertenece a un alumno del Instituto Politécnico Formosa que
desarrolla un TP individual. Todo el código y los commits se presentan como
escritos por el alumno. No se agregan líneas Co-Authored-By, no se mencionan
asistentes, no se firma nada. No se pone 🤖 Generated with... en los PR.

## Reglas de commit

- Nunca ejecutar `git commit`, `git push` ni modificar la config de git.
- Al terminar un bloque, entregar al usuario:
  1. La lista exacta de archivos tocados.
  2. Un mensaje de commit en una sola línea (estilo conventional:
     `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`).
  3. No agregar atribuciones ni firmas en el mensaje.
- El usuario corre los commits y el push.

## Estilo de código (debe parecer escrito por un alumno, no por IA)

- Sin comentarios "docentes" que expliquen lo obvio.
- Comentarios solo donde un humano los pondría: por qué una decisión no obvia,
  un TODO real, una referencia al TP.
- No usar emojis en código ni en strings de UI salvo que estén en el diseño.
- Nada de headers decorativos tipo `// ============ SECCIÓN ============`.
- Nombres en español cuando son del dominio (libro, reserva, cola, prestamo)
  y en inglés cuando son técnicos (hook, provider, context).
- Sin `console.log` en la entrega final.
- No usar `any`. Si falta un tipo, definirlo en `src/types/`.

## Convenciones del proyecto

- Carpeta `src/app` solo tiene rutas de Expo Router.
- Un componente por archivo, exportado por nombre (no default salvo rutas).
- `StyleSheet.create` al pie del archivo, nunca estilos en línea.
- `FlatList` siempre con `keyExtractor` estable y `ListEmptyComponent`.
- Estados de pantalla siempre completos: cargando, error con acción, vacío.
- Accesibilidad: `accessibilityRole`, `accessibilityLabel` donde haya solo
  ícono, hit area mínima 44×44.

## Qué NO tocar

- `src/types/index.ts` y `src/lib/api.ts` vienen entregados por el TP; no
  modificarlos.
- `app.json` solo cambiarlo si el usuario lo pide explícitamente.

## Flujo de trabajo

1. El usuario te pasa el módulo a implementar (ej: "Fase 2, cat�logo con
   estados").
2. Leés el plan de desarrollo (`PLAN.md` o referencia externa).
3. Implementás los archivos de ese módulo.
4. Entregás: diff resumido + lista de archivos + mensaje de commit único.
5. El usuario revisa, pega el commit con su propio `git commit -m "..."` y
   pushea.
6. Esperás la próxima instrucción.