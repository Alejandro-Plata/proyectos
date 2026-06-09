import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MENU_ITEMS, useSidebar } from '../../hooks/useNavbar';

const PRIMARY_IDS = new Set(['profile', 'notes', 'challenges', 'community']);

const SUB_ROUTE_PATTERNS = [
    /^\/dashboard\/notes\/.+/,
    /^\/dashboard\/community\/.+/,
    /^\/dashboard\/messages/,
];

export const BottomNavMobile: React.FC = () => {
    const { activeSection } = useSidebar();
    const location = useLocation();

    const navigate = useNavigate();

    const isSubRoute = SUB_ROUTE_PATTERNS.some(re => re.test(location.pathname));
    if (isSubRoute) return null;

    const handleNavigation = (to: string) => {
        navigate(to);
        window.scrollTo(0, 0);
    };

    const mobileItems = MENU_ITEMS.filter((item) => PRIMARY_IDS.has(item.id));

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0a0b0e] border-t border-emerald-500/15 dark:border-emerald-500/10 px-2 pt-2 pb-4 md:hidden safe-area-pb">
            <div className="flex items-center justify-around max-w-lg mx-auto">
                {mobileItems.map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.to)}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                            className={`
                                relative flex flex-col items-center justify-center gap-1 p-2 transition-colors duration-200 group
                                min-w-[64px]
                                ${isActive
                                    ? 'text-emerald-500'
                                    : 'text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'
                                }
                            `}
                        >
                            <div
                                className={`
                                    absolute -top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-emerald-500 transition-all duration-300
                                    ${isActive ? 'opacity-100' : 'opacity-0'}
                                `}
                            />

                            <div className="w-6 h-6">
                                {item.icon}
                            </div>
                            <span
                                className={`
                                    font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-200
                                `}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
