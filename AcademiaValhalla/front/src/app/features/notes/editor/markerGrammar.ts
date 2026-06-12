// Regex compartido entre renderContent (lectura), markerParser (carga editor) y markerSerializer (guardado).
// El orden importa: techTerm (*'…'*) debe ir antes que italic (*…*).
export const MARKER_REGEX =
    /(#{1,6} .*?(?=\n|$)|(?:\*\*.*?\*\*)|(?:__.*?__)|(?:`.*?`)|(?:\*'.*?'\*)|(?:\*.*?\*)|(?:!!.*?!!)|(?:'.*?')|(?:https?:\/\/[^\s]+))/g;

// Solo marcadores inline (sin el patrón de heading), para usar dentro de líneas ya clasificadas.
export const INLINE_MARKER_REGEX =
    /((?:\*\*.*?\*\*)|(?:__.*?__)|(?:`.*?`)|(?:\*'.*?'\*)|(?:\*.*?\*)|(?:!!.*?!!)|(?:'.*?')|(?:https?:\/\/[^\s]+))/g;
