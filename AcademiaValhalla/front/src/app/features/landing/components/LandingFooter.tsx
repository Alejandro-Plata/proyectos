import React from 'react';
import { Link } from 'react-router-dom';
import { ValhallaLogo } from '../../../components/ValhallaLogo';

interface LandingFooterProps {
    year: number;
}

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
        to={to}
        className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
    >
        {children}
    </Link>
);

export const LandingFooter: React.FC<LandingFooterProps> = ({ year }) => {
    return (
        <footer className="relative w-full border-t border-emerald-500/10 bg-white dark:bg-[#050505] py-8 z-10"
            style={{ boxShadow: 'inset 0 1px 0 rgba(16,185,129,0.08)' }}>

            {/* Grid decorativo */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none opacity-60" />

            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">

                <ValhallaLogo className="h-7 w-auto" />

                <div className="flex items-center gap-6">
                    <FooterLink to="/codigo-comportamiento">Código de conducta</FooterLink>
                    <span className="w-px h-3 bg-emerald-500/20" />
                    <FooterLink to="/terminos">Términos y condiciones</FooterLink>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    © {year} Valhalla Academy
                </p>
            </div>
        </footer>
    );
};
