import { createServer } from 'http';
import app from '../server.js';
import { conectarBD } from '../server.js';
import { inicializarSocketIO } from '../servicios/ServicioSocket.js';

const PORT = process.env.PORT || 3000;

async function iniciar() {
    await conectarBD();

    const httpServer = createServer(app);
    const io = inicializarSocketIO(httpServer);
    app.set('io', io);

    httpServer.listen(PORT, () => {});
}

iniciar();

export default app;

