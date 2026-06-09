import { useRef, useState } from 'react';
import { Icons } from '../../../components/Icons';
import { MonacoEditorMobile } from '../../../components/MonacoEditor/MonacoEditorMobile';
import { KeyboardAccessoryBar } from '../../../components/KeyboardAccessoryBar';
import type { Block, BlockType } from '../types/types';
import { LANGUAGES, EDITOR_TABS } from '../utils';
import { useBlockEditor, useNoteFormatToolbar } from '../hooks';
import { NoteFormatToolbar } from './NoteFormatToolbar';
import { ShortcutsModal } from './ShortcutsModal';
import { renderContent } from '../utils/renderContent';
import { useTheme } from '../../../hooks/useTheme';
import { uploadNoteImage } from '../services/uploadNoteImage';
import { resolveAssetUrl } from '../../../utils/getAvatarUrl';

interface FullScreenEditorProps {
    block?: Block | null;
    onSave: (b: Block, close: boolean) => void;
    onClose: () => void;
}

const getTabIcon = (id: string) => {
    switch (id) {
        case 'text': return Icons.document;
        case 'code': return Icons.code;
        case 'definition': return Icons.lightbulb;
        case 'image': return Icons.image;
        default: return Icons.document;
    }
};

export const FullScreenEditor = ({ block, onSave, onClose }: FullScreenEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { isDarkMode: isDark } = useTheme();
    const {
        activeTab,
        setActiveTab,
        content,
        setContent,
        extra,
        setExtra,
        createBlock,
        resetForm
    } = useBlockEditor({ initialBlock: block });

    const { applyFormat, handleKeyDown } = useNoteFormatToolbar({
        textareaRef,
        value: content,
        onChange: setContent,
    });

    const [textMode, setTextMode] = useState<'edit' | 'preview'>('edit');
    const [showShortcuts, setShowShortcuts] = useState(false);

    const handleSaveAction = (shouldClose: boolean) => {
        (document.activeElement as HTMLElement | null)?.blur();
        onSave(createBlock(), shouldClose);
        if (!shouldClose) {
            resetForm();
        }
    };

    const tituloEditor = block ? 'Editar bloque' : 'Nuevo bloque';

    return (
    <>
        <div role="dialog" aria-modal="true" aria-label={tituloEditor} className="fixed inset-0 z-[100] bg-white dark:bg-[#050505] flex flex-col animate-in slide-in-from-bottom duration-200">

            {/* HEADER — unified back + title + save */}
            <div
                className="flex items-center gap-2 px-2 bg-slate-50 dark:bg-[#0a0b0e] border-b border-slate-200 dark:border-emerald-500/15 shrink-0"
                style={{ paddingTop: 'env(safe-area-inset-top)', minHeight: 'calc(3.5rem + env(safe-area-inset-top))' }}
            >
                <button
                    onClick={onClose}
                    className="w-11 h-11 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-95"
                    aria-label="Cancelar"
                >
                    <div className="w-5 h-5">{Icons.back}</div>
                </button>

                <span className="flex-1 text-sm font-bold text-slate-900 dark:text-white truncate">
                    {tituloEditor}
                </span>

                <button
                    onClick={() => handleSaveAction(true)}
                    className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors active:scale-95"
                >
                    Guardar
                </button>
            </div>

            {/* TABS (Selector de Tipo) */}
            <div className="shrink-0 p-2 bg-slate-50 dark:bg-[#0a0b0e] border-b border-slate-200 dark:border-emerald-500/10">
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 gap-1 border border-slate-200 dark:border-emerald-500/10">
                    {EDITOR_TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as BlockType)}
                                className={`
                                    flex-1 py-2 flex flex-col items-center justify-center gap-0.5 transition-colors
                                    ${isActive
                                        ? 'bg-white dark:bg-[#151515] text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/20'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                                `}
                            >
                                <div className="w-5 h-5 flex items-center justify-center">
                                    {getTabIcon(tab.id)}
                                </div>
                                <span className="text-[9px] font-bold font-mono uppercase tracking-[0.15em]">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 overflow-y-auto relative flex flex-col bg-white dark:bg-[#050505]">

                {/* TEXTO */}
                {activeTab === 'text' && (
                    <div className="flex flex-col flex-1">
                        {/* Preview/Edit toggle bar */}
                        <div className="flex items-center justify-between px-4 h-10 border-b border-slate-200 dark:border-emerald-500/10 bg-slate-50 dark:bg-[#0a0b0e] shrink-0">
                            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                                {textMode === 'edit' ? 'Texto — Markdown' : 'Previsualización'}
                            </span>
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setTextMode(m => m === 'edit' ? 'preview' : 'edit')}
                                className="h-7 px-3 font-mono text-[9px] uppercase tracking-[0.15em] font-bold border border-slate-200 dark:border-emerald-500/20 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                            >
                                {textMode === 'edit' ? 'Vista previa' : 'Editar'}
                            </button>
                        </div>
                        {textMode === 'edit' ? (
                            <textarea
                                ref={textareaRef}
                                className="flex-1 w-full bg-transparent px-4 py-5 text-base text-slate-900 dark:text-slate-200 resize-none focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 leading-7 font-sans"
                                placeholder="Escribe aquí..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus={!block}
                            />
                        ) : (
                            <div className="flex-1 px-4 py-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed overflow-y-auto">
                                {content.trim()
                                    ? renderContent(content)
                                    : <span className="text-slate-400 dark:text-slate-600 italic">Sin contenido aún.</span>
                                }
                            </div>
                        )}
                    </div>
                )}

                {/* CÓDIGO */}
                {activeTab === 'code' && (
                    <div className="flex flex-col h-full">
                        <div className="flex gap-2 p-3 overflow-x-auto border-b border-slate-200 dark:border-emerald-500/10 bg-slate-50 dark:bg-[#0a0b0e] shrink-0 scrollbar-hide">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => setExtra({ ...extra, language: lang.id })}
                                    className={`h-9 px-3 text-xs font-bold font-mono uppercase tracking-[0.15em] border transition-colors whitespace-nowrap ${extra.language === lang.id
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                        : 'border-slate-200 dark:border-emerald-500/10 text-slate-500 bg-white dark:bg-[#151515] hover:border-slate-300 dark:hover:border-emerald-500/20 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 relative bg-slate-50 dark:bg-[#0d0d0d]">
                            <MonacoEditorMobile
                                code={content}
                                language={extra.language}
                                onChange={(val) => setContent(val || '')}
                                editable={true}
                                theme={isDark}
                            />
                        </div>
                        <KeyboardAccessoryBar onInsert={char => setContent(content + char)} />
                    </div>
                )}

                {/* DEFINICIÓN */}
                {activeTab === 'definition' && (
                    <div className="p-4 space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Título
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-white/[0.03] px-3 h-11 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-emerald-500/20 focus:border-emerald-500/50 dark:focus:border-emerald-500/50 outline-none transition-colors"
                                placeholder="Título"
                                value={extra.title}
                                onChange={(e) => setExtra({ ...extra, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Definición
                            </label>
                            <textarea
                                className="w-full h-48 bg-slate-50 dark:bg-white/[0.03] px-3 py-3 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-500/20 focus:border-emerald-500/50 dark:focus:border-emerald-500/50 outline-none resize-none transition-colors"
                                placeholder="Definición..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* IMAGEN */}
                {activeTab === 'image' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <label className="w-full aspect-square bg-slate-100 dark:bg-[#101010] border border-dashed border-slate-300 dark:border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden active:bg-emerald-500/[0.02] transition-colors">
                            {content ? <img src={resolveAssetUrl(content)} className="w-full h-full object-cover" /> : (
                                <div className="text-slate-500 flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-emerald-500/15 flex items-center justify-center">{Icons.image}</div>
                                    <span className="text-xs font-bold font-mono uppercase tracking-[0.15em]">Subir imagen</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const previewUrl = URL.createObjectURL(file);
                                setContent(previewUrl);
                                try {
                                    const persistedUrl = await uploadNoteImage(file);
                                    URL.revokeObjectURL(previewUrl);
                                    setContent(persistedUrl);
                                } catch {
                                    URL.revokeObjectURL(previewUrl);
                                    setContent('');
                                }
                            }} />
                        </label>
                    </div>
                )}
            </div>

            {/* MARKDOWN TOOLBAR — sticky bottom bar visible over keyboard for text blocks */}
            {activeTab === 'text' && textMode === 'edit' && (
                <div className="shrink-0 border-t border-slate-200 dark:border-emerald-500/10 bg-white dark:bg-[#0a0b0e] overflow-x-auto scrollbar-hide">
                    <div className="flex items-center px-1 min-w-max">
                        <NoteFormatToolbar onAction={applyFormat} onHelp={() => setShowShortcuts(true)} />
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <div
                className="shrink-0 p-4 border-t border-slate-200 dark:border-emerald-500/10 bg-slate-50 dark:bg-[#0a0b0e]"
                style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
            >
                {block ? (
                    <button
                        onClick={() => handleSaveAction(true)}
                        className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-[10px] uppercase tracking-[0.15em] font-bold transition-colors active:scale-[0.98]"
                    >
                        Guardar bloque
                    </button>
                ) : (
                    <button
                        onClick={() => handleSaveAction(false)}
                        className="w-full h-12 bg-slate-100 dark:bg-[#151515] border border-slate-200 dark:border-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase tracking-[0.15em] font-bold hover:bg-slate-50 dark:hover:bg-emerald-500/[0.04] hover:border-emerald-500/30 transition-colors"
                    >
                        + Añadir y crear otro
                    </button>
                )}
            </div>
        </div>

        {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>
    );
};
