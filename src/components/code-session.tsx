import { useState, useEffect } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import Builder from '../builder'
import ResizableWrapper from './resizable-wrapper'

const CodeSession = () => {
  const [inputCode, setInputCode] = useState('')
  const [bundledCode, setBundledCode] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    // avoid aggressive building process - debounce
    const timer = setTimeout(async () => {
      const res = await Builder(inputCode)
      setBundledCode(res.code)
      setErr(res.err)
    }, 1000)

    // function will be called auto next time useEffect() is called
    // cancel the previous setup timer
    return function cleanup() {
      clearTimeout(timer)
    }
  }, [inputCode])

  return (
    <ResizableWrapper direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <ResizableWrapper direction='horizontal'>
          <CodeEditor initialValue='// write your code here' onChange={(value) => setInputCode(value)} />
        </ResizableWrapper>
        <Preview code={bundledCode} bundleMsg={err} />
      </div>
    </ResizableWrapper>
  )
}

export default CodeSession
