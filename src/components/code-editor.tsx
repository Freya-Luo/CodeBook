import MonacoEditor, { EditorDidMount } from '@monaco-editor/react'

interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  // <callback, reference>
  // callback: get the current value out of the editor
  // reference: reference to the current editor
  const onEditorDidMount: EditorDidMount = (getCurValue, editorRef) => {
    // when user changes the input, the callback is called
    editorRef.onDidChangeModelContent(() => {
      onChange(getCurValue())
    })

    editorRef.getModel()?.updateOptions({
      tabSize: 2,
    })
  }
  return (
    <MonacoEditor
      value={initialValue}
      editorDidMount={onEditorDidMount}
      language='javascript'
      theme='dark'
      height='500px'
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 13,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  )
}

export default CodeEditor
