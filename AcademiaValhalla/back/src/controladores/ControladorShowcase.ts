import { Request, Response } from 'express';
import { ServicioShowcase } from '../servicios/ServicioShowcase.js';
import { subirArchivo } from '../servicios/ServicioStorage.js';

const esStaff = (rol?: string) => rol === 'ADMIN' || rol === 'MODERADOR';

export class ControladorShowcase {

    static listar = async (req: Request, res: Response) => {
        try {
            const { tech } = req.query as Record<string, string>;
            res.json(await ServicioShowcase.listar({ tech }));
        } catch (e) {
            console.error('[showcase.listar]', e);
            res.status(500).json({ msg: 'Error al listar proyectos' });
        }
    };

    static obtener = async (req: Request, res: Response) => {
        try {
            const detalle = await ServicioShowcase.obtener(req.params.id, req.user!.user_id);
            if (!detalle) return res.status(404).json({ msg: 'Proyecto no encontrado' });
            res.json(detalle);
        } catch (e) {
            console.error('[showcase.obtener]', e);
            res.status(500).json({ msg: 'Error al obtener el proyecto' });
        }
    };

    static crear = async (req: Request, res: Response) => {
        try {
            if (!req.body?.title?.trim() || !req.body?.summary?.trim()) {
                return res.status(400).json({ msg: 'Título y resumen son obligatorios' });
            }
            const proyecto = await ServicioShowcase.crear(req.user!.user_id, req.body);
            res.status(201).json(proyecto);
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error al crear el proyecto' });
        }
    };

    static actualizar = async (req: Request, res: Response) => {
        try {
            const p = await ServicioShowcase.actualizar(req.user!.user_id, req.params.id, req.body);
            res.json(p);
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error al actualizar' });
        }
    };

    static eliminar = async (req: Request, res: Response) => {
        try {
            const ok = await ServicioShowcase.eliminar(req.user!.user_id, req.params.id, esStaff(req.user!.role));
            if (!ok) return res.status(404).json({ msg: 'Proyecto no encontrado' });
            res.json({ msg: 'Proyecto eliminado' });
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error al eliminar' });
        }
    };

    static feedback = async (req: Request, res: Response) => {
        try {
            const f = await ServicioShowcase.feedback(req.user!.user_id, req.params.id, req.body);
            res.status(201).json(f);
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error al enviar feedback' });
        }
    };

    static upvote = async (req: Request, res: Response) => {
        try {
            res.json(await ServicioShowcase.toggleUpvote(req.user!.user_id, req.params.id));
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error' });
        }
    };

    static destacar = async (req: Request, res: Response) => {
        try {
            if (!esStaff(req.user!.role)) return res.status(403).json({ msg: 'Sin permisos' });
            const p = await ServicioShowcase.destacar(req.params.id, req.body?.featured !== false);
            res.json(p);
        } catch (e: any) {
            res.status(400).json({ msg: e?.message ?? 'Error' });
        }
    };

    static subirPortada = async (req: Request, res: Response) => {
        try {
            if (!req.file) return res.status(400).json({ msg: 'No se recibió ninguna imagen' });
            const url = await subirArchivo(req.file, 'showcase', 'cover');
            res.json({ url });
        } catch (e: any) {
            console.error('[showcase.subirPortada]', e);
            res.status(500).json({ msg: 'Error al subir la imagen' });
        }
    };
}
