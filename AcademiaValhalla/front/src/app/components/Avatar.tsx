import { getAvatarUrl } from '../utils/getAvatarUrl';

const SIZE_CLASSES: Record<string, string> = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
};

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
    username: string;
    url?: string | null;
    size?: AvatarSize;
    className?: string;
    shape?: 'hex' | 'circle';
    isOnline?: boolean;
}

export const Avatar = ({ username, url, size = 'md', className = '', shape = 'hex', isOnline }: AvatarProps) => {
    const src = getAvatarUrl(username, url);
    if (shape === 'circle') {
        return (
            <img
                src={src}
                alt={username}
                className={`${SIZE_CLASSES[size]} rounded-full object-cover bg-slate-100 dark:bg-[#0a0b0e] ${className}`}
            />
        );
    }
    return (
        <div className={`relative shrink-0 ${SIZE_CLASSES[size]} ${className}`}>
            <img
                src={src}
                alt={username}
                className="w-full h-full hex-shield object-cover"
            />
            {isOnline && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0a0b0e]" />
            )}
        </div>
    );
};
