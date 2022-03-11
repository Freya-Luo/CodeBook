import { useState, useEffect } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import Builder from '../builder'
import ResizableWrapper from './resizable-wrapper'

// avoid aggressive building process - debounce
let timer: any
const CodeSession = () => {
  const [inputCode, setInputCode] = useState('')
  const [bundledCode, setBundledCode] = useState('')

  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(async () => {
      const code = await Builder(inputCode)
      setBundledCode(code)
    }, 1500)
  }, [inputCode])

  return (
    <ResizableWrapper direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <ResizableWrapper direction='horizontal'>
          <CodeEditor initialValue='// write your code here' onChange={(value) => setInputCode(value)} />
        </ResizableWrapper>
        <Preview code={bundledCode} />
      </div>
    </ResizableWrapper>
  )
}

export default CodeSession
