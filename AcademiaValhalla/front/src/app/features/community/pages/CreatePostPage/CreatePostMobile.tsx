import { type ReactNode, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { useCreatePost } from '../../hooks/useCreatePost';
import { uploadPostImage } from '../../services/uploadPostImage';
import { CATEGORY_CONFIG } from '../../config/categories';
import type { ThreadCategory } from '../../types/types';
import type { EditorBlock, EditorBlockType } from '../../hooks/useRichEditor';
import { renderContent } from '../../../notes/utils/renderContent';
import { useNoteFormatToolbar } from '../../../notes/hooks/useNoteFormatToolbar';
import type { FormatAction } from '../../../notes/hooks/useNoteFormatToolbar';
import { resolveAssetUrl } from '../../../../utils/getAvatarUrl';

const LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
    'go', 'rust', 'ruby', 'php', 'html', 'css', 'sql', 'bash',
];

const CATEGORY_STYLE: Record<ThreadCategory, { text: string; border: string }> = {
    doubt:      { text: 'text-rose-500',    border: 'border-rose-500' },
    discussion: { text: 'text-indigo-400',  border: 'border-indigo-400' },
    job:        { text: 'text-emerald-500', border: 'border-emerald-500' },
    promo:      { text: 'text-fuchsia-400', border: 'border-fuchsia-400' },
    teamup:     { text: 'text-cyan-400',    border: 'border-cyan-400' },
};

// Acciones de formato que mostramos en la toolbar sticky del foro
const FORMAT_ACTIONS: { action: FormatAction; icon: ReactNode; label: string }[] = [
    { action: 'bold',     icon: Icons.bold,    label: 'Negrita (Ctrl+B)' },
    { action: 'italic',   icon: Icons.italic,  label: 'Cursiva (Ctrl+I)' },
    { action: 'code',     icon: Icons.codeBlock, label: 'Código (Ctrl+`)' },
    { action: 'link',     icon: Icons.link,    label: 'Enlace (Ctrl+K)' },
    { action: 'warning',  icon: Icons.alertTriangle, label: 'Advertencia (Ctrl+⇧+W)' },
    { action: 'techTerm', icon: Icons.terminal, label: 'Término técnico (Ctrl+⇧+T)' },
];

// ─── Bloque de texto ─────────────────────────────────────────────────────────

interface MobileTextBlockEditorProps {
    block: EditorBlock;
    canRemove: boolean;
    onRemove: () => void;
    onUpdate: (val: string) => void;
    onFocus: (applyFormat: (action: FormatAction) => void) => void;
}

