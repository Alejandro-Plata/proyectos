import multer from 'multer';

// Las imágenes ya no se guardan en disco (efímero en Render), sino en memoria
// para subirlas a Supabase Storage desde los controladores (ver ServicioStorage).
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
