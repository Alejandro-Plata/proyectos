import { Mark, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

// ── Warning mark  !!texto!!  ─────────────────────────────────────────────────
export const Warning = Mark.create({
    name: 'warning',
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, {
            'data-mark': 'warning',
            class: 'font-medium text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 border-b-2 border-amber-100 dark:border-amber-800/30 px-1 rounded-t',
        }), 0];
    },
    parseHTML() {
        return [{ tag: 'span[data-mark="warning"]' }];
    },
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-w': () => this.editor.commands.toggleMark(this.name),
        };
    },
});

// ── TechTerm mark  *'texto'*  ────────────────────────────────────────────────
export const TechTerm = Mark.create({
    name: 'techTerm',
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, {
            'data-mark': 'techTerm',
            class: 'font-mono text-[0.9em] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20 px-1 rounded mx-0.5',
        }), 0];
    },
    parseHTML() {
        return [{ tag: 'span[data-mark="techTerm"]' }];
    },
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-t': () => this.editor.commands.toggleMark(this.name),
        };
    },
});

// ── Literal mark  'texto'  ───────────────────────────────────────────────────
export const Literal = Mark.create({
    name: 'literal',
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, {
            'data-mark': 'literal',
            class: 'text-teal-700 dark:text-teal-300 font-medium tracking-tight',
        }), 0];
    },
    parseHTML() {
        return [{ tag: 'span[data-mark="literal"]' }];
    },
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-l': () => this.editor.commands.toggleMark(this.name),
        };
    },
});

// ── Factory ──────────────────────────────────────────────────────────────────
export const getExtensions = (placeholder?: string) => [
    StarterKit.configure({
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: false,
        strike: false,
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
    }),
    Warning,
    TechTerm,
    Literal,
    Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
            class: 'font-medium text-emerald-700 dark:text-emerald-400 underline underline-offset-4 decoration-emerald-300/40',
            target: '_blank',
            rel: 'noopener noreferrer',
        },
    }),
    Placeholder.configure({
        placeholder: placeholder ?? 'Escribe aquí…',
    }),
];
