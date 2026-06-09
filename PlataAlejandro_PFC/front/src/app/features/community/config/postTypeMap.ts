import type { ThreadCategory } from '../types/types';

export const CATEGORY_TO_POST_TYPE: Record<ThreadCategory, string> = {
    doubt:      'PREGUNTA',
    discussion: 'DISCUSION',
    job:        'EMPLEO',
    promo:      'PROYECTO',
    teamup:     'TEAMUP',
};

export const POST_TYPE_TO_CATEGORY: Record<string, ThreadCategory> = {
    PREGUNTA:  'doubt',
    DISCUSION: 'discussion',
    EMPLEO:    'job',
    PROYECTO:  'promo',
    TEAMUP:    'teamup',
    ARTICULO:  'discussion',
    RECURSO:   'discussion',
};
