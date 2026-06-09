import { Router } from 'express';
import { body } from 'express-validator';
import { ControladorPerfil } from '../controladores/ControladorPerfil.js';
import { ControladorPanel } from '../controladores/ControladorPanel.js';
import { autenticar } from '../middleware/middlewareAuth.js';
import { manejarErroresEntrada } from '../middleware/middlewareValidacion.js';
import { subirAvatar } from '../config/subidaArchivos.js';

const router = Router();

/**
 * @openapi
 * /me/profile:
 *   get:
 *     tags: [Perfil]
 *     summary: Obtener mi perfil
 *     responses:
 *       '200':
 *         description: Datos del perfil del usuario autenticado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/profile', autenticar, ControladorPerfil.obtenerMiPerfil);

/**
 * @openapi
 * /me/avatar:
 *   post:
 *     tags: [Perfil]
 *     summary: Subir foto de perfil
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatar]
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Imagen JPEG/PNG (max 5 MB)
 *     responses:
 *       '200':
 *         description: Avatar actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar_url: { type: string, format: uri }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/avatar', autenticar, subirAvatar.single('avatar'), ControladorPerfil.subirAvatar);

/**
 * @openapi
 * /me/profile:
 *   patch:
 *     tags: [Perfil]
 *     summary: Actualizar datos del perfil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:     { type: string, minLength: 3, maxLength: 30, example: "vikingo42" }
 *               bio:          { type: string, maxLength: 500 }
 *               github_url:   { type: string, format: uri, example: "https://github.com/usuario" }
 *               linkedin_url: { type: string, format: uri, example: "https://linkedin.com/in/usuario" }
 *     responses:
 *       '200':
 *         description: Perfil actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
router.patch('/profile',
    autenticar,
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'),
    body('bio')
        .optional()
        .isLength({ max: 500 }).withMessage('La bio no puede exceder los 500 caracteres'),
    body('github_url')
        .optional({ values: 'falsy' })
        .matches(/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/)
        .withMessage('La URL de GitHub no tiene un formato válido'),
    body('linkedin_url')
        .optional({ values: 'falsy' })
        .matches(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/)
        .withMessage('La URL de LinkedIn no tiene un formato válido'),
    manejarErroresEntrada,
    ControladorPerfil.actualizarPerfil
);

/**
 * @openapi
 * /me/password:
 *   put:
 *     tags: [Perfil]
 *     summary: Cambiar contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password, new_password]
 *             properties:
 *               current_password: { type: string, format: password }
 *               new_password:     { type: string, format: password, minLength: 6 }
 *     responses:
 *       '200': { description: Contraseña actualizada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
router.put('/password',
    autenticar,
    body('current_password').notEmpty().withMessage('La contraseña actual es requerida'),
    body('new_password')
        .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
        .custom((value, { req }) => {
            if (value === req.body.current_password) {
                throw new Error('La nueva contraseña debe ser diferente a la actual');
            }
            return true;
        }),
    manejarErroresEntrada,
    ControladorPerfil.cambiarContrasena
);

/**
 * @openapi
 * /me/profile:
 *   delete:
 *     tags: [Perfil]
 *     summary: Eliminar cuenta
 *     responses:
 *       '200': { description: Cuenta eliminada }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.delete('/profile', autenticar, ControladorPerfil.eliminarCuenta);

/**
 * @openapi
 * /me/dashboard:
 *   get:
 *     tags: [Perfil]
 *     summary: Obtener estadísticas del panel personal
 *     responses:
 *       '200':
 *         description: Estadísticas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 level:              { $ref: '#/components/schemas/InfoNivel' }
 *                 challenges_solved:  { type: integer }
 *                 notes_count:        { type: integer }
 *                 posts_count:        { type: integer }
 *                 achievements_count: { type: integer }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/dashboard', autenticar, ControladorPanel.obtenerEstadisticasPanel);

export default router;
