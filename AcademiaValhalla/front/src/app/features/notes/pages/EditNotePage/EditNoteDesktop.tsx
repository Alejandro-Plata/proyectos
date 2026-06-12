import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../../../components/Icons';
import { MonacoEditorDesktop } from '../../../../components/MonacoEditor/MonacoEditorDesktop';
import { CodeBlockDesktop } from '../../../../components/CodeBlock/CodeBlockDesktop';
import { BlockModal } from '../../components/BlockModal';
import type { BlockType } from '../../types/types';
import { LANGUAGES, DIFFICULTIES, getFileExtension, renderContent } from '../../utils';
import { TagInput } from '../../components/TagInput';
import { NoteTextBlock } from '../../components/NoteTextBlock';
import { useEditorNota } from '../../hooks/useEditorNota';
import { uploadNoteImage } from '../../services/uploadNoteImage';
import { resolveAssetUrl } from '../../../../utils/getAvatarUrl';

interface Props { noteId: string; }

export const EditNoteDesktop = ({ noteId }: Props) => {
    const navigate = useNavigate();

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

    const {
        loading,
        title, setTitle,
        selectedTags, setSelectedTags,
        selectedLanguage, setSelectedLanguage,
        selectedDifficulty, setSelectedDifficulty,
        blocks,
        isSaving,
        revisionPending, setRevisionPending,
        communityStatus,
        addBlock: addBlockHook,
        updateBlock,
        removeBlock,
        handleSave,
    } = useEditorNota(noteId);

    const handleAddBlock = (type: BlockType) => {
        addBlockHook(type);
        setIsBlockModalOpen(false);
    };

    const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        updateBlock(id, 'value', previewUrl);
        try {
            const persistedUrl = await uploadNoteImage(file);
            URL.revokeObjectURL(previewUrl);
            updateBlock(id, 'value', persistedUrl);
        } catch {
            URL.revokeObjectURL(previewUrl);
            updateBlock(id, 'value', '');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020202] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isApproved = communityStatus === 'approved';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-slate-200 pb-32">

            <BlockModal
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                onSelect={handleAddBlock}
            />

            {/* HEADER */}
            <header className="sticky top-0 z-40 h-16 flex items-center px-6 border-b backdrop-blur-md bg-white/80 dark:bg-[#0a0b0e]/80 border-slate-200 dark:border-white/5">
                <button
                    onClick={() => navigate(-1)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                    {Icons.back}
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 flex p-1 rounded-lg border bg-slate-100 dark:bg-[#111214] border-slate-200 dark:border-white/5">
                    <button
                        onClick={() => setActiveTab('write')}
                        className={`px-5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                            activeTab === 'write'
                                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Escritura
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                            activeTab === 'preview'
                                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Previsualización
                    </button>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    {isApproved && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                            Los cambios pasarán por moderación
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !title.trim() || blocks.length === 0}
                        className="px-5 py-2 rounded-lg text-xs font-bold transition-colors bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* === MODO ESCRITURA === */}
                {activeTab === 'write' && (
                    <div className="space-y-8">

                        <input
                            type="text"
                            placeholder="Título..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-4xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none outline-none"
                        />

                        {/* Configuración colapsable */}
                        <div className="rounded-sm bg-white dark:bg-[#0a0b0e] border border-slate-200 dark:border-white/5 overflow-hidden transition-all">
                            <div
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className="flex items-center justify-between p-4 cursor-pointer select-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-sm transition-colors ${isFiltersOpen ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-400'}`}>
                                        {Icons.filter}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Configuración</span>
                                        {!isFiltersOpen && (
                                            <span className="text-[10px] text-slate-400 mt-0.5">
                                                {selectedLanguage} · {selectedDifficulty} · {selectedTags.length > 0 ? `${selectedTags.length} etiqueta${selectedTags.length > 1 ? 's' : ''}` : 'Sin etiquetas'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`transform transition-transform duration-200 text-slate-400 ${isFiltersOpen ? 'rotate-180' : ''}`}>
                                    {Icons.chevronDown}
                                </span>
                            </div>

                            <div className={`grid transition-[grid-template-rows] duration-300 ${isFiltersOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                    <div className="p-4 pt-0 border-t border-slate-100 dark:border-white/5 space-y-5 mt-0">
                                        <div className="flex items-start gap-10 mt-5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lenguaje</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {LANGUAGES.map(lang => (
                                                        <button
                                                            key={lang.id}
                                                            onClick={() => setSelectedLanguage(lang.id)}
                                                            className={`px-3 py-1.5 rounded-sm text-xs font-bold border transition-colors ${
                                                                selectedLanguage === lang.id
                                                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                                                    : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500 hover:border-emerald-500/50'
                                                            }`}
                                                        >
                                                            {lang.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nivel</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {DIFFICULTIES.map(diff => (
                                                        <button
                                                            key={diff}
                                                            onClick={() => setSelectedDifficulty(diff)}
                                                            className={`px-3 py-1.5 rounded-sm text-xs font-bold border transition-colors ${
                                                                selectedDifficulty === diff
                                                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                                                    : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500 hover:border-indigo-500/50'
                                                            }`}
                                                        >
                                                            {diff}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 border-t border-slate-100 dark:border-white/5 pt-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Etiquetas</label>
                                            <TagInput tags={selectedTags} onChange={setSelectedTags} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-white/5" />

                        {/* Bloques */}
                        <div className="space-y-5">
                            {blocks.map((block) => (
                                <div key={block.id} className="group relative">
                                    <button
                                        onClick={() => removeBlock(block.id)}
                                        className="absolute -top-2 -left-2 z-20 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/40 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                                        title="Eliminar bloque"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    {block.type === 'text' && (
                                        <NoteTextBlock
                                            value={block.value}
                                            onChange={(val) => updateBlock(block.id, 'value', val)}
                                        />
                                    )}

                                    {block.type === 'definition' && (
                                        <div className="border-l-2 border-emerald-500 pl-4 py-3 rounded-sm bg-emerald-50/50 dark:bg-emerald-500/5">
                                            <input
                                                type="text"
                                                value={block.title || ''}
                                                onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                                                placeholder="Concepto clave"
                                                className="w-full bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest mb-2 text-emerald-700 dark:text-emerald-400 placeholder:text-emerald-700/40 dark:placeholder:text-emerald-400/40"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <textarea
                                                value={block.value}
                                                onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                                                placeholder="Definición..."
                                                className="w-full bg-transparent border-none outline-none resize-y min-h-[80px] text-sm leading-relaxed text-slate-700 dark:text-slate-300 p-0"
                                            />
                                        </div>
                                    )}

                                    {block.type === 'code' && (
                                        <div className="rounded-sm overflow-hidden border border-slate-200 dark:border-white/10 bg-[#1e1e1e]">
                                            <div className="flex justify-between items-center px-3 py-2 bg-[#252526] border-b border-white/5">
                                                <select
                                                    value={block.language || 'javascript'}
                                                    onChange={(e) => updateBlock(block.id, 'language', e.target.value)}
                                                    className="bg-transparent text-[10px] font-mono text-slate-400 uppercase outline-none cursor-pointer hover:text-emerald-400 transition-colors appearance-none"
                                                >
                                                    {LANGUAGES.map(lang => (
                                                        <option key={lang.id} value={lang.id} className="bg-[#252526] text-white">
                                                            {lang.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="h-56 relative">
                                                <MonacoEditorDesktop
                                                    code={block.value}
                                                    language={block.language?.toLowerCase() || 'javascript'}
                                                    onChange={(val: string | undefined) => updateBlock(block.id, 'value', val)}
                                                    editable={true}
                                                    theme={true}
                                                    filePath={`block-${block.id}.${getFileExtension('javascript')}`}
                                                    options={{
                                                        minimap: { enabled: false },
                                                        lineNumbers: 'on',
                                                        fontSize: 13,
                                                        padding: { top: 16 },
                                                        quickSuggestions: { other: true, comments: true, strings: true },
                                                        suggestOnTriggerCharacters: true,
                                                        parameterHints: { enabled: true },
                                                        wordBasedSuggestions: "matchingDocuments",
                                                        scrollBeyondLastLine: false,
                                                        fixedOverflowWidgets: true
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {block.type === 'image' && (
                                        <div className="rounded-sm border border-dashed p-4 text-center transition-colors relative overflow-hidden group/image border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f1115] hover:border-slate-300 dark:hover:border-white/20">
                                            {block.value ? (
                                                <div className="relative">
                                                    <img src={resolveAssetUrl(block.value)} alt="Preview" className="w-full max-h-64 object-cover rounded-sm" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity rounded-sm">
                                                        <p className="text-white text-xs font-bold uppercase tracking-wider">Cambiar</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-400 py-6">
                                                    <div className="p-2 rounded-lg bg-white dark:bg-white/5">{Icons.image}</div>
                                                    <p className="text-xs font-bold uppercase tracking-wide">Click para subir</p>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(block.id, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={() => setIsBlockModalOpen(true)}
                                className="w-full py-3 rounded-sm border border-dashed text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/20"
                            >
                                {Icons.plus} Añadir Bloque
                            </button>
                        </div>
                    </div>
                )}

                {/* === MODO PREVISUALIZACIÓN === */}
                {activeTab === 'preview' && (
                    <div className="space-y-10">
                        <div className="pb-8 border-b border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10">
                                    {selectedLanguage}
                                </span>
                                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20">
                                    {selectedDifficulty}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                                {title || <span className="opacity-20">Sin Título</span>}
                            </h1>
                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {selectedTags.map(tag => (
                                        <span key={tag} className="text-xs font-mono text-slate-400">#{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            {blocks.length === 0 && (
                                <p className="text-slate-400 text-sm italic">Sin contenido aún.</p>
                            )}
                            {blocks.map(block => (
                                <div key={block.id}>
                                    {block.type === 'text' && (
                                        <div className="prose prose-slate dark:prose-invert max-w-none">
                                            <div className="text-slate-700 dark:text-slate-300 leading-loose text-sm">
                                                {block.value ? renderContent(block.value) : <span className="opacity-20 italic">...</span>}
                                            </div>
                                        </div>
                                    )}
                                    {block.type === 'definition' && (
                                        <div className="border-l-2 border-emerald-500 pl-4 py-2 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-sm">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-2">
                                                {block.title || 'Concepto Clave'}
                                            </h4>
                                            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {block.value ? renderContent(block.value) : <span className="opacity-20">Define el concepto...</span>}
                                            </div>
                                        </div>
                                    )}
                                    {block.type === 'code' && block.value && (
                                        <CodeBlockDesktop code={block.value} language={block.language || 'javascript'} />
                                    )}
                                    {block.type === 'image' && block.value && !block.value.startsWith('blob:') && (
                                        <div className="rounded-sm overflow-hidden border border-slate-200 dark:border-white/5">
                                            <img src={resolveAssetUrl(block.value)} alt="Contenido" className="w-full h-auto object-cover" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal: cambios enviados a revisión */}
            {revisionPending && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-[#0a0b0e] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center gap-5 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Cambios enviados a revisión
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Esta nota está publicada en la comunidad. Tus cambios están <span className="font-semibold text-amber-600 dark:text-amber-400">pendientes de aprobación</span> por un moderador antes de aplicarse.
                            </p>
                        </div>
                        <button
                            onClick={() => { setRevisionPending(false); navigate('/dashboard/notes', { state: { noteSaved: true } }); }}
                            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
