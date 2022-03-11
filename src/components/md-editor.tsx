import './md-editor.css';
import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect, useRef } from 'react';
import { Cell } from '../state';
import { useAction } from '../hooks/use-action';
interface TextEditorpProps {
  cell: Cell;
}
const TextEditor: React.FC<TextEditorpProps> = ({ cell }) => {
  // keep the editing mode to be the local state
  const [editMode, setEditMode] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { updateCell } = useAction();

  useEffect(() => {
    const clickListener = (e: MouseEvent) => {
      if (editorRef.current && e.target && editorRef.current.contains(e.target as Node)) {
        return;
      }
      setEditMode(false);
    };
    document.addEventListener('click', clickListener, { capture: true });

    return () => {
      document.removeEventListener('click', clickListener, { capture: true });
    };
  }, []);

  // if the editor is in the editing mode
  if (editMode) {
    return (
      <div ref={editorRef} className='md-editor-wrapper'>
        <MDEditor value={cell.content} onChange={(value) => updateCell(cell.id, value || '')} />
      </div>
    );
  }
  // else if it is in the viewing mode
  return (
    // using bulma css styles -- card & card-content class
    <div className='md-editor-wrapper card' onClick={() => setEditMode(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || '### Click here to edit!'} />
      </div>
    </div>
  );
};

export default TextEditor;
