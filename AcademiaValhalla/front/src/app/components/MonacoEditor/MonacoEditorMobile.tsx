import { useEffect, useRef, useState } from 'react';
import Editor, {type OnMount, type BeforeMount, type Monaco } from "@monaco-editor/react";
import type { editor } from 'monaco-editor';
import { type IMonacoTypeScript, type MonacoEditorMobileProps } from '../types/types';
import { useTailwindTheme } from '../../hooks/useTailwindTheme';

const THEME_DARK: editor.IStandaloneThemeData = {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
        'editor.background': '#303446',
        'editor.foreground': '#c6d0f5',
        'editor.lineHighlightBackground': '#414559',
        'editorCursor.foreground': '#f2d5cf',
        'editor.selectionBackground': '#414559',
        'editorWidget.background': '#292c3c',
        'editorWidget.border': '#414559',
    }
};

const THEME_LIGHT: editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
        'editor.background': '#eff1f5',
        'editor.foreground': '#4c4f69',
        'editor.lineHighlightBackground': '#e6e9ef',
        'editorCursor.foreground': '#dc8a78',
        'editor.selectionBackground': '#acb0be',
        'editorWidget.background': '#e6e9ef',
        'editorWidget.border': '#ccd0da',
    }
};

const THEME_NAME_DARK = 'valhalla-dark';
const THEME_NAME_LIGHT = 'valhalla-light';

export const MonacoEditorMobile = ({
    id,
    code,
    language = 'javascript',
    editable = false,
    onChange,
    theme,
    options,
    showCopyButton = true
}: MonacoEditorMobileProps) => {

    const isSystemDark = useTailwindTheme();
    const isDark = theme ?? isSystemDark;
    const monacoRef = useRef<Monaco | null>(null);
    const [copied, setCopied] = useState(false);
    const [editorId] = useState(() => id || `editor-mobile-${Math.random().toString(36).substring(7)}`);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const themeName = isDark ? THEME_NAME_DARK : THEME_NAME_LIGHT;

    const handleBeforeMount: BeforeMount = (monaco) => {
        monaco.editor.defineTheme(THEME_NAME_DARK, THEME_DARK);
        monaco.editor.defineTheme(THEME_NAME_LIGHT, THEME_LIGHT);
    };

    const handleOnMount: OnMount = (_, monacoInstance) => {
        monacoRef.current = monacoInstance;
        monacoInstance.editor.setTheme(themeName);

        const tsLanguage = monacoInstance.languages.typescript as unknown as IMonacoTypeScript;
        if (tsLanguage && tsLanguage.javascriptDefaults) {
            tsLanguage.javascriptDefaults.setCompilerOptions({
                target: tsLanguage.ScriptTarget.ES2020,
                allowNonTsExtensions: true,
                noEmit: true,
            });
        }
    };

    useEffect(() => {
        if (monacoRef.current) {
            monacoRef.current.editor.setTheme(themeName);
        }
    }, [themeName]);

    const ext = language === 'python' ? 'py' : language === 'typescript' ? 'ts'
        : language === 'java' ? 'java' : language === 'csharp' ? 'cs'
        : language === 'go' ? 'go' : 'js';

    return (
        <div id={id} className="relative h-full">
            <Editor
                height="100%"
                language={language}
                path={`inmemory://${editorId}/${language}/main.${ext}`}
                value={code}
                onChange={onChange}
                theme={themeName}
                beforeMount={handleBeforeMount}
                onMount={handleOnMount}
                options={{
                    readOnly: !editable,
                    domReadOnly: !editable,

                    minimap: { enabled: false },
                    glyphMargin: false,
                    folding: false,
                    lineNumbers: editable ? 'on' : 'off',
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,

                    fontSize: 14,
                    fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace",
                    fontLigatures: true,

                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },

                    wordWrap: 'on',
                    wrappingIndent: 'indent',

                    renderLineHighlight: editable ? 'line' : 'none',

                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'auto',
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8,
                        useShadows: false,
                    },

                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    contextmenu: false,
                    quickSuggestions: false,

                    mouseWheelZoom: false,
                    smoothScrolling: true,

                    ...options
                }}
            />
            {!editable && showCopyButton && (
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 active:bg-white dark:active:bg-slate-700 transition-all shadow-sm backdrop-blur-sm"
                    title="Copiar código"
                >
                    {copied ? (
                        <>
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            <span className="text-emerald-600 dark:text-emerald-400">Copiado</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            Copiar
                        </>
                    )}
                </button>
            )}
        </div>
    );
};