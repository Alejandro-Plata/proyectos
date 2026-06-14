import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

export const BUCKET = process.env.SUPABASE_BUCKET || 'valhalla';

let cliente: SupabaseClient | null = null;

/**
 * Devuelve el cliente de Supabase (creado bajo demanda).
 * Lanza un error claro solo cuando se usa sin estar configurado,
 * de modo que el backend pueda arrancar aunque falten las variables.
 */
export function getSupabase(): SupabaseClient {
    if (cliente) return cliente;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            'Supabase Storage no configurado: define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.'
        );
    }

    cliente = createClient(url, key, {
        auth: { persistSession: false },
        realtime: { transport: ws as any },
    });
    return cliente;
}
