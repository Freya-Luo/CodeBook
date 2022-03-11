import './md-editor.css'
import MDEditor from '@uiw/react-md-editor'
import { useState, useEffect, useRef } from 'react'

const TextEditor: React.FC = () => {
  const [editMode, setEditMode] = useState(false)
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const clickListener = (e: MouseEvent) => {
      if (editorRef.current && e.target && editorRef.current.contains(e.target as Node)) {
        return
      }
      setEditMode(false)
    }
    document.addEventListener('click', clickListener, { capture: true })

    return () => {
      document.removeEventListener('click', clickListener, { capture: true })
    }
  }, [])

  if (editMode) {
    return (
      <div ref={editorRef}>
        <MDEditor />
      </div>
    )
  }

  return (
    <div onClick={() => setEditMode(true)}>
      <MDEditor.Markdown source='# jjjj' />
    </div>
  )
}

export default TextEditor
