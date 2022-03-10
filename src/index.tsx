import 'bulmaswatch/slate/bulmaswatch.min.css'
import ReactDOM from 'react-dom'
import { useState } from 'react'
import CodeEditor from './components/code-editor'
import Preview from './components/preview'
import Builder from './builder'

const App = () => {
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

ReactDOM.render(<App />, document.querySelector('#root'))
