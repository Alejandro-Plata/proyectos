import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { KeyboardAccessoryBar } from '../../../../components/KeyboardAccessoryBar';
import { MonacoEditorMobile } from '../../../../components/MonacoEditor/MonacoEditorMobile';
import type { Block, BlockType } from '../../types/types';
import { useCreadorNota } from '../../hooks';
import { uploadNoteImage } from '../../services/uploadNoteImage';
import { resolveAssetUrl } from '../../../../utils/getAvatarUrl';
import { FullScreenEditor } from '../../components/FullScreenEditor';
import { useXPReward } from '../../../../hooks/useXPReward';
import XPRewardModal from '../../components/XPRewardModal';
import { useAchievements } from '../../../../context/AchievementContext';
import { useUser } from '../../../../context/UserContext';
import { useTheme } from '../../../../hooks/useTheme';
import { LANGUAGES } from '../../utils';

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode }[] = [
    { type: 'text',       label: 'Texto',      icon: Icons.document },
    { type: 'code',       label: 'Código',     icon: Icons.code },
    { type: 'definition', label: 'Definición', icon: Icons.lightbulb },
    { type: 'image',      label: 'Imagen',     icon: Icons.image },
];

const BLOCK_TYPE_COLORS: Record<BlockType, string> = {
    text:       'bg-blue-500/10 border-blue-500/20 text-blue-500',
    code:       'bg-amber-500/10 border-amber-500/20 text-amber-500',
    definition: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    image:      'bg-violet-500/10 border-violet-500/20 text-violet-500',
};

// ─── Inline editors per block type ──────────────────────────────────────────

interface InlineEditorProps {
    block: Block;
    onUpdate: (field: keyof Block, value: any) => void;
    isDark: boolean;
}

const InlineTextEditor = ({ block, onUpdate }: InlineEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    return (
        <textarea
            ref={textareaRef}
            value={block.value}
            onChange={e => onUpdate('value', e.target.value)}
            placeholder="Escribe aquí... Soporta **negrita**, *cursiva*, `código`"
            rows={5}
            className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none resize-none leading-relaxed"
        />
    );
};

