import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagen no permitido. Usa PNG, JPG, WebP, SVG o GIF.'));
    }
};

const opciones = { storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } };

export const subirEscudo = multer(opciones);
export const subirAvatar = multer(opciones);
export const subirImagenNota = multer(opciones);
export const subirImagenPost = multer(opciones);

const chatFileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedAudio  = ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/mp3'];
    const allowedVideo  = ['video/mp4', 'video/webm'];
    if ([...allowedImages, ...allowedAudio, ...allowedVideo].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido en mensajes.'));
    }
};

export const subirAdjuntoMensaje = multer({
    storage,
    fileFilter: chatFileFilter,
    limits: { fileSize: 50 * 1024 * 1024 },
});
