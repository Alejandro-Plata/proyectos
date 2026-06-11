import { Icons } from './Icons';

interface Props {
    inviteCode: string;
    variant?: 'icon' | 'full' | 'footer';
    className?: string;
}

const getWebUrl = (code: string) => `https://discord.gg/${code}`;
const getDeepLink = (code: string) => `discord://discord.com/invite/${code}`;

export const DiscordButton = ({ inviteCode, variant = 'full', className = '' }: Props) => {
    const webUrl = getWebUrl(inviteCode);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = getDeepLink(inviteCode);
        document.body.appendChild(iframe);

        const fallbackTimer = setTimeout(() => {
            window.open(webUrl, '_blank', 'noopener,noreferrer');
        }, 1500);

        const handleBlur = () => {
            clearTimeout(fallbackTimer);
            window.removeEventListener('blur', handleBlur);
        };
        window.addEventListener('blur', handleBlur);

        setTimeout(() => {
            document.body.removeChild(iframe);
            window.removeEventListener('blur', handleBlur);
        }, 2000);
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleClick}
                aria-label="Unirse al Discord de Valhalla"
                className={`p-2 rounded-lg transition-colors text-slate-400 hover:text-[#5865F2] hover:bg-[#5865F2]/10 ${className}`}
            >
                {Icons.discord}
            </button>
        );
    }

    if (variant === 'footer') {
        return (
            <a
                href={webUrl}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-[#5865F2] transition-colors py-1 block ${className}`}
            >
                Comunidad (Discord)
            </a>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                text-sm font-semibold transition-all
                bg-[#5865F2] text-white hover:bg-[#4752C4]
                shadow-lg shadow-[#5865F2]/20 hover:shadow-xl hover:shadow-[#5865F2]/30
                hover:-translate-y-0.5
                ${className}
            `}
        >
            {Icons.discord}
            Unirse al Discord
        </button>
    );
};
