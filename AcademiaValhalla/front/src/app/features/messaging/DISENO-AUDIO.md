# Diseño — Reproductor de notas de voz

Especificación visual para sustituir el `<audio controls>` nativo por un reproductor
propio coherente con el resto de la mensajería (estética *terminal / emerald*).

> **Nota sobre el error 500** — `POST /api/v1/messages/adjuntos` falla porque
> `subirAdjunto` → `subirArchivo()` → `getSupabase()` lanza al no estar configurado
> el bucket de Supabase Storage. Es un problema de infraestructura, **no** de este
> diseño. Una vez configurado `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` y creado el
> bucket, la subida funcionará. Este documento sólo cubre cómo se *ve* el audio.

---

## 1. Por qué cambiar el `<audio controls>` nativo

El control nativo del navegador rompe la línea visual de la app:

| App (resto de mensajería)            | `<audio controls>` nativo          |
|--------------------------------------|------------------------------------|
| Esquinas rectas (`border`, sin `rounded`) | Píldora redondeada gris            |
| Acento `emerald-500`                 | Azul/gris del sistema operativo    |
| Tipografía `font-mono` para metadatos | Sans del sistema                   |
| Coherente en claro/oscuro            | Distinto en cada navegador/SO      |

El objetivo: un reproductor con **botón cuadrado play/pause**, **forma de onda en
barras** (encaja con el look de bloques/monoespaciado) y **contador mono** `00:14`.

---

## 2. Tokens reutilizados

Tomados de `TarjetaMensaje.tsx` y `EntradaMensaje.tsx`:

```
Acento         emerald-500            (botón, onda reproducida)
Acento tenue   emerald-500/25..50     (onda pendiente, bordes)
Botón enviar   bg-emerald-500 text-black  w-9 h-9   (mismo patrón para play)
Texto meta     font-mono text-[10px] text-slate-400 dark:text-slate-500
Fondo card OSC #0f1115  border-white/[0.06]
Fondo card CLR white    border-slate-100
Burbuja propia bg-emerald-500/[0.07]  border-emerald-500/25
Barra acento   span absolute 2px emerald (ya existe en la burbuja)
```

Sin esquinas redondeadas salvo el avatar/badges. El reproductor vive **dentro** de la
burbuja existente, así que hereda su fondo, borde y barra de acento lateral.

---

## 3. Anatomía

```
 [▶]   ▁▂▃▅▆▇▅▃▂▃▅▆▃▂▁▂▃▅▆▃▂▁     00:14
  │            │                    │
  │            │                    └─ duración / tiempo restante (font-mono)
  │            └─ forma de onda en barras, clic = seek
  └─ botón play/pause cuadrado (emerald, 32×32)
```

- **Botón**: cuadrado `28×28` (`w-7 h-7`), `bg-emerald-500 text-black`, icono `▶` /
  `❚❚`. Hover `bg-emerald-400`. En estado de carga muestra spinner mono.
- **Onda**: ~28–40 barras verticales de 2px, `gap-[2px]`. Altura pseudo‑aleatoria
  derivada del id del mensaje (determinista) si no hay datos reales de amplitud.
  Las barras **antes** del playhead van a `emerald-500`; las **posteriores** a
  `emerald-500/25` (claro: `emerald-500/20`). Clic/drag sobre la onda = buscar.
- **Tiempo**: `font-mono text-[10px]`. En reposo muestra duración total `00:14`;
  reproduciendo, tiempo transcurrido `00:06`.

---

## 4. Mockups por estado

### 4.1 En burbuja — recibido (modo oscuro)

```
┌────────────────────────────────────────────┐
│▏ @marcus                                     │   ← @username (solo en grupos/recibidos)
│▏┌──────────────────────────────────────────┐│
│▏│ [▶]  ▁▂▃▅▆▇▅▃▂▃▅▆▃▂▁▂▃▅▆▃   00:14         ││   ← onda toda en emerald/25 (sin reproducir)
│▏└──────────────────────────────────────────┘│
│▏                                    10:42 ▏  │
└────────────────────────────────────────────┘
   ↑ barra de acento emerald/50 a la izquierda (recibido)
```

### 4.2 En burbuja — propio, reproduciéndose (modo oscuro)

