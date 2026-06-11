import { useProfile } from "../../hooks/useProfile";
import { ProfileInfo } from "../../components/perfilInfo/ProfileInfo";
import { ProfileStatCard } from "../../components/profileStats/ProfileStatCard";
import { TrophyShowcase } from "../../components/TrophyShowcase";
import { DiscordButton } from "../../../../components/DiscordButton";
import { DISCORD_INVITE_CODE } from "../../../../config/discord";

export const PerfilMobile = () => {
    const { user, stats, isLoading, xpPercentage } = useProfile();

    return (
        <div className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-900 dark:text-slate-200 pb-24 transition-colors duration-300">

            <div className="px-4 pt-6 space-y-6">
                {/* BB-4 Page title */}
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">@{user.username}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Tu perfil</p>
                </div>

                {/* 1. Cabecera y Barra de Nivel Unificadas */}
                <ProfileInfo user={user} xpPercentage={xpPercentage} />

                {/* 2. Grid 2x2 de Estadísticas */}
                <div className="grid grid-cols-2 gap-3">
                    <ProfileStatCard label="Retos" value={stats?.challengesCompleted ?? 0} isLoading={isLoading} />
                    <ProfileStatCard label="En progreso" value={stats?.challengesInProgress ?? 0} isLoading={isLoading} />
                    <ProfileStatCard label="Apuntes" value={stats?.notesCount ?? 0} isLoading={isLoading} />
                    <ProfileStatCard label="Foro" value={stats?.postsCount ?? 0} isLoading={isLoading} />
                </div>

                {/* 3. Vitrina de Insignias */}
                <TrophyShowcase />

                {/* 4. Discord */}
                <DiscordButton inviteCode={DISCORD_INVITE_CODE} variant="full" className="w-full justify-center rounded-none" />
            </div>
        </div>
    );
};