const MobileTextBlockEditor = ({ block, canRemove, onRemove, onUpdate, onFocus }: MobileTextBlockEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { applyFormat, handleKeyDown } = useNoteFormatToolbar({
        textareaRef,
        value: block.value,
        onChange: onUpdate,
    });

    return (
        <div className="border-b border-emerald-500/[0.06] last:border-b-0">
            <textarea
                ref={textareaRef}
                value={block.value}
                onChange={e => onUpdate(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => onFocus(applyFormat)}
                placeholder="Describe tu duda, proyecto o debate. Soporta **negrita**, *cursiva*, `código`..."
                className="w-full px-4 py-3 min-h-[160px] resize-none bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
            {canRemove && (
                <div className="flex justify-end px-3 pb-2">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="font-mono text-[10px] uppercase tracking-[0.1em] text-rose-400 hover:text-rose-300 transition-colors"
                    >
                        Eliminar bloque
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Bloque de definición ─────────────────────────────────────────────────────

interface MobileDefinitionBlockEditorProps {
    block: EditorBlock;
    canRemove: boolean;
    onRemove: () => void;
    onUpdate: (val: string) => void;
    onUpdateTitle: (t: string) => void;
    onFocus: (applyFormat: (action: FormatAction) => void) => void;
}

const MobileDefinitionBlockEditor = ({ block, canRemove, onRemove, onUpdate, onUpdateTitle, onFocus }: MobileDefinitionBlockEditorProps) => {
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const { applyFormat, handleKeyDown } = useNoteFormatToolbar({
        textareaRef: bodyRef,
        value: block.value,
        onChange: onUpdate,
    });

    return (
        <div className="mx-4 my-2 border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-[#111214] border-b border-emerald-500/[0.07]">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/60">Definición</span>
                {canRemove && (
                    <button type="button" onClick={onRemove} className="font-mono text-[10px] uppercase tracking-[0.1em] text-rose-400 hover:text-rose-300 transition-colors">
                        Eliminar
                    </button>
                )}
            </div>
            <div className="border-l-2 border-emerald-500/50 ml-3 my-2 mr-3">
                <input
                    type="text"
                    value={block.title || ''}
                    onChange={e => onUpdateTitle(e.target.value)}
                    placeholder="Concepto clave..."
                    className="w-full px-3 py-2 bg-transparent border-none outline-none font-mono text-[11px] uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400 placeholder:text-emerald-500/30 border-b border-emerald-500/10"
                />
                <textarea
                    ref={bodyRef}
                    value={block.value}
                    onChange={e => onUpdate(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => onFocus(applyFormat)}
                    placeholder="Definición. Soporta **negrita**, `código`..."
                    rows={3}
                    className="w-full px-3 py-2 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 resize-none font-mono leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
            </div>
        </div>
    );
};

// ─── Preview de un bloque ─────────────────────────────────────────────────────

const MobileBlockPreview = ({ block }: { block: EditorBlock }) => {
    if (block.type === 'code') {
        if (!block.value.trim()) return null;
        return (
            <pre className="bg-slate-100 dark:bg-[#0f1115] border border-emerald-500/10 px-3 py-3 font-mono text-xs text-slate-800 dark:text-emerald-300 overflow-x-auto whitespace-pre">
                {block.value}
            </pre>
        );
    }
    if (block.type === 'definition') {
        if (!block.value.trim() && !block.title?.trim()) return null;
        return (
            <div className="border-l-2 border-emerald-500/50 pl-3 py-2 bg-emerald-500/[0.03]">
                {block.title?.trim() && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mb-1">{block.title}</p>
                )}
                <div className="text-sm text-slate-700 dark:text-slate-300">{renderContent(block.value)}</div>
            </div>
        );
    }
    if (block.type === 'image') {
        if (!block.value.trim()) return null;
        return (
            <img src={resolveAssetUrl(block.value)} alt="" className="w-full max-h-56 object-cover border border-emerald-500/10" />
        );
    }
    if (!block.value.trim()) return null;
    return <div className="text-sm leading-relaxed">{renderContent(block.value)}</div>;
};

// ─── Página principal ─────────────────────────────────────────────────────────

const StepLabel = ({ num, label }: { num: string; label: string }) => (
    <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] font-bold text-emerald-500/50 tracking-[0.2em]">{num}</span>
        <span className="w-px h-3 bg-emerald-500/30 shrink-0" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300 font-bold">{label}</span>
    </div>
);

const ToolbarBtn = ({ icon, onClick, label }: { icon: ReactNode; onClick?: () => void; label?: string }) => (
    <button
        type="button"
        onClick={onClick}
        title={label}
        className="p-2.5 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/[0.06] transition-colors shrink-0"
    >
        {icon}
    </button>
);

type PickerState = 'closed' | 'open';

export const CreatePostMobile = () => {
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
    const [pickerState, setPickerState] = useState<PickerState>('closed');

    // Referencia a la función de formato del bloque actualmente enfocado
    const activeApplyFormatRef = useRef<((action: FormatAction) => void) | null>(null);

    const handleBlockFocus = (applyFormat: (action: FormatAction) => void) => {
        activeApplyFormatRef.current = applyFormat;
    };

    const applyToActive = (action: FormatAction) => {
        activeApplyFormatRef.current?.(action);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020202] text-slate-800 dark:text-slate-200">

            {/* HEADER */}
            <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0a0b0e]/95 backdrop-blur-md border-b border-emerald-500/10 dark:border-emerald-500/[0.07] h-14 flex items-center px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors font-mono text-[11px] uppercase tracking-[0.15em] min-w-[70px]"
                >
                    {Icons.back}
                    <span>Volver</span>
                </button>
                <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-900 dark:text-white font-bold">Nuevo Hilo</span>
                <button
                    onClick={handlePublish}
                    disabled={!canPublish || isSubmitting}
                    style={canPublish && !isSubmitting ? { clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' } : {}}
                    className={`ml-auto font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-all min-w-[70px] text-right ${
                        canPublish && !isSubmitting
                            ? 'bg-emerald-500 text-black px-3 py-1.5'
                            : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                >
                    {isSubmitting ? '...' : 'Publicar'}
                </button>
            </header>

            <main className="flex-1 flex flex-col pb-32">

                {/* CATEGORÍA */}
                <div className="px-4 pt-5 pb-4 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                    <StepLabel num="01" label="Temática" />
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mt-3">
                        {(Object.entries(CATEGORY_CONFIG) as [ThreadCategory, typeof CATEGORY_CONFIG[ThreadCategory]][]).map(([key, config]) => {
                            const style = CATEGORY_STYLE[key];
                            const isSelected = selectedCategory === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key)}
                                    className={`whitespace-nowrap px-3 py-1.5 font-mono text-[10px] font-bold border uppercase tracking-[0.15em] transition-all shrink-0 ${
                                        isSelected
                                            ? `${style.border} ${style.text}`
                                            : 'border-emerald-500/10 dark:border-emerald-500/[0.07] text-slate-400 dark:text-slate-500'
                                    }`}
                                >
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* TÍTULO */}
                <div className="px-4 pt-5 pb-4 border-b border-emerald-500/10 dark:border-emerald-500/[0.07]">
                    <StepLabel num="02" label="Título" />
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Título del hilo..."
                        maxLength={150}
                        className="mt-3 w-full px-3 py-3 bg-white dark:bg-[#111214] border border-emerald-500/15 dark:border-emerald-500/10 text-slate-900 dark:text-white font-mono font-bold text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-normal focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                </div>

                {/* CONTENIDO */}
                <div className="px-4 pt-5 pb-3">
                    <div className="flex items-center justify-between">
                        <StepLabel num="03" label="Contenido" />
                        <button
                            type="button"
                            onClick={() => setShowPreview(p => !p)}
                            className="shrink-0 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] border transition-colors text-slate-500 border-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400"
                        >
                            {showPreview ? 'Editar' : 'Preview'}
                        </button>
                    </div>
                </div>

                {showPreview ? (
                    <div className="mx-4 border border-emerald-500/15 dark:border-emerald-500/10 px-4 py-5 space-y-4 min-h-[180px]">
                        {editor.blocks.every(b => !b.value.trim() && !b.title?.trim()) ? (
                            <p className="text-slate-400 italic font-mono text-[11px]">Sin contenido aún.</p>
                        ) : (
                            editor.blocks.map((block, i) => <MobileBlockPreview key={block.id || i} block={block} />)
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        {editor.blocks.map(block => {
                            const canRemove = editor.blocks.length > 1 || block.type !== 'text';

                            if (block.type === 'text') {
                                return (
                                    <MobileTextBlockEditor
                                        key={block.id}
                                        block={block}
                                        canRemove={canRemove}
                                        onRemove={() => editor.removeBlock(block.id)}
                                        onUpdate={val => editor.updateBlock(block.id, val)}
                                        onFocus={handleBlockFocus}
                                    />
                                );
                            }
                            if (block.type === 'definition') {
                                return (
                                    <MobileDefinitionBlockEditor
                                        key={block.id}
                                        block={block}
                                        canRemove={canRemove}
                                        onRemove={() => editor.removeBlock(block.id)}
                                        onUpdate={val => editor.updateBlock(block.id, val)}
                                        onUpdateTitle={t => editor.updateBlockTitle(block.id, t)}
                                        onFocus={handleBlockFocus}
                                    />
                                );
                            }
                            if (block.type === 'code') {
                                return (
                                    <div key={block.id} className="mx-4 my-2 border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                                        <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-[#111214] border-b border-emerald-500/10">
                                            <select
                                                value={block.language || 'javascript'}
                                                onChange={e => editor.updateLanguage(block.id, e.target.value)}
                                                className="font-mono text-[10px] uppercase tracking-[0.1em] bg-white dark:bg-transparent border border-emerald-500/15 px-2 py-1 text-slate-600 dark:text-slate-300 outline-none"
                                            >
                                                {LANGUAGES.map(lang => <option key={lang} value={lang} className="bg-white dark:bg-[#1a1c21]">{lang}</option>)}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => editor.removeBlock(block.id)}
                                                className="font-mono text-[10px] uppercase tracking-[0.15em] text-rose-400 hover:text-rose-300 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                        <textarea
                                            value={block.value}
                                            onChange={e => editor.updateBlock(block.id, e.target.value)}
                                            className="w-full p-3 min-h-[120px] bg-slate-50 dark:bg-[#0d0e12] font-mono text-sm text-slate-700 dark:text-slate-200 resize-y outline-none"
                                            placeholder="Escribe tu código aquí..."
                                        />
                                    </div>
                                );
                            }
                            // image
                            return (
                                <div key={block.id} className="mx-4 my-2 border border-emerald-500/15 dark:border-emerald-500/10 overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-[#111214] border-b border-emerald-500/[0.07]">
                                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/60">Imagen</span>
                                        <button type="button" onClick={() => editor.removeBlock(block.id)} className="font-mono text-[10px] uppercase tracking-[0.1em] text-rose-400 hover:text-rose-300 transition-colors">Eliminar</button>
                                    </div>
                                    <div className="px-3 py-3">
                                        <label className="w-full aspect-video bg-slate-100 dark:bg-[#101010] border border-dashed border-slate-300 dark:border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden active:bg-emerald-500/[0.02] transition-colors cursor-pointer">
                                            {block.value ? (
                                                <img src={resolveAssetUrl(block.value)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-slate-500 flex flex-col items-center gap-2">
                                                    <div className="w-10 h-10 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-emerald-500/15 flex items-center justify-center">{Icons.image}</div>
                                                    <span className="text-xs font-bold font-mono uppercase tracking-[0.15em]">Subir imagen</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const previewUrl = URL.createObjectURL(file);
                                                    editor.updateBlock(block.id, previewUrl);
                                                    try {
                                                        const persistedUrl = await uploadPostImage(file);
                                                        URL.revokeObjectURL(previewUrl);
                                                        editor.updateBlock(block.id, persistedUrl);
                                                    } catch {
                                                        URL.revokeObjectURL(previewUrl);
                                                        editor.updateBlock(block.id, '');
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {error && (
                    <div className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-rose-500 border-t border-emerald-500/10">
                        {error}
                    </div>
                )}
            </main>

            {/* TOOLBAR STICKY — formato + añadir bloque */}
            {!showPreview && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#0d0e12] border-t border-emerald-500/10 dark:border-emerald-500/[0.07]" style={{ paddingBottom: 'var(--safe-pb)' }}>
                    {pickerState === 'open' ? (
                        <div className="px-4 py-3 grid grid-cols-2 gap-2">
                            {([
                                ['text', Icons.document, 'Texto'],
                                ['code', Icons.codeBlock, 'Código'],
                                ['definition', Icons.lightbulb, 'Definición'],
                                ['image', Icons.image, 'Imagen'],
                            ] as [EditorBlockType, ReactNode, string][]).map(([type, icon, label]) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => { editor.addBlock(type); setPickerState('closed'); }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 border border-emerald-500/15 dark:border-emerald-500/10 text-slate-600 dark:text-slate-300 font-mono text-[11px] uppercase tracking-[0.1em] hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-50 dark:bg-[#0a0b0e]"
                                >
                                    <span className="w-4 h-4 shrink-0">{icon}</span>
                                    {label}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setPickerState('closed')}
                                className="col-span-2 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 hover:text-rose-500 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <div className="p-2 flex items-center gap-0 overflow-x-auto scrollbar-hide">
                            {FORMAT_ACTIONS.map(({ action, icon, label }) => (
                                <ToolbarBtn
                                    key={action}
                                    icon={icon}
                                    label={label}
                                    onClick={() => applyToActive(action)}
                                />
                            ))}
                            <span className="w-px h-5 bg-emerald-500/15 mx-1 shrink-0" />
                            <button
                                type="button"
                                onClick={() => setPickerState('open')}
                                className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] border border-emerald-500/15 dark:border-emerald-500/10 text-slate-500 dark:text-slate-400 hover:border-emerald-500/30 hover:text-emerald-500 transition-colors shrink-0"
                            >
                                <span className="w-3.5 h-3.5">{Icons.plus}</span>
                                Bloque
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
