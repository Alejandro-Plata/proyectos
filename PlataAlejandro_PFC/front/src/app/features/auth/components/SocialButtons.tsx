import { Icons } from "../../../components/Icons";
import { authService } from "../../../services/authService";

export const SocialButtons = () => {
    return (
        <div className="flex justify-center gap-4 mb-4 sm:mb-0">
            <button
                type="button"
                onClick={() => authService.loginWithGoogle()}
                className="flex items-center justify-center gap-2 px-6 h-9 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/[0.06] text-slate-600 dark:text-slate-300 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors group"
            >
                {Icons.google}
                <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Google</span>
            </button>
            <button
                type="button"
                onClick={() => authService.loginWithGitHub()}
                className="flex items-center justify-center gap-2 px-6 h-9 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/[0.06] text-slate-600 dark:text-slate-300 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors group"
            >
                {Icons.gitHub}
                <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">GitHub</span>
            </button>
        </div>
    );
};
