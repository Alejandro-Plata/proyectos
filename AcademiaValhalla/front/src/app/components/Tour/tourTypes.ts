import type { ReactNode } from 'react';

export interface TourStep {
    id: string;
    route: string;
    target?: string;
    title: string;
    body: ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    interactive?: boolean;
    advanceOn?: 'next' | 'targetClick';
}

export interface TargetRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TourContextType {
    isActive: boolean;
    currentStep: TourStep | null;
    currentIndex: number;
    totalSteps: number;
    start: (tourId: string) => void;
    stop: () => void;
    next: () => void;
    prev: () => void;
}
