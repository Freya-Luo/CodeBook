import 'bulmaswatch/slate/bulmaswatch.min.css'
import * as esbuild from 'esbuild-wasm'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path'
import { fetchFilePlugin } from './plugins/fetch-file'
import CodeEditor from './components/code-editor'
import Preview from './components/preview'

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')
  const serviceRef = useRef<any>()

  // initialize the ESBuild
  const execService = async () => {
    // make this service to be available outside the execService function
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    })
  }

  useEffect(() => {
    execService()
  }, []) // execute the service only 1 time

  const onClick = async () => {
    if (!serviceRef.current) return

    // get the builder (combined transpiler & bundler) from ESBuild
    const builder = serviceRef.current.build
    const res = await builder({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchFilePlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"', // to get the string 'production' not a var
        global: 'window',
      },
    })

    setCode(res.outputFiles[0].text)
  }

  return (
    <div>
      <CodeEditor initialValue='// write your code here' onChange={(value) => setInput(value)} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
