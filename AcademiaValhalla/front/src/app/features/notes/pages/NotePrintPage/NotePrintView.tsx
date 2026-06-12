import { renderContent } from '../../utils/renderContent';
import { resolveAssetUrl } from '../../../../utils/getAvatarUrl';
import type { Concept } from '../../types/types';

interface Props {
    note: Concept;
    printDate: string;
}

export const NotePrintView = ({ note, printDate }: Props) => (
    <article className="a4-sheet">

        {/* Cabecera del documento */}
        <header className="print-doc-header">
            <div className="print-doc-brand">Academia Valhalla · Apunte</div>

            <h1 className="print-note-title">{note.title}</h1>

            <dl className="print-meta">
                <span className="print-meta-badge">{note.language}</span>
                <span className="print-meta-badge">{note.difficulty}</span>
                {note.tags.slice(0, 6).map(tag => (
                    <span key={tag} className="print-meta-badge">#{tag}</span>
                ))}
                <span style={{ marginLeft: 'auto', fontStyle: 'italic' }}>{printDate}</span>
            </dl>
        </header>

        {/* Cuerpo */}
        <main className="print-body">
            {note.content.map((item, i) => {
                if (item.type === 'text') {
                    return (
                        <section key={i} style={{ marginBottom: '8pt' }}>
                            {renderContent(item.value)}
                        </section>
                    );
                }

                if (item.type === 'definition') {
                    return (
                        <aside key={i} className="print-definition">
                            {item.title && (
                                <div className="print-definition-title">{item.title}</div>
                            )}
                            <div className="print-definition-body">
                                {renderContent(item.value)}
                            </div>
                        </aside>
                    );
                }

                if (item.type === 'code') {
                    return (
                        <div key={i} className="print-code">
                            {item.language && (
                                <span className="print-code-lang">{item.language}</span>
                            )}
                            {item.value}
                        </div>
                    );
                }

                if (item.type === 'image' && item.value) {
                    return (
                        <figure key={i} className="print-figure">
                            <img
                                src={resolveAssetUrl(item.value)}
                                alt={item.title || ''}
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const placeholder = document.createElement('div');
                                    placeholder.style.cssText = 'padding:8pt;background:#f1f5f9;border:0.5pt solid #e2e8f0;font-size:9pt;color:#94a3b8;text-align:center';
                                    placeholder.textContent = item.title ? `[Imagen: ${item.title}]` : '[Imagen no disponible]';
                                    target.parentNode?.appendChild(placeholder);
                                }}
                            />
                            {item.title && <figcaption>{item.title}</figcaption>}
                        </figure>
                    );
                }

                return null;
            })}
        </main>

        {/* Pie del documento */}
        <footer className="print-doc-footer">
            Generado desde Academia Valhalla — {printDate}
        </footer>
    </article>
);
