import { type ReactNode, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { useCreatePost } from '../../hooks/useCreatePost';
import { CATEGORY_CONFIG } from '../../config/categories';
import { CodeBlockEditor } from '../../components/CodeBlockEditor';
import type { ThreadCategory } from '../../types/types';
import type { EditorBlock, EditorBlockType } from '../../hooks/useRichEditor';
import { renderContent } from '../../../notes/utils/renderContent';
import { NoteFormatToolbar } from '../../../notes/components/NoteFormatToolbar';
import { ShortcutsModal } from '../../../notes/components/ShortcutsModal';
import { useNoteFormatToolbar } from '../../../notes/hooks/useNoteFormatToolbar';
import { resolveAssetUrl } from '../../../../utils/getAvatarUrl';

const CATEGORY_STYLE: Record<ThreadCategory, { text: string; border: string }> = {
    doubt:      { text: 'text-rose-500',    border: 'border-rose-500' },
    discussion: { text: 'text-indigo-400',  border: 'border-indigo-400' },
    job:        { text: 'text-emerald-500', border: 'border-emerald-500' },
    promo:      { text: 'text-fuchsia-400', border: 'border-fuchsia-400' },
    teamup:     { text: 'text-cyan-400',    border: 'border-cyan-400' },
};

const BLOCK_TYPE_CONFIG: Record<EditorBlockType, { label: string; icon: ReactNode; description: string }> = {
    text:       { label: 'Texto',       icon: Icons.document,  description: 'Párrafo con formato' },
    code:       { label: 'Código',      icon: Icons.codeBlock, description: 'Bloque de código' },
    definition: { label: 'Definición', icon: Icons.lightbulb, description: 'Concepto destacado' },
    image:      { label: 'Imagen',     icon: Icons.image,     description: 'URL de imagen' },
};

// ─── Bloque de texto con toolbar completa ───────────────────────────────────

interface ForumTextBlockEditorProps {
    block: EditorBlock;
    canRemove: boolean;
    onRemove: () => void;
    onUpdate: (val: string) => void;
    onAddCodeBlock: () => void;
}

const ForumTextBlockEditor = ({ block, canRemove, onRemove, onUpdate, onAddCodeBlock }: ForumTextBlockEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { applyFormat, handleKeyDown } = useNoteFormatToolbar({
        textareaRef,
        value: block.value,
        onChange: onUpdate,
    });
    const [previewActive, setPreviewActive] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);

    return (
        <div className="border-b border-emerald-500/[0.06] last:border-b-0">
            <div className="flex items-center gap-1 border-b border-emerald-500/10 dark:border-emerald-500/[0.07] bg-slate-50 dark:bg-[#111214] min-h-[44px]">
                {!previewActive && (
                    <div className="flex items-center flex-1 overflow-x-auto scrollbar-hide px-1">
                        <NoteFormatToolbar
                            onAction={applyFormat}
                            onHelp={() => setShowShortcuts(true)}
                            className="min-w-max"
                        />
                        <div className="w-px h-5 bg-emerald-500/15 mx-1 shrink-0" />
                        <button
                            type="button"
                            onClick={onAddCodeBlock}
                            title="Insertar bloque de código"
                            className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 active:bg-emerald-500/[0.06] transition-colors shrink-0"
                        >
                            <span className="w-5 h-5 flex items-center justify-center">{Icons.codeBlock}</span>
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-1 px-2 shrink-0 ml-auto">
                    {canRemove && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Eliminar bloque"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <button
                        type="button"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setPreviewActive(p => !p)}
                        className="shrink-0 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] border transition-colors text-slate-500 border-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400"
                    >
                        {previewActive ? 'Editar' : 'Preview'}
                    </button>
                </div>
            </div>

            {previewActive ? (
                <div className="px-5 py-5 min-h-[140px] text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {block.value.trim()
                        ? renderContent(block.value)
                        : <span className="text-slate-400 italic font-mono text-[11px]">Sin contenido aún.</span>
                    }
                </div>
            ) : (
                <textarea
                    ref={textareaRef}
                    value={block.value}
                    onChange={e => onUpdate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe tu duda, proyecto o debate. Soporta **negrita**, *cursiva*, `código`..."
                    className="w-full px-5 py-5 min-h-[180px] resize-y bg-transparent border-none outline-none text-slate-900 dark:text-slate-200 text-sm font-mono leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
            )}

            {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
        </div>
    );
};

// ─── Bloque de definición con toolbar en el cuerpo ──────────────────────────

interface ForumDefinitionBlockEditorProps {
    block: EditorBlock;
    canRemove: boolean;
    onRemove: () => void;
    onUpdate: (val: string) => void;
    onUpdateTitle: (title: string) => void;
}

const ForumDefinitionBlockEditor = ({ block, canRemove, onRemove, onUpdate, onUpdateTitle }: ForumDefinitionBlockEditorProps) => {
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const { applyFormat, handleKeyDown } = useNoteFormatToolbar({
        textareaRef: bodyRef,
        value: block.value,
        onChange: onUpdate,
    });
    const [showShortcuts, setShowShortcuts] = useState(false);

    return (
        <div className="border-b border-emerald-500/[0.06] last:border-b-0 group">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#111214] border-b border-emerald-500/[0.07]">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/60">Definición</span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        Eliminar
                    </button>
                )}
            </div>

            <div className="border-l-2 border-emerald-500/50 ml-4 my-3 mr-4">
                {/* Título */}
                <input
                    type="text"
                    value={block.title || ''}
                    onChange={e => onUpdateTitle(e.target.value)}
                    placeholder="Concepto clave..."
                    className="w-full px-3 py-2 bg-transparent border-none outline-none font-mono text-[11px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 placeholder:text-emerald-500/30 border-b border-emerald-500/15"
                />

                {/* Toolbar del cuerpo */}
                <div className="flex items-center overflow-x-auto scrollbar-hide border-b border-emerald-500/10 bg-emerald-500/[0.02]">
                    <NoteFormatToolbar
                        onAction={applyFormat}
                        onHelp={() => setShowShortcuts(true)}
                        className="min-w-max"
                    />
                </div>

                {/* Cuerpo */}
                <textarea
                    ref={bodyRef}
                    value={block.value}
                    onChange={e => onUpdate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Definición o explicación del concepto. Soporta **negrita**, *cursiva*, `código`..."
                    rows={3}
                    className="w-full px-3 py-3 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 resize-y font-mono leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
            </div>

            {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
        </div>
    );
};

// ─── Bloque de imagen ────────────────────────────────────────────────────────

interface ForumImageBlockEditorProps {
    block: EditorBlock;
    canRemove: boolean;
    onRemove: () => void;
    onUpdate: (val: string) => void;
}

const ForumImageBlockEditor = ({ block, canRemove, onRemove, onUpdate }: ForumImageBlockEditorProps) => (
    <div className="border-b border-emerald-500/[0.06] last:border-b-0 group">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#111214] border-b border-emerald-500/[0.07]">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/60">Imagen</span>
            {canRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                    Eliminar
                </button>
            )}
        </div>
        <div className="px-4 py-4 space-y-3">
            <input
                type="url"
                value={block.value}
                onChange={e => onUpdate(e.target.value)}
                placeholder="https://... URL de la imagen"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111214] border border-emerald-500/15 dark:border-emerald-500/10 font-mono text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-emerald-500/40 transition-colors"
            />
            {block.value.trim() && (
                <div className="border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                    <img
                        src={block.value}
                        alt="Vista previa"
                        className="w-full max-h-64 object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                </div>
            )}
        </div>
    </div>
);

// ─── Router de bloques ───────────────────────────────────────────────────────

interface BlockRouterProps {
    block: EditorBlock;
    isOnly: boolean;
    onRemove: () => void;
    onUpdate: (val: string) => void;
    onUpdateTitle: (title: string) => void;
    onUpdateLanguage: (lang: string) => void;
    onAddCodeBlock: () => void;
}

const BlockRouter = ({ block, isOnly, onRemove, onUpdate, onUpdateTitle, onUpdateLanguage, onAddCodeBlock }: BlockRouterProps) => {
    const canRemove = !isOnly || block.type !== 'text';

    if (block.type === 'text') {
        return (
            <ForumTextBlockEditor
                block={block}
                canRemove={canRemove}
                onRemove={onRemove}
                onUpdate={onUpdate}
                onAddCodeBlock={onAddCodeBlock}
            />
        );
    }
    if (block.type === 'definition') {
        return (
            <ForumDefinitionBlockEditor
                block={block}
                canRemove={canRemove}
                onRemove={onRemove}
                onUpdate={onUpdate}
                onUpdateTitle={onUpdateTitle}
            />
        );
    }
    if (block.type === 'image') {
        return (
            <ForumImageBlockEditor
                block={block}
                canRemove={canRemove}
                onRemove={onRemove}
                onUpdate={onUpdate}
            />
        );
    }
    // code
    return (
        <div className="border-b border-emerald-500/[0.06] last:border-b-0">
            <CodeBlockEditor
                value={block.value}
                language={block.language || 'javascript'}
                onChange={onUpdate}
                onLanguageChange={onUpdateLanguage}
                onRemove={onRemove}
            />
        </div>
    );
};

// ─── Preview de un bloque ────────────────────────────────────────────────────

const BlockPreview = ({ block }: { block: EditorBlock }) => {
    if (block.type === 'code') {
        if (!block.value.trim()) return null;
        return (
            <pre className="bg-slate-100 dark:bg-[#0f1115] border border-emerald-500/10 px-4 py-4 font-mono text-sm text-slate-800 dark:text-emerald-300 overflow-x-auto whitespace-pre">
                {block.value}
            </pre>
        );
    }
    if (block.type === 'definition') {
        if (!block.value.trim() && !block.title?.trim()) return null;
        return (
            <div className="border-l-2 border-emerald-500/50 pl-4 py-2 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05]">
                {block.title?.trim() && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1">{block.title}</p>
                )}
                <div className="text-sm text-slate-700 dark:text-slate-300">{renderContent(block.value)}</div>
            </div>
        );
    }
    if (block.type === 'image') {
        if (!block.value.trim()) return null;
        return (
            <div className="border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                <img src={resolveAssetUrl(block.value)} alt="" className="w-full max-h-80 object-cover" />
            </div>
        );
    }
    if (!block.value.trim()) return null;
    return <div className="text-sm leading-relaxed">{renderContent(block.value)}</div>;
};

