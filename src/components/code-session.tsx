import { useState } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import Builder from '../builder'

const CodeSession = () => {
  const [inputCode, setInputCode] = useState('')
  const [bundledCode, setBundledCode] = useState('')

  const onClick = async () => {
    const code = await Builder(inputCode)
    setBundledCode(code)
  }

  return (
    <div>
      <CodeEditor initialValue='// write your code here' onChange={(value) => setInputCode(value)} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={bundledCode} />
    </div>
  )
}

export default CodeSession
