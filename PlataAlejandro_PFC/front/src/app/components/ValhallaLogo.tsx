import type { ValhallaLogoProps } from "./types/types";

export const ValhallaLogo = ({ 
  className = "h-10 w-auto", 
  iconOnly = false 
}: ValhallaLogoProps) => {
  return (
    <svg 

      viewBox={iconOnly ? "0 0 60 60" : "0 0 300 60"} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-labelledby="valhallaTitle"
    >
        <title id="valhallaTitle">Valhalla Logo</title>

        <defs>
            <linearGradient id="valhalla-gradient" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
        </defs>

        <g transform="translate(2, 5) scale(0.9)">
            <rect x="20" y="15" width="20" height="18" rx="2" fill="url(#valhalla-gradient)" />
            
            <g fill="#050505">
                <circle cx="25" cy="22" r="2" />
                <circle cx="35" cy="22" r="2" />
                <rect x="24" y="28" width="2" height="2" opacity="0.5"/>
                <rect x="29" y="28" width="2" height="2" opacity="0.5"/>
                <rect x="34" y="28" width="2" height="2" opacity="0.5"/>
            </g>

            <path d="M22 15 L15 5 M38 15 L45 5" stroke="url(#valhalla-gradient)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M30 15 L30 8" stroke="url(#valhalla-gradient)" strokeWidth="3" strokeLinecap="round"/>

            <path d="M15 18 L5 25 L5 35 L15 30 Z" fill="url(#valhalla-gradient)" opacity="0.8"/>
            <path d="M45 18 L55 25 L55 35 L45 30 Z" fill="url(#valhalla-gradient)" opacity="0.8"/>
            
            <g fill="url(#valhalla-gradient)">
                <rect x="20" y="36" width="3" height="3" />
                <rect x="25" y="39" width="3" height="3" />
                <rect x="32" y="39" width="3" height="3" />
                <rect x="37" y="36" width="3" height="3" />
            </g>
        </g>
        
        {!iconOnly && (
            <text 
                x="75" 
                y="40" 
                fontFamily="'Orbitron', 'Inter', sans-serif" 
                fontWeight="bold" 
                fontSize="32" 
                letterSpacing="0.1em"
                className="fill-slate-900 dark:fill-white transition-colors duration-300"
            >
                VALHALLA
            </text>
        )}
    </svg>
  );
};