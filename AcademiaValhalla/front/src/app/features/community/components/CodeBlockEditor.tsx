import { MonacoEditorDesktop } from '../../../components/MonacoEditor/MonacoEditorDesktop';

interface CodeBlockEditorProps {
    value: string;
    language: string;
    onChange: (value: string) => void;
    onLanguageChange: (language: string) => void;
    onRemove: () => void;
}

const LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
    'go', 'rust', 'ruby', 'php', 'html', 'css', 'sql', 'bash', 'json', 'yaml',
];

export const CodeBlockEditor = ({ value, language, onChange, onLanguageChange, onRemove }: CodeBlockEditorProps) => (
    <div className="rounded-sm border border-slate-200 dark:border-white/10 overflow-hidden my-2">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-[#1a1c21] border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Código</span>
                <select
                    value={language}
                    onChange={e => onLanguageChange(e.target.value)}
                    className="text-xs bg-transparent border border-slate-200 dark:border-white/10 rounded px-2 py-1 text-slate-600 dark:text-slate-300 focus:outline-none"
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
                Eliminar bloque
            </button>
        </div>
        <div className="h-[200px]">
            <MonacoEditorDesktop
                code={value}
                language={language}
                editable={true}
                onChange={val => onChange(val ?? '')}
                options={{
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    padding: { top: 8, bottom: 8 },
                    renderLineHighlight: 'none',
                }}
            />
        </div>
    </div>
);