```
┌────────────────────────────────────────────┐
│              ┌──────────────────────────────┤▕
│              │ [❚❚] ▆▇▅▃▂▃▅▆▃▂▁▂▃▅▆▃  00:06 │▕   ← barras a la izq. del playhead = emerald-500
│              └──────────────────────────────┤▕     resto = emerald-500/25
│                            Entregado  10:43 │▕
└─────────────────────────────────────────────┘
                       barra de acento emerald a la derecha (propio) ↑
```

### 4.3 En burbuja (modo claro)

```
┌────────────────────────────────────────────┐
│ [▶]  ▁▂▃▅▆▇▅▃▂▃▅▆▃▂▁▂▃▅▆▃▂▁     00:14        │
└────────────────────────────────────────────┘
  fondo white, borde slate-100, onda pendiente emerald-500/20
```

### 4.4 Cargando audio (buffering)

```
 [ ⠋ ]  ▁▂▃▅▆▇▅▃▂▃▅▆▃▂▁▂▃▅▆▃     --:--
   ↑ spinner mono (⠋⠙⠹⠸…) en lugar del icono play, onda atenuada
```

---

## 5. Preview en la barra de entrada

Reemplaza el `<audio controls>` de `EntradaMensaje.tsx:189`. Mismo reproductor pero
en una fila con el botón de descartar `[×]` ya existente:

```
┌──────────────────────────────────────────────────────┐
│ [▶]  ▁▂▃▅▆▇▅▃▂▃▅▆▃▂▁▂▃▅▆     00:08            [×]      │
└──────────────────────────────────────────────────────┘
```

- Encerrado en `border border-emerald-500/20` (igual que el textarea).
- `[×]` en `text-slate-400 hover:text-red-500` (ya existe en `discardAudio`).

### 5.1 (Opcional) Grabando — onda en vivo

El estado `recording` ya muestra `● 00:03 [DETENER]`. Se puede enriquecer con una
onda reactiva al volumen del micro (vía `AnalyserNode`), pero es opcional:

```
●  00:03   ▂▅▇▃▂▆▇▅▂▁▃▆ (animada)            [DETENER]
```

---

## 6. Componente propuesto

Nuevo archivo `components/AudioMessage.tsx`, consumido tanto por `TarjetaMensaje`
(reproducción) como por `EntradaMensaje` (preview), parametrizando colores via prop
`variant`.

