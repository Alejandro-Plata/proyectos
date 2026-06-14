import { createServer } from 'http';
import app from '../server.js';
import { conectarBD } from '../server.js';
import { inicializarSocketIO } from '../servicios/ServicioSocket.js';
import { ServicioTorneos } from '../servicios/ServicioTorneos.js';

const PORT = process.env.PORT || 3000;

async function iniciar() {
    await conectarBD();

    const httpServer = createServer(app);
    const io = inicializarSocketIO(httpServer);
    app.set('io', io);

    // Reconcilia estados de torneos cada minuto
    setInterval(() => {
        ServicioTorneos.reconciliarEstados().catch(() => {});
    }, 60_000);

    httpServer.listen(PORT, () => {});
}

iniciar();

export default app;

