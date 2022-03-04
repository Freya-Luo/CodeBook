import * as esbuild from 'esbuild-wasm'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef } from 'react'

const App = () => {
    const [input, setInput] = useState('')
    const [code, setCode] = useState('')
    const ref = useRef<any>()

    // initialize the ESBuild
    const execService = async () => {
        // make this service to be available outside the execService function
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm',
        })
    }

    useEffect(() => {
        execService()
    }, []) // execute the service only 1 time

    const onClick = async () => {
        if (!ref.current) return
        // get the transpiler from ESBuild
        const transpiler = ref.current.transform
        const res = await transpiler(input, {
            loader: 'jsx',
            target: 'es2015',
        })
        setCode(res.code)
        console.log(res)
    }

    return (
        <div>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <div>
                <button onClick={onClick}>Submit</button>
                <pre>{code}</pre>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.querySelector('#root'))