```tsx
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';

interface AudioMessageProps {
    src: string;
    /** semilla determinista para la onda (p. ej. message.id) */
    seed?: string;
    isDark: boolean;
    /** burbuja propia → acento sólido; recibida → acento tenue */
    isOwn?: boolean;
    durationSec?: number;     // de attachment_meta, si existe
}

const BAR_COUNT = 32;

// Onda determinista a partir de la semilla (sin datos reales de amplitud).
function useWaveform(seed = '', count = BAR_COUNT): number[] {
    return useMemo(() => {
        let h = 0;
        for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
        return Array.from({ length: count }, (_, i) => {
            h = (h * 1103515245 + 12345) & 0x7fffffff;
            return 0.25 + (h % 1000) / 1000 * 0.75; // 0.25..1.0
        });
    }, [seed, count]);
}

const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export const AudioMessage = ({ src, seed, isDark, isOwn, durationSec }: AudioMessageProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const bars = useWaveform(seed);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);           // 0..1
    const [duration, setDuration] = useState(durationSec ?? 0);
    const [current, setCurrent] = useState(0);

    const playedColor = isOwn ? 'bg-emerald-500' : 'bg-emerald-500';
    const pendingColor = isDark ? 'bg-emerald-500/25' : 'bg-emerald-500/20';

    const toggle = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;
        if (playing) { el.pause(); }
        else { setLoading(true); el.play().finally(() => setLoading(false)); }
    }, [playing]);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        const onTime = () => {
            setCurrent(el.currentTime);
            if (el.duration && isFinite(el.duration)) setProgress(el.currentTime / el.duration);
        };
        const onMeta = () => { if (isFinite(el.duration)) setDuration(el.duration); };
        const onEnd  = () => { setPlaying(false); setProgress(0); setCurrent(0); };
        el.addEventListener('timeupdate', onTime);
        el.addEventListener('loadedmetadata', onMeta);
        el.addEventListener('play', () => setPlaying(true));
        el.addEventListener('pause', () => setPlaying(false));
        el.addEventListener('ended', onEnd);
        return () => {
            el.removeEventListener('timeupdate', onTime);
            el.removeEventListener('loadedmetadata', onMeta);
            el.removeEventListener('ended', onEnd);
        };
    }, []);

    const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const el = audioRef.current;
        if (!el || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        el.currentTime = ratio * duration;
    }, [duration]);

    return (
        <div className="flex items-center gap-2.5 min-w-[200px]">
            <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

            {/* Botón play/pause — cuadrado, mismo patrón que enviar */}
            <button
                onClick={toggle}
                className="shrink-0 w-7 h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                aria-label={playing ? 'Pausar' : 'Reproducir'}
            >
                {loading ? (
                    <span className="font-mono text-xs animate-pulse">⠿</span>
                ) : playing ? (
                    /* pausa */
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <rect x="5" y="4" width="3.5" height="12" /><rect x="11.5" y="4" width="3.5" height="12" />
                    </svg>
                ) : (
                    /* play */
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M6 4l10 6-10 6V4z" />
                    </svg>
                )}
            </button>

            {/* Forma de onda — clic para buscar */}
            <div
                onClick={seek}
                className="flex-1 flex items-center gap-[2px] h-7 cursor-pointer"
                role="slider"
                aria-valuenow={Math.round(progress * 100)}
            >
                {bars.map((amp, i) => {
                    const played = i / bars.length <= progress;
                    return (
                        <span
                            key={i}
                            className={`w-[2px] shrink-0 transition-colors ${played ? playedColor : pendingColor}`}
                            style={{ height: `${Math.round(amp * 100)}%` }}
                        />
                    );
                })}
            </div>

            {/* Tiempo — mono */}
            <span className="shrink-0 font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                {fmt(playing || current > 0 ? current : duration)}
            </span>
        </div>
    );
};
```

### Integración en `TarjetaMensaje.tsx`

Sustituir el bloque `message_type === 'audio'` (líneas 160‑164) y borrar el
`AudioPlayer` interno (líneas 14‑24):

```tsx
{message_type === 'audio' && attachment_url && (
    <div className="mb-1.5">
        <AudioMessage
            src={attachment_url}
            seed={message.id}
            isDark={isDark}
            isOwn={isOwn}
            durationSec={message.attachment_meta?.durationSec}
        />
    </div>
)}
```

### Integración en `EntradaMensaje.tsx`

Sustituir el preview (líneas 187‑196) — reutiliza el mismo componente:

```tsx
{audioBlob && recordState === 'preview' && (
    <div className="flex items-center gap-2 px-4 pt-3 pb-0">
        <div className="flex-1 border border-emerald-500/20 px-2 py-1">
            <AudioMessage src={URL.createObjectURL(audioBlob)} isDark={isDark} />
        </div>
        <button onClick={discardAudio} className="shrink-0 text-slate-400 hover:text-red-500 transition-colors">
            {/* icono × existente */}
        </button>
    </div>
)}
```

> Si no se pasa `durationSec`, la duración se resuelve en `loadedmetadata`. Para webm
> de `MediaRecorder` el navegador a veces reporta `duration = Infinity` hasta hacer
> seek; el `isFinite()` ya lo cubre y el contador mostrará `00:00` hasta que cargue.

---

## 7. Resumen de decisiones

1. **Reproductor propio** en vez de `<audio controls>` — coherencia de marca.
2. **Botón cuadrado emerald** reutilizando el patrón del botón enviar (`w-7 h-7`,
   `text-black`).
3. **Onda en barras de 2px** — encaja con la estética monoespaciada/bloques; color
   `emerald-500` (reproducido) vs `emerald-500/25` (pendiente).
4. **Contador `font-mono text-[10px] tabular-nums`** — igual que el resto de metadatos.
5. **Mismo componente** para reproducción y preview, parametrizado por `isDark`/`isOwn`.
6. **Vive dentro de la burbuja existente** — hereda fondo, borde y barra de acento.
```