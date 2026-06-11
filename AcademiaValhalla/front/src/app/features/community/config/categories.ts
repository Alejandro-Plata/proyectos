import type { ReactNode } from "react";
import { Icons } from "../../../components/Icons";

export type ThreadCategory = 'doubt' | 'discussion' | 'job' | 'promo' | 'teamup';

export const CATEGORY_CONFIG: Record<ThreadCategory, { label: string; color: string; border: string; icon: ReactNode }> = {
    doubt: { label: 'Ayuda', color: 'text-rose-500', border: 'border-rose-500/30', icon: Icons.help },
    discussion: { label: 'Debate', color: 'text-indigo-400', border: 'border-indigo-400/30', icon: Icons.chat },
    job: { label: 'Empleo', color: 'text-emerald-500', border: 'border-emerald-500/30', icon: Icons.briefcase },
    promo: { label: 'Showcase', color: 'text-fuchsia-400', border: 'border-fuchsia-400/30', icon: Icons.star },
    teamup: { label: 'Team Up', color: 'text-cyan-400', border: 'border-cyan-400/30', icon: Icons.users },
};