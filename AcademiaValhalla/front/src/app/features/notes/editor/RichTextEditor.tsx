import { EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';

interface Props {
    editor: Editor | null;
}

// Thin wrapper: NoteTextBlock (y cualquier otro consumidor) son dueños del useEditor
// y pasan el editor resuelto aquí para renderizarlo.
export const RichTextEditor = ({ editor }: Props) => (
    <EditorContent editor={editor} />
);
