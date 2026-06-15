import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { ControladorReto } from '../controladores/ControladorReto.js';
import { ControladorMaestrias } from '../controladores/ControladorMaestrias.js';

const router = Router();

// 10 ejecuciones por IP cada 5 minutos
const executeLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { error: 'Has excedido el número de ejecuciones gratuitas. Crea una cuenta para continuar.' },
});

/**
 * @openapi
 * /public/execute:
 *   post:
 *     tags: [Público]
 *     summary: Ejecutar código sin autenticación (rate-limited)
 *     security: []
 *     description: |
 *       Permite ejecutar código sin cuenta. Limitado a 10 ejecuciones
 *       por IP cada 5 minutos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [language, code]
 *             properties:
 *               language: { type: string, example: "javascript" }
 *               code:     { type: string, example: "console.log('hola')" }
 *               stdin:    { type: string }
 *     responses:
 *       '200':
 *         description: Resultado de la ejecución
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ResultadoEjecucion' }
 *       '429':
 *         description: Demasiadas peticiones — límite de ejecuciones alcanzado
 *       '504': { description: Timeout de ejecución }
 */
router.post('/execute', executeLimiter, ControladorReto.execute);

router.get('/card/:username', ControladorMaestrias.tarjetaPublica);

export default router;
