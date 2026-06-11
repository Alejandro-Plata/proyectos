import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
// @ts-expect-error - js-yaml viene como dependencia transitiva de swagger-jsdoc, sin tipos propios
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Valhalla Academy API',
            version: '1.0.0',
            description:
                'API REST de la plataforma de aprendizaje de programación Valhalla Academy. ' +
                'Autenticación mediante JWT Bearer en el encabezado `Authorization: Bearer <token>`.',
            contact: { email: 'soporte@valhalla.dev' },
            license: { name: 'ISC' },
        },
        servers: [
            { url: 'http://localhost:3000/api/v1', description: 'Local' },
            { url: 'https://api.valhalla.dev/api/v1', description: 'Producción' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtenido en /auth/login o /auth/register',
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth',           description: 'Registro, login y OAuth' },
            { name: 'Perfil',         description: 'Datos y configuración del usuario autenticado' },
            { name: 'Retos',          description: 'Catálogo de retos y ejecución de código' },
            { name: 'Academia',       description: 'Contenidos didácticos' },
            { name: 'Notas',          description: 'Notas personales del usuario' },
            { name: 'Publicaciones',  description: 'Foro, comentarios y votos' },
            { name: 'Mensajería',     description: 'Conversaciones y mensajes directos' },
            { name: 'Logros',         description: 'Achievements y progreso de XP' },
            { name: 'Asistente',      description: 'Asistente IA basado en Groq' },
            { name: 'Búsqueda',       description: 'Búsqueda y perfiles públicos de usuarios' },
            { name: 'Admin',          description: 'Operaciones de administración y moderación' },
            { name: 'Público',        description: 'Endpoints sin autenticación' },
        ],
    },
    apis: [
        path.join(__dirname, '../rutas/*.ts'),
        path.join(__dirname, '../rutas/*.js'),
    ],
};

const generatedSpec = swaggerJSDoc(options) as Record<string, any>;

// swagger-jsdoc no fusiona automáticamente los componentes definidos en un YAML
// que no contenga marcadores JSDoc, así que los cargamos manualmente y los
// mezclamos con los `securitySchemes` declarados inline.
const componentsYamlPath = path.join(__dirname, 'schemas/components.yaml');
const componentsYaml = yaml.load(fs.readFileSync(componentsYamlPath, 'utf8')) as {
    components?: {
        schemas?: Record<string, unknown>;
        responses?: Record<string, unknown>;
    };
};

generatedSpec.components = {
    ...(generatedSpec.components ?? {}),
    schemas: {
        ...(generatedSpec.components?.schemas ?? {}),
        ...(componentsYaml.components?.schemas ?? {}),
    },
    responses: {
        ...(generatedSpec.components?.responses ?? {}),
        ...(componentsYaml.components?.responses ?? {}),
    },
};

export const swaggerSpec = generatedSpec;
