import { API_BASE, authHeaders } from '../../../services/apiClient';

export type TipoHito = 'note' | 'challenge' | 'project' | 'checkpoint';
export type EstadoHito = 'pending' | 'done' | 'skipped';

export interface HitoSaga {
    milestone_id: string;
    position: number;
    type: TipoHito;
    ref_id: string | null;
    title: string;
    description: string | null;
    status: EstadoHito;
}

export interface SagaDetalle {
    saga_id: string;
    title: string;
    goal: string;
    progress: number;
    milestones: HitoSaga[];
}

export interface SagaResumen {
    saga_id: string;
    title: string;
    goal: string;
    progress: number;
    milestone_count: number;
}

const json = async (res: Response) => {
    if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.msg ?? 'Error en la petición');
    }
    return res.json();
};

export const sagasService = {
    listar: (): Promise<SagaResumen[]> =>
        fetch(`${API_BASE}/roadmap`, { headers: authHeaders() }).then(json),

    crear: (goal: string): Promise<SagaDetalle> =>
        fetch(`${API_BASE}/roadmap`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ goal }) }).then(json),

    obtener: (sagaId: string): Promise<SagaDetalle> =>
        fetch(`${API_BASE}/roadmap/${sagaId}`, { headers: authHeaders() }).then(json),

    actualizarHito: (sagaId: string, milestoneId: string, status: EstadoHito): Promise<void> =>
        fetch(`${API_BASE}/roadmap/${sagaId}/milestones/${milestoneId}`, {
            method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }),
        }).then(json),

    eliminar: (sagaId: string): Promise<void> =>
        fetch(`${API_BASE}/roadmap/${sagaId}`, { method: 'DELETE', headers: authHeaders() }).then(json),
};
