import 'bulmaswatch/slate/bulmaswatch.min.css'
import * as esbuild from 'esbuild-wasm'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'
import { unpkgPathPlugin } from './plugins/unpkg-path'
import { fetchFilePlugin } from './plugins/fetch-file'
import CodeEditor from './components/code-editor'

const App = () => {
  const [input, setInput] = useState('')
  const serviceRef = useRef<any>()
  const iframeRef = useRef<any>()

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

    // dump all previous execution variables and changes
    // and get a newly fresh iframe environment
    iframeRef.current.srcdoc = iframeHTML

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

    // parent window (React App) emit user input code to the iframe (pass down)
    // * for allowing for any domain (still relative secure as stated tradeoff in README)
    iframeRef.current.contentWindow.postMessage(res.outputFiles[0].text, '*')
  }

  // generate iframe content locally
  // listen for any input code from the parent window and execute it
  const iframeHTML = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (e) => {
            try {
              eval(e.data)
            } catch (err) {
              const root = document.querySelector('#root')
              root.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + err + '</div>'
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `

  return (
    <div>
      <CodeEditor initialValue='// write your code here' onChange={(value) => setInput(value)} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe title='preview' ref={iframeRef} sandbox='allow-scripts' srcDoc={iframeHTML} />
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
