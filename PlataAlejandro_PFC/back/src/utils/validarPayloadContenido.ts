const DIFICULTADES_VALIDAS = ['easy', 'medium', 'hard', 'Fácil', 'Intermedio', 'Difícil'];

export function validarPayloadReto(metadata: any): string | null {
    if (!metadata?.language || typeof metadata.language !== 'string')
        return 'language requerido';
    if (!DIFICULTADES_VALIDAS.includes(metadata.difficulty))
        return 'difficulty inválido';
    if (!metadata.starter_code || typeof metadata.starter_code !== 'string')
        return 'starter_code requerido';
    if (!metadata.solution_code || typeof metadata.solution_code !== 'string')
        return 'solution_code requerido';
    if (metadata.examples && !Array.isArray(metadata.examples))
        return 'examples debe ser un array';
    if (metadata.hints && !Array.isArray(metadata.hints))
        return 'hints debe ser un array';
    return null;
}

export function validarPayloadNota(metadata: any): string | null {
    if (!Array.isArray(metadata?.content) || metadata.content.length === 0)
        return 'content vacío o inválido';
    for (const [i, bloque] of metadata.content.entries()) {
        if (!['text', 'code'].includes(bloque.type))
            return `bloque[${i}].type inválido (debe ser "text" o "code")`;
        if (typeof bloque.value !== 'string')
            return `bloque[${i}].value debe ser string`;
    }
    return null;
}
