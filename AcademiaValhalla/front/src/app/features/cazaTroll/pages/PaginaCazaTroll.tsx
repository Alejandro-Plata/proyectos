import { CazaBichillo } from '../components/CazaBichillo';

/**
 * Caza al bichillo — página propia (también disponible en el panel de Freya).
 */
export const PaginaCazaTroll = () => {
    return (
        <div className="max-w-3xl mx-auto px-5 py-8">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
                    Caza al bichillo
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Freya ha escondido un bug en este código. Encuéntralo, márcalo y explícalo.
                </p>
            </header>

            <CazaBichillo />
        </div>
    );
};