// ─── Página principal ────────────────────────────────────────────────────────

const SectionLabel = ({ step, label }: { step: string; label: string }) => (
    <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-bold text-emerald-500/50 tracking-[0.2em]">{step}</span>
        <span className="w-px h-4 bg-emerald-500/30 shrink-0" />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300 font-bold">{label}</span>
    </div>
);

export const CreatePostDesktop = () => {
    const navigate = useNavigate();
    const {
        selectedCategory, setSelectedCategory,
        title, setTitle,
        editor,
        isSubmitting,
        error,
        canPublish,
        handlePublish,
    } = useCreatePost();

    const [showPreview, setShowPreview] = useState(false);
    const [showBlockPicker, setShowBlockPicker] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-slate-200">

            {/* HEADER */}
            <header className="sticky top-0 z-[100] w-full bg-white/90 dark:bg-[#0a0b0e]/90 backdrop-blur-md border-b border-emerald-500/15 dark:border-emerald-500/10 h-14 flex items-center">
                <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-mono text-[11px] uppercase tracking-[0.2em]"
                    >
                        {Icons.back}
                        <span>Volver</span>
                    </button>
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 font-bold">Nuevo Hilo</span>
                    <div className="w-24" />
                </div>
            </header>

            {/* MAIN */}
            <div className="flex-1 flex justify-center px-4 py-10">
                <div
                    className="w-full max-w-4xl flex flex-col gap-0 bg-white dark:bg-[#0a0b0e] border border-emerald-500/15 dark:border-emerald-500/10"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}
                >
                    {/* PASO 1 — CATEGORÍA */}
                    <section className="p-8 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                        <SectionLabel step="01" label="Selecciona la temática" />
                        <div className="flex flex-wrap gap-2.5 mt-5">
                            {(Object.entries(CATEGORY_CONFIG) as [ThreadCategory, typeof CATEGORY_CONFIG[ThreadCategory]][]).map(([key, config]) => {
                                const style = CATEGORY_STYLE[key];
                                const isSelected = selectedCategory === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCategory(key)}
                                        style={isSelected ? { clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' } : {}}
                                        className={`px-4 py-2 font-mono text-[11px] font-bold border uppercase tracking-[0.15em] transition-all ${
                                            isSelected
                                                ? `${style.border} ${style.text} bg-transparent`
                                                : 'border-emerald-500/15 dark:border-emerald-500/10 text-slate-400 dark:text-slate-500 hover:border-emerald-500/30 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                    >
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* PASO 2 — TÍTULO */}
                    <section className="px-8 py-7 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                        <SectionLabel step="02" label="Título del hilo" />
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Escribe un título claro y descriptivo..."
                            maxLength={150}
                            className="mt-4 w-full px-4 py-3 bg-slate-50 dark:bg-[#111214] border border-emerald-500/15 dark:border-emerald-500/10 text-slate-900 dark:text-white text-base font-bold font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-normal focus:outline-none focus:border-emerald-500/40 transition-colors"
                        />
                    </section>

                    {/* PASO 3 — CONTENIDO */}
                    <section className="px-8 py-7 flex-1">
                        <div className="flex items-center justify-between mb-5">
                            <SectionLabel step="03" label="Contenido" />
                            <button
                                type="button"
                                onClick={() => setShowPreview(p => !p)}
                                className="px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] border transition-colors text-slate-500 border-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400"
                            >
                                {showPreview ? 'Editar' : 'Vista previa'}
                            </button>
                        </div>

                        {showPreview ? (
                            <div className="border border-emerald-500/15 dark:border-emerald-500/10 px-6 py-6 min-h-[200px] space-y-4">
                                {editor.blocks.every(b => !b.value.trim() && !b.title?.trim()) ? (
                                    <p className="text-slate-400 italic font-mono text-[11px]">Sin contenido aún.</p>
                                ) : (
                                    editor.blocks.map((block, i) => <BlockPreview key={block.id || i} block={block} />)
                                )}
                            </div>
                        ) : (
                            <div className="border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden focus-within:border-emerald-500/30 transition-colors">
                                {editor.blocks.map(block => (
                                    <BlockRouter
                                        key={block.id}
                                        block={block}
                                        isOnly={editor.blocks.length === 1}
                                        onRemove={() => editor.removeBlock(block.id)}
                                        onUpdate={val => editor.updateBlock(block.id, val)}
                                        onUpdateTitle={t => editor.updateBlockTitle(block.id, t)}
                                        onUpdateLanguage={lang => editor.updateLanguage(block.id, lang)}
                                        onAddCodeBlock={() => editor.addCodeBlock(block.id)}
                                    />
                                ))}

                                {/* Añadir bloque */}
                                <div className="px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border-t border-emerald-500/10 dark:border-emerald-500/[0.07]">
                                    {showBlockPicker ? (
                                        <div className="flex flex-wrap gap-2">
                                            {(Object.entries(BLOCK_TYPE_CONFIG) as [EditorBlockType, typeof BLOCK_TYPE_CONFIG[EditorBlockType]][]).map(([type, cfg]) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => { editor.addBlock(type); setShowBlockPicker(false); }}
                                                    className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] border border-emerald-500/20 text-slate-500 dark:text-slate-400 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-[#0a0b0e]"
                                                >
                                                    <span className="w-3.5 h-3.5 shrink-0">{cfg.icon}</span>
                                                    {cfg.label}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setShowBlockPicker(false)}
                                                className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 hover:text-rose-500 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setShowBlockPicker(true)}
                                            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                        >
                                            <span className="w-4 h-4">{Icons.plus}</span>
                                            Añadir bloque
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* FOOTER */}
                    <div className="px-8 py-5 bg-slate-50 dark:bg-[#0d0e12] border-t border-emerald-500/10 dark:border-emerald-500/[0.07] flex items-center justify-between gap-4">
                        {error
                            ? <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-rose-500">{error}</p>
                            : <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">
                                {canPublish ? 'Listo para publicar' : 'Completa los campos requeridos'}
                            </p>
                        }
                        <button
                            disabled={!canPublish || isSubmitting}
                            onClick={handlePublish}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                            className="px-7 h-10 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[11px] uppercase tracking-[0.2em] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                            {isSubmitting ? 'Publicando...' : 'Publicar Hilo'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
