import './md-editor.css';
import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect, useRef } from 'react';

const TextEditor: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState('# header');
  const editorRef = useRef<HTMLDivElement | null>(null);

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
        <MDEditor value={text} onChange={(value) => setText(value || '')} />
      </div>
    );
  }
  // else if it is in the viewing mode
  return (
    // using bulma css styles -- card & card-content class
    <div className='md-editor-wrapper card' onClick={() => setEditMode(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={text} />
      </div>
    </div>
  );
};

export default TextEditor;
