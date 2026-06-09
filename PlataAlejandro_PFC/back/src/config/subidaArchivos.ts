import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emblemsDir = path.join(__dirname, '../../public/uploads/emblems');
const avatarsDir = path.join(__dirname, '../../public/uploads/avatars');
if (!fs.existsSync(emblemsDir)) fs.mkdirSync(emblemsDir, { recursive: true });
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, emblemsDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `emblem-${uuidv4()}${ext}`);
    },
});

const avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, avatarsDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${uuidv4()}${ext}`);
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagen no permitido. Usa PNG, JPG, WebP, SVG o GIF.'));
    }
};

const notesDir = path.join(__dirname, '../../public/uploads/notes');
const postsDir = path.join(__dirname, '../../public/uploads/posts');
if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir, { recursive: true });
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

const noteImageStorage = multer.diskStorage({
    destination: (_req, _file, cb) => { cb(null, notesDir); },
    filename:    (_req, file, cb) => { cb(null, `note-${uuidv4()}${path.extname(file.originalname)}`); },
});
const postImageStorage = multer.diskStorage({
    destination: (_req, _file, cb) => { cb(null, postsDir); },
    filename:    (_req, file, cb) => { cb(null, `post-${uuidv4()}${path.extname(file.originalname)}`); },
});

export const subirEscudo = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const subirAvatar = multer({
    storage: avatarStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const subirImagenNota = multer({
    storage: noteImageStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const subirImagenPost = multer({
    storage: postImageStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