const InlineCodeEditor = ({ block, onUpdate, isDark }: InlineEditorProps) => (
    <div className="space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {LANGUAGES.slice(0, 8).map(lang => (
                <button
                    key={lang.id}
                    type="button"
                    onClick={() => onUpdate('language', lang.id)}
                    className={`shrink-0 h-7 px-2.5 font-mono text-[10px] uppercase tracking-[0.1em] border transition-colors whitespace-nowrap ${
                        block.language === lang.id
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : 'border-slate-200 dark:border-emerald-500/10 text-slate-500 bg-white dark:bg-white/[0.03]'
                    }`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
        <div className="relative border border-slate-200 dark:border-emerald-500/10 overflow-hidden" style={{ minHeight: '200px' }}>
            <MonacoEditorMobile
                code={block.value}
                language={block.language || 'javascript'}
                onChange={val => onUpdate('value', val || '')}
                editable={true}
                theme={isDark}
            />
        </div>
        <KeyboardAccessoryBar onInsert={char => onUpdate('value', block.value + char)} />
    </div>
);

const InlineDefinitionEditor = ({ block, onUpdate }: InlineEditorProps) => (
    <div className="border-l-2 border-emerald-500/50 pl-3 space-y-2">
        <input
            type="text"
            value={block.title || ''}
            onChange={e => onUpdate('title', e.target.value)}
            placeholder="Concepto clave..."
            className="w-full bg-transparent font-mono text-[11px] uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400 placeholder:text-emerald-500/30 outline-none border-b border-emerald-500/10 pb-1"
        />
        <textarea
            value={block.value}
            onChange={e => onUpdate('value', e.target.value)}
            placeholder="Definición..."
            rows={3}
            className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none resize-none leading-relaxed"
        />
    </div>
);

const InlineImageEditor = ({ block, onUpdate }: InlineEditorProps) => (
    <label className="w-full aspect-video bg-slate-100 dark:bg-[#101010] border border-dashed border-slate-300 dark:border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden active:bg-emerald-500/[0.02] transition-colors cursor-pointer">
        {block.value ? (
            <img src={resolveAssetUrl(block.value)} alt="Imagen del bloque" className="w-full h-full object-cover" />
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
            onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const previewUrl = URL.createObjectURL(file);
                onUpdate('value', previewUrl);
                try {
                    const persistedUrl = await uploadNoteImage(file);
                    URL.revokeObjectURL(previewUrl);
                    onUpdate('value', persistedUrl);
                } catch {
                    URL.revokeObjectURL(previewUrl);
                    onUpdate('value', '');
                }
            }}
        />
    </label>
);

// ─── Bloque en línea ─────────────────────────────────────────────────────────

interface InlineBlockCardProps {
    block: Block;
    onUpdate: (field: keyof Block, value: any) => void;
    onDelete: () => void;
    onExpand: () => void;
    isDark: boolean;
}

const InlineBlockCard = ({ block, onUpdate, onDelete, onExpand, isDark }: InlineBlockCardProps) => {
    const typeLabel = block.type === 'definition' ? 'Nota' : block.type;
    const preview = block.type === 'image'
        ? (block.value ? 'Imagen adjunta' : 'Sin imagen')
        : (block.value || block.title || '');

    return (
        <details className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-emerald-500/10">
            <summary className="px-4 py-3 min-h-[56px] flex items-center gap-3 cursor-pointer list-none select-none">
                <div className={`w-7 h-7 shrink-0 flex items-center justify-center border ${BLOCK_TYPE_COLORS[block.type]}`}>
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                        {block.type === 'text' ? Icons.document :
                         block.type === 'code' ? Icons.code :
                         block.type === 'definition' ? Icons.lightbulb : Icons.image}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 block">{typeLabel}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 truncate block">
                        {preview.slice(0, 50) || <span className="italic opacity-40">vacío</span>}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={e => { e.preventDefault(); onExpand(); }}
                    className="w-9 h-9 shrink-0 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors"
                    aria-label="Expandir editor"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={e => { e.preventDefault(); onDelete(); }}
                    className="w-9 h-9 shrink-0 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                    aria-label="Eliminar bloque"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </summary>

            <div className="px-4 pb-4 border-t border-slate-100 dark:border-emerald-500/[0.06] pt-3">
                {block.type === 'text' && <InlineTextEditor block={block} onUpdate={onUpdate} isDark={isDark} />}
                {block.type === 'code' && <InlineCodeEditor block={block} onUpdate={onUpdate} isDark={isDark} />}
                {block.type === 'definition' && <InlineDefinitionEditor block={block} onUpdate={onUpdate} isDark={isDark} />}
                {block.type === 'image' && <InlineImageEditor block={block} onUpdate={onUpdate} isDark={isDark} />}
            </div>
        </details>
    );
};

// ─── Página principal ────────────────────────────────────────────────────────

export const CrearNotaMobile = () => {
    const navigate = useNavigate();
    const { isDarkMode: isDark } = useTheme();
    const { updateUser } = useUser();
    const { xpReward, showModal, triggerXPModal, closeModal } = useXPReward();
    const { encolarLogros } = useAchievements();

    const {
        title, setTitle,
        blocks,
        isSaving,
        shareToForum, setShareToForum,
        communityPending, setCommunityPending,
        addBlock,
        updateBlock,
        removeBlock,
        handleSave,
    } = useCreadorNota();

    const [showTypePicker, setShowTypePicker] = useState(false);
    const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [showSaveModal, setShowSaveModal] = useState(false);

    const handleSaveWithXP = () => {
        handleSave((reward, unlockedAchievements) => {
            triggerXPModal(reward);
            if (unlockedAchievements?.length > 0) encolarLogros(unlockedAchievements);
        });
        setShowSaveModal(false);
    };

    const handleCloseXPModal = () => {
        if (xpReward) {
            updateUser({ experience_points: xpReward.newTotalXP, current_level: xpReward.newLevel });
        }
        closeModal();
        navigate('/dashboard/notes', { state: { noteSaved: true } });
    };

    const handleAddBlock = (type: BlockType) => {
        addBlock(type);
        setShowTypePicker(false);
    };

    const handleSaveExpandedBlock = (block: Block, shouldClose: boolean) => {
        updateBlock(block.id, 'value', block.value);
        if (block.title !== undefined) updateBlock(block.id, 'title', block.title);
        if (block.language !== undefined) updateBlock(block.id, 'language', block.language);
        if (shouldClose) setExpandedBlockId(null);
    };

    const canSave = !isSaving && !!title.trim() && blocks.length > 0;

    const expandedBlock = blocks.find(b => b.id === expandedBlockId) ?? null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-200 animate-in slide-in-from-bottom duration-200">

            {/* Header */}
            <div className="shrink-0 flex items-center gap-2 px-2 h-14 bg-white dark:bg-[#0a0b0e] border-b border-slate-200 dark:border-emerald-500/15">
                <button
                    onClick={() => navigate(-1)}
                    className="w-11 h-11 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-95"
                    aria-label="Volver"
                >
                    <div className="w-5 h-5">{Icons.back}</div>
                </button>
                <span className="flex-1 text-sm font-bold text-slate-900 dark:text-white truncate">Nueva nota</span>
                <div className="shrink-0">
                    <button
                        onClick={() => setShowSaveModal(true)}
                        disabled={!canSave}
                        className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                        Guardar
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="shrink-0 bg-white dark:bg-[#0a0b0e] border-b border-slate-200 dark:border-emerald-500/10 flex">
                {(['write', 'preview'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative flex-1 h-11 font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${
                            activeTab === tab ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                        }`}
                    >
                        {activeTab === tab && <span className="absolute top-0 left-0 right-0 h-px bg-emerald-500" />}
                        {tab === 'write' ? 'Escritura' : 'Previsualizar'}
                    </button>
                ))}
            </div>

            {/* Contenido */}
            <main className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-28">

                {activeTab === 'write' && (
                    <div className="space-y-4 animate-in fade-in">
                        <input
                            type="text"
                            placeholder="Título de la nota..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-transparent text-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 border-none outline-none p-0 focus:ring-0"
                        />

                        {blocks.length === 0 && (
                            <div
                                onClick={() => setShowTypePicker(true)}
                                className="border border-dashed border-slate-200 dark:border-emerald-500/15 p-10 flex flex-col items-center justify-center text-slate-500 gap-3 active:bg-emerald-500/[0.02] transition-colors cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-emerald-500/15 flex items-center justify-center">{Icons.plus}</div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Añadir contenido</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            {blocks.map(block => (
                                <InlineBlockCard
                                    key={block.id}
                                    block={block}
                                    onUpdate={(field, val) => updateBlock(block.id, field, val)}
                                    onDelete={() => removeBlock(block.id)}
                                    onExpand={() => setExpandedBlockId(block.id)}
                                    isDark={isDark}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'preview' && (
                    <div className="space-y-6 animate-in fade-in">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                            {title || <span className="opacity-30">Sin Título</span>}
                        </h1>
                        {blocks.map(b => (
                            <div key={b.id} className="space-y-2">
                                {b.type === 'text' && (
                                    <p className="leading-relaxed text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{b.value}</p>
                                )}
                                {b.type === 'code' && (
                                    <div className="bg-slate-100 dark:bg-[#101010] p-4 border border-slate-200 dark:border-white/5 font-mono text-xs overflow-x-auto text-slate-800 dark:text-emerald-400">
                                        <pre>{b.value}</pre>
                                    </div>
                                )}
                                {b.type === 'definition' && (
                                    <div className="border-l-2 border-emerald-500 pl-4 py-2 bg-emerald-500/5">
                                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{b.title || 'NOTA'}</h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{b.value}</p>
                                    </div>
                                )}
                                {b.type === 'image' && b.value && !b.value.startsWith('blob:') && (
                                    <img src={resolveAssetUrl(b.value)} alt="" className="w-full" />
                                )}
                            </div>
                        ))}
                        {blocks.length === 0 && (
                            <p className="text-slate-500 text-sm italic">Sin contenido. Cambia a Escritura para añadir bloques.</p>
                        )}
                    </div>
                )}
            </main>

            {/* FAB — añadir bloque */}
            {activeTab === 'write' && (
                <button
                    onClick={() => setShowTypePicker(true)}
                    className="fixed right-5 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-colors"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', bottom: 'var(--fab-bottom)' }}
                    aria-label="Añadir bloque"
                >
                    <div className="w-6 h-6">{Icons.plus}</div>
                </button>
            )}

            {/* Selector de tipo de bloque */}
            {showTypePicker && (
                <div className="fixed inset-0 z-[150] flex items-end" onClick={() => setShowTypePicker(false)}>
                    <div
                        className="w-full bg-white dark:bg-[#0a0b0e] border-t border-emerald-500/15 dark:border-emerald-500/10 p-4 animate-in slide-in-from-bottom duration-200"
                        onClick={e => e.stopPropagation()}
                        style={{ paddingBottom: 'calc(var(--safe-pb) + 1rem)' }}
                    >
                        <div className="flex justify-center mb-3">
                            <div className="w-10 h-1 bg-emerald-500/20" />
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3 px-1">
                            Tipo de bloque
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {BLOCK_TYPES.map(({ type, label, icon }) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleAddBlock(type)}
                                    className="flex items-center gap-3 px-4 py-3 border border-emerald-500/15 dark:border-emerald-500/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-50 dark:bg-white/[0.02] min-h-[56px]"
                                >
                                    <span className="w-5 h-5 shrink-0">{icon}</span>
                                    <span className="font-mono text-[11px] uppercase tracking-[0.1em]">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* FullScreenEditor — modo concentración (expandir) */}
            {expandedBlockId && expandedBlock && (
                <FullScreenEditor
                    block={expandedBlock}
                    onSave={handleSaveExpandedBlock}
                    onClose={() => setExpandedBlockId(null)}
                />
            )}

            {/* Modal Guardar */}
            {showSaveModal && (
                <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50">
                    <div className="bg-white dark:bg-[#0a0b0e] border-t border-slate-200 dark:border-emerald-500/15 shadow-2xl w-full p-5 flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-1 h-4 bg-emerald-500 shrink-0" />
                            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white">Guardar nota</h3>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShareToForum(v => !v)}
                            aria-pressed={shareToForum}
                            className={`flex items-center justify-between w-full py-3 px-4 border transition-colors ${
                                shareToForum
                                    ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                                    : 'border-slate-200 dark:border-emerald-500/10 bg-slate-50 dark:bg-white/[0.02]'
                            }`}
                        >
                            <div className="flex flex-col items-start gap-0.5 text-left">
                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-slate-900 dark:text-white">Compartir en comunidad</span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-500">Tu nota irá a revisión antes de publicarse</span>
                            </div>
                            <div className={`w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors ${
                                shareToForum ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-emerald-500/20 bg-transparent'
                            }`}>
                                {shareToForum && (
                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 h-12 border border-slate-200 dark:border-emerald-500/15 text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase tracking-[0.15em] font-bold transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveWithXP}
                                disabled={isSaving}
                                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                                className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] uppercase tracking-[0.15em] font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar nota'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {xpReward && (
                <XPRewardModal reward={xpReward} visible={showModal} onClose={handleCloseXPModal} />
            )}

            {communityPending && (
                <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50">
                    <div className="bg-white dark:bg-[#0a0b0e] border-t border-slate-200 dark:border-emerald-500/15 shadow-2xl w-full p-6 flex flex-col items-center gap-5 text-center animate-in slide-in-from-bottom duration-200">
                        <div className="w-14 h-14 bg-emerald-500/10 flex items-center justify-center text-emerald-500"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}>
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-mono text-[13px] uppercase tracking-[0.12em] font-bold text-slate-900 dark:text-white mb-2">
                                Nota enviada a revisión
                            </h3>
                            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 leading-relaxed">
                                Tu nota está <span className="font-bold text-emerald-600 dark:text-emerald-400">pendiente de revisión</span> por un administrador.
                            </p>
                        </div>
                        <button
                            onClick={() => { setCommunityPending(false); navigate('/dashboard/notes', { state: { noteSaved: true } }); }}
                            style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
