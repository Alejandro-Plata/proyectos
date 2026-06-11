import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { ControladorAuth } from '../controladores/ControladorAuth.js'
import { manejarErroresEntrada } from '../middleware/middlewareValidacion.js';
import { autenticar } from '../middleware/middlewareAuth.js';
import passport from '../config/passport.js';
import { generarJWT } from '../utils/jwt.js';
import { Usuario } from '../modelos/Modelos.js';

const router = Router();

// Rate limiters (mitigación §3.2 de SEGURIDAD.md)
// Mensajes neutros para no facilitar enumeración de cuentas.
const limiteLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Espera 15 minutos antes de reintentar.' },
});

const limiteRegistro = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos de registro. Espera una hora.' },
});

const limiteForgotPassword = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Si el email está registrado, recibirás un código.' },
});

const limiteVerifyResetCode = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Solicita un nuevo código.' },
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Crear una cuenta nueva
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string, minLength: 1, example: "thor_dev" }
 *               email:    { type: string, format: email, example: "thor@valhalla.dev" }
 *               password: { type: string, minLength: 6, format: password, example: "s3cret!" }
 *     responses:
 *       '201':
 *         description: Cuenta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:  { $ref: '#/components/schemas/Usuario' }
 *                 token: { type: string, description: JWT }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '409': { $ref: '#/components/responses/Conflict' }
 */
router.post('/register',
    limiteRegistro,
    body('username').notEmpty().withMessage("El nombre de usuario no puede ir vacío"),
    body('email').notEmpty().withMessage("El email no puede ir vacío").isEmail().withMessage("El email no es válido"),
    body('password').isLength({ min: 6 }).withMessage("La contraseña es demasiado corta"),
    manejarErroresEntrada,
    ControladorAuth.crearCuenta);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: "thor_dev" }
 *               password: { type: string, format: password, example: "s3cret!" }
 *     responses:
 *       '200':
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:  { $ref: '#/components/schemas/Usuario' }
 *                 token: { type: string }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/login',
    limiteLogin,
    body('username').notEmpty().withMessage("El nombre de usuario es obligatorio."),
    body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
    manejarErroresEntrada,
    ControladorAuth.iniciarSesion
);

/**
 * @openapi
 * /auth/user:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener usuario autenticado
 *     responses:
 *       '200':
 *         description: Datos del usuario actual
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/user', autenticar, ControladorAuth.obtenerUsuario);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión (invalida el refresh token)
 *     responses:
 *       '200':
 *         description: Sesión cerrada
 */
router.post('/logout', ControladorAuth.cerrarSesion);

/**
 * @openapi
 * /auth/validate:
 *   get:
 *     tags: [Auth]
 *     summary: Validar token JWT
 *     responses:
 *       '200':
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:  { $ref: '#/components/schemas/Usuario' }
 *                 token: { type: string }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.get('/validate', autenticar, async (req, res) => {
    const usuario = req.user as Usuario;
    const token = req.headers.authorization?.split(' ')[1];
    res.json({ user: usuario, token });
});

/**
 * @openapi
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Iniciar flujo OAuth con Google
 *     security: []
 *     description: Redirige al navegador a la página de consentimiento de Google. No invocar desde Swagger UI.
 *     responses:
 *       '302':
 *         description: Redirección a Google OAuth
 */
// Quitamos la barra final para no generar dobles barras en el redirect (//oauth/callback).
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'], session: false })
);

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Callback de Google OAuth (uso interno)
 *     security: []
 *     description: Google redirige aquí tras la autenticación. El servidor redirige al frontend con un JWT.
 *     responses:
 *       '302':
 *         description: Redirección al frontend con token
 */
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google_failed` }),
    (req, res) => {
        const usuario = req.user as any;
        const token = generarJWT(usuario.user_id);
        res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
    }
);

/**
 * @openapi
 * /auth/github:
 *   get:
 *     tags: [Auth]
 *     summary: Iniciar flujo OAuth con GitHub
 *     security: []
 *     description: Redirige al navegador a la página de consentimiento de GitHub. No invocar desde Swagger UI.
 *     responses:
 *       '302':
 *         description: Redirección a GitHub OAuth
 */
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
);

/**
 * @openapi
 * /auth/github/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Callback de GitHub OAuth (uso interno)
 *     security: []
 *     description: GitHub redirige aquí tras la autenticación. El servidor redirige al frontend con un JWT.
 *     responses:
 *       '302':
 *         description: Redirección al frontend con token
 */
router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=github_failed` }),
    (req, res) => {
        const usuario = req.user as any;
        const token = generarJWT(usuario.user_id);
        res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
    }
);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Solicitar código de restablecimiento de contraseña
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: "thor@valhalla.dev" }
 *     responses:
 *       '200': { description: Código enviado al email }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 */
router.post('/forgot-password',
    limiteForgotPassword,
    body('email').isEmail().withMessage('Email inválido'),
    manejarErroresEntrada,
    ControladorAuth.solicitarRestablecimiento
);

/**
 * @openapi
 * /auth/verify-reset-code:
 *   post:
 *     tags: [Auth]
 *     summary: Verificar código de restablecimiento
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email: { type: string, format: email }
 *               code:  { type: string, minLength: 6, maxLength: 6, example: "123456" }
 *     responses:
 *       '200':
 *         description: Código válido — devuelve resetToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resetToken: { type: string }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 */
router.post('/verify-reset-code',
    limiteVerifyResetCode,
    body('email').isEmail().withMessage('Email inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Código debe tener 6 dígitos'),
    manejarErroresEntrada,
    ControladorAuth.verificarCodigoRestablecimiento
);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Restablecer contraseña con resetToken
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resetToken, newPassword]
 *             properties:
 *               resetToken:  { type: string }
 *               newPassword: { type: string, minLength: 6, format: password }
 *     responses:
 *       '200': { description: Contraseña actualizada }
 *       '400': { $ref: '#/components/responses/ValidationError' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/reset-password',
    body('resetToken').notEmpty().withMessage('Token requerido'),
    body('newPassword').isLength({ min: 6 }).withMessage('La contraseña es demasiado corta'),
    manejarErroresEntrada,
    ControladorAuth.restablecerContrasena
);

export default router;
