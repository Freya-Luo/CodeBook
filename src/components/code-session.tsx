import { useState } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import Builder from '../builder'
import ResizableWrapper from './resizable-wrapper'

const CodeSession = () => {
  const [inputCode, setInputCode] = useState('')
  const [bundledCode, setBundledCode] = useState('')

  const onClick = async () => {
    const code = await Builder(inputCode)
    setBundledCode(code)
  }

  return (
    <ResizableWrapper direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <CodeEditor initialValue='// write your code here' onChange={(value) => setInputCode(value)} />
        <Preview code={bundledCode} />
      </div>
    </ResizableWrapper>
  )
}

export default CodeSession
