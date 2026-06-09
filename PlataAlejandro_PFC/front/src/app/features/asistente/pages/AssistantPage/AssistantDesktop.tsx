import { ChatAsistente } from '../../components/ChatAsistente';

export const AsistenteDesktop = () => (
    <div className="h-full flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-4xl flex flex-col h-full min-h-0">
            <div className="mb-4 px-1">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Asistente</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">IA de programación</p>
            </div>
            <div className="flex-1 min-h-0">
                <ChatAsistente />
            </div>
        </div>
    </div>
);
