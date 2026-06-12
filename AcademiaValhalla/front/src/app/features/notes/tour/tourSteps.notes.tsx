import type { TourStep } from '../../../components/Tour/tourTypes';

const NOTES_ROUTE  = '/dashboard/notes';
const CREATE_ROUTE = '/dashboard/notes/create';

export const NOTES_TOUR_ID = 'notes';

export const notesTourSteps: TourStep[] = [
    /* ── Paso 0: Bienvenida (sin target) ── */
    {
        id: 'welcome',
        route: NOTES_ROUTE,
        title: '¡Bienvenido a tus apuntes!',
        body: (
            <>
                Este tutorial te guiará por las funciones principales de la sección de apuntes.
                Solo te llevará <strong>un minuto</strong> y podrás cerrar en cualquier momento.
            </>
        ),
        placement: 'auto',
    },

    /* ── Paso 1: Pestañas mis/comunidad ── */
    {
        id: 'tabs',
        route: NOTES_ROUTE,
        target: 'notes-tabs',
        title: 'Mis apuntes y la comunidad',
        body: (
            <>
                Cambia entre <strong>Mis apuntes</strong> (los que tú creas) y{' '}
                <strong>Comunidad</strong> (apuntes aprobados compartidos por otros).
            </>
        ),
        placement: 'bottom',
    },

    /* ── Paso 2: Búsqueda ── */
    {
        id: 'search',
        route: NOTES_ROUTE,
        target: 'notes-search',
        title: 'Busca rápido',
        body: 'Filtra tus apuntes por título en tiempo real. Muy útil cuando tienes mucho contenido acumulado.',
        placement: 'bottom',
    },

    /* ── Paso 3: Botón Nuevo ── */
    {
        id: 'new-btn',
        route: NOTES_ROUTE,
        target: 'notes-new',
        title: 'Crear un apunte',
        body: 'Pulsa aquí para empezar a crear un nuevo apunte. Puedes añadir texto, definiciones, bloques de código e imágenes.',
        placement: 'bottom',
    },

    /* ── Paso 4: Botón ayuda ── */
    {
        id: 'help-btn',
        route: NOTES_ROUTE,
        target: 'notes-help',
        title: 'Vuelve a ver este tutorial',
        body: 'Pulsa el botón "?" en cualquier momento para relanzar esta guía desde el principio.',
        placement: 'bottom',
    },

    /* ── Paso 5: Formulario de metadatos ── */
    {
        id: 'create-meta',
        route: CREATE_ROUTE,
        target: 'create-meta',
        title: 'Título, materia y dificultad',
        body: 'Empieza dando un título descriptivo al apunte y elige la materia y dificultad. Esto ayuda al buscador a encontrarlo.',
        placement: 'bottom',
    },

    /* ── Paso 6: Añadir bloque ── */
    {
        id: 'create-add-block',
        route: CREATE_ROUTE,
        target: 'create-add-block',
        title: 'Añade bloques de contenido',
        body: (
            <>
                Un apunte se compone de <strong>bloques</strong>: texto enriquecido, definiciones, código o imágenes.
                Pulsa "+" para insertar el que necesites.
            </>
        ),
        placement: 'top',
    },

    /* ── Paso 7: Toolbar del editor de texto ── */
    {
        id: 'create-toolbar',
        route: CREATE_ROUTE,
        target: 'create-toolbar',
        title: 'Formato de texto',
        body: (
            <>
                El editor de texto soporta <strong>negrita</strong>, <em>cursiva</em>,{' '}
                <code>código inline</code>, encabezados, advertencias y términos técnicos.
                También puedes insertar enlaces.
            </>
        ),
        placement: 'bottom',
        interactive: true,
    },

    /* ── Paso 8: Atajos de teclado ── */
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

    /* ── Paso 9: Vista previa del bloque ── */
    {
        id: 'create-preview',
        route: CREATE_ROUTE,
        target: 'create-preview',
        title: 'Vista previa del apunte',
        body: 'Activa la vista previa para ver cómo quedará el apunte antes de guardarlo. El renderizado aplica todos los estilos finales.',
        placement: 'left',
    },

    /* ── Paso 10: Compartir con comunidad ── */
    {
        id: 'create-share',
        route: CREATE_ROUTE,
        target: 'create-share',
        title: 'Comparte con la comunidad',
        body: 'Activa esta opción para enviar tu apunte a revisión. Si los moderadores lo aprueban, aparecerá en la sección de comunidad para todos.',
        placement: 'bottom',
    },

    /* ── Paso 11: Guardar ── */
    {
        id: 'create-save',
        route: CREATE_ROUTE,
        target: 'create-save',
        title: '¡Guarda tu apunte!',
        body: 'Cuando estés listo, pulsa "Guardar apunte". Ganarás XP y el apunte aparecerá en tu lista personal inmediatamente.',
        placement: 'bottom',
    },

    /* ── Paso 12: Editar apunte (en tarjeta) ── */
    {
        id: 'note-card-edit',
        route: NOTES_ROUTE,
        target: 'note-card-edit',
        title: 'Edita tus apuntes',
        body: 'En cada tarjeta de tus apuntes personales aparece el botón de edición. Los cambios en apuntes aprobados pasarán por moderación antes de publicarse.',
        placement: 'left',
    },
];
