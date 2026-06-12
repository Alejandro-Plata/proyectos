# Plan de pulido visual — Sidebar, Tutorial y Toolbar

> Estado: **pendiente de implementación**
> Alcance: solo frontend (`front/`). Sin cambios de backend ni de modelo de datos.

---

## 1. Icono de la academia descentrado en el sidebar colapsado

**Archivo:** `front/src/app/components/NavBar/SideNavDesktop.tsx`

### Diagnóstico
El contenedor del header usa `justify-center` cuando está colapsado, pero el botón de pin
conserva `ml-auto` en todo momento. En flexbox, `margin-left: auto` absorbe **todo** el espacio
libre del contenedor aunque el elemento mida `w-0`, por lo que anula el `justify-center` y
empuja el logo hacia la izquierda.

### Solución
Aplicar `ml-auto` únicamente cuando el sidebar está expandido:

```
${isExpanded
    ? 'opacity-100 pointer-events-auto w-7 h-7 ml-auto'
    : 'opacity-0 pointer-events-none w-0 h-0 ml-0 overflow-hidden'
}
```

(quitar `ml-auto` de las clases fijas del botón y moverlo al bloque condicional).

### Criterio de aceptación
Con el sidebar colapsado, el logo queda exactamente centrado en los 80 px (`w-20`) de ancho.

---

## 2. Animación de apertura/cierre del sidebar poco fluida

**Archivo:** `front/src/app/components/NavBar/SideNavDesktop.tsx`

### Diagnóstico
Tres causas combinadas:

1. **Duraciones desincronizadas**: el ancho del `aside` anima a `350ms` mientras los textos
   interiores (logo, items, botón salir) animan a `300ms` con curvas distintas
   (`ease-in-out` vs `cubic-bezier(0.4,0,0.2,1)`). El desfase produce el efecto "tosco".
2. **Animación de `max-width` en los textos**: animar `max-width` provoca reflow por frame y
   un efecto de "aplastamiento" del texto durante la transición.
3. **Delay de apertura alto**: `250ms` antes de empezar a abrir hace que la respuesta al hover
   se perciba lenta.

### Solución
1. **Unificar timing**: definir una sola duración y curva, y usarla en todas las transiciones
   del sidebar:
   - Duración: `300ms`
   - Curva: `cubic-bezier(0.33, 1, 0.68, 1)` (ease-out-cubic, sin rebote)
2. **Sustituir la animación de `max-width` por `opacity + translate-x`**: los textos se
   renderizan siempre a su ancho natural dentro de contenedores con `overflow-hidden`
   (el header ya lo tiene; `nav` ya tiene `overflow-x-hidden`). El ancho del `aside` es lo
   único que anima layout; los textos solo hacen fade + deslizamiento de ~8px:

   ```
   ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
   ```

   Aplicar el patrón en: título VALHALLA del header, etiquetas de `SidebarItem`
   y el texto "Salir".
3. **Ajustar delays del hover**: apertura `250ms → 120ms`, cierre `180ms → 250ms`
   (abre rápido, cierra con un poco más de gracia para evitar parpadeos al rozar el borde).
4. Añadir `will-change: width` al `aside` para que el navegador prepare la capa de composición.

> ⚠️ **No** añadir `overflow-hidden` al `aside`: los tooltips flotantes de los items
> colapsados (`left-full`) se renderizan fuera del sidebar y quedarían recortados.

### Criterio de aceptación
La expansión/colapso se ve como un único movimiento continuo: el panel crece y los textos
aparecen en fundido sin "aplastarse" ni ir a destiempo.

---

## 3. Tutorial: nuevo paso para la interfaz de atajos de teclado

**Archivos:**
- `front/src/app/features/notes/components/NoteFormatToolbar.tsx`
- `front/src/app/features/notes/tour/tourSteps.notes.tsx`

### Diagnóstico
El editor tiene un botón de ayuda (icono lápiz) que abre `ShortcutsModal` con todos los atajos,
pero el tour no lo menciona y es fácil que pase desapercibido.

### Solución
1. Añadir `data-tour="create-shortcuts"` al botón de ayuda en `NoteFormatToolbar`
   (el botón que dispara `onHelp`).
2. Insertar un paso nuevo en `notesTourSteps` justo **después** del paso `create-toolbar`
   (pasa de 12 a 13 pasos):

   ```tsx
   {
       id: 'create-shortcuts',
       route: CREATE_ROUTE,
       target: 'create-shortcuts',
       title: 'Atajos de teclado',
       body: (
           <>
               Pulsa este botón para ver la <strong>guía completa de atajos</strong>:
               negrita, encabezados, términos técnicos y más, sin levantar las manos
               del teclado.
           </>
       ),
       placement: 'bottom',
       interactive: true,
   },
   ```

   `interactive: true` permite al usuario hacer clic en el botón y abrir el modal durante
   el propio tour si quiere explorarlo.

### Criterio de aceptación
El tour destaca el botón de atajos con el spotlight y el usuario puede abrir el modal
desde el propio paso.

---

## 4. Estado activo de la toolbar: relleno demasiado grueso

**Archivo:** `front/src/app/features/notes/components/NoteFormatToolbar.tsx`

### Diagnóstico
El botón activo pinta el fondo esmeralda en **todo** el área táctil de `44×44px`
(`w-11 h-11`), lo que crea bloques macizos y pesados, sobre todo con varios formatos
activos a la vez.

### Solución
Mantener el área táctil de 44px pero confinar el resaltado a una "píldora" interior:
el `<span>` interno (que ya existe con `w-5 h-5`) pasa a ser el elemento resaltado,
ampliado a `w-7 h-7` con `rounded` y el fondo/borde sutil:

```tsx
<button className="w-11 h-11 flex items-center justify-center shrink-0 group/btn" ...>
    <span className={[
        'w-7 h-7 rounded flex items-center justify-center transition-colors',
        active
            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.10] ring-1 ring-inset ring-emerald-500/30'
            : 'text-slate-500 dark:text-slate-400 group-hover/btn:text-emerald-600 dark:group-hover/btn:text-emerald-400',
    ].join(' ')}>
        {btn.icon}
    </span>
</button>
```

Resultado: indicador compacto de 28px con un anillo fino, en lugar del bloque de 44px.

### Criterio de aceptación
Con `bold + h2` activos a la vez, la toolbar muestra dos resaltados pequeños y discretos
que no dominan visualmente la barra.

---

## 5. Tooltips del tour sobresalen por arriba (pasos "Comunidad" y "Guardar")

**Archivos:**
- `front/src/app/components/Tour/TourTooltip.tsx`
- `front/src/app/features/notes/tour/tourSteps.notes.tsx`

### Diagnóstico
Los pasos `create-share` y `create-save` apuntan a botones del **header sticky superior**
de la página de creación, pero están definidos con `placement: 'top'`. El cálculo
`top = rect.y - TOOLTIP_H_APPROX - GAP` da un valor negativo y el tooltip se sale de la
ventana. Además, `computePosition` no acota el resultado de `top`/`bottom` al viewport
(solo lo hace en `left`/`right`).

### Solución (doble: corrección puntual + robustez del motor)
1. **Corrección de los pasos**: en `tourSteps.notes.tsx`, cambiar
   `placement: 'top' → 'bottom'` en los pasos `create-share` y `create-save`.
2. **Blindar `computePosition`**: añadir clamping vertical para que ningún placement
   futuro pueda salirse:

   ```ts
   case 'bottom':
       top = Math.min(rect.y + rect.height + GAP, vh - TOOLTIP_H_APPROX - 8);
       ...
   case 'top':
       top = Math.max(8, rect.y - TOOLTIP_H_APPROX - GAP);
       ...
   ```

   Y en el modo `auto`, si ningún lado tiene hueco suficiente, hacer fallback a `bottom`
   con clamping (en vez del actual fallback a `left`).

### Criterio de aceptación
En los pasos 10 y 11 del tour (Comunidad y Guardar), el tooltip aparece íntegramente
visible **debajo** del header, sin recorte superior en ninguna resolución ≥ 1280×720.

---

## Orden de implementación sugerido

| # | Tarea | Esfuerzo | Riesgo |
|---|-------|----------|--------|
| 1 | Fix `ml-auto` del pin (centrado del logo) | Trivial | Nulo |
| 5 | Placement + clamping de tooltips del tour | Bajo | Nulo |
| 3 | Paso de atajos en el tour | Bajo | Nulo |
| 4 | Píldora compacta en toolbar activa | Bajo | Bajo |
| 2 | Refactor de animación del sidebar | Medio | Medio (regresión visual) |

El punto 2 va último porque toca varios bloques de clases a la vez; conviene verificarlo
en claro/oscuro y con el sidebar fijado (`isPinned`) y sin fijar.

## Verificación final

- `npx tsc --noEmit` limpio en `front/`.
- Revisión manual: sidebar (hover, pin, tema oscuro), tour completo de 13 pasos,
  toolbar con múltiples formatos activos.
