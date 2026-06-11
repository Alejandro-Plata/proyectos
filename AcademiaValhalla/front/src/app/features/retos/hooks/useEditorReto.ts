import { useState, useCallback } from 'react';
import type { LogConsola as ConsoleLog } from '../types/types';

interface RetornoUseEditorReto {
    code: string;
    setCode: (code: string) => void;
    consoleOutput: ConsoleLog[];
    setConsoleOutput: React.Dispatch<React.SetStateAction<ConsoleLog[]>>;
    isRunning: boolean;
    setIsRunning: (running: boolean) => void;
    isSolved: boolean;
    setIsSolved: (solved: boolean) => void;
    resetEditor: (starterCode?: string) => void;
    clearConsole: () => void;
}

export const useEditorReto = (initialCode: string = ''): RetornoUseEditorReto => {
    const [code, setCode] = useState(initialCode);
    const [consoleOutput, setConsoleOutput] = useState<ConsoleLog[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isSolved, setIsSolved] = useState(false);

    const resetEditor = useCallback((starterCode?: string) => {
        setCode(starterCode || '');
        setConsoleOutput([]);
        setIsSolved(false);
    }, []);

    const clearConsole = useCallback(() => {
        setConsoleOutput([]);
    }, []);

    return {
        code,
        setCode,
        consoleOutput,
        setConsoleOutput,
        isRunning,
        setIsRunning,
        isSolved,
        setIsSolved,
        resetEditor,
        clearConsole
    };
};
