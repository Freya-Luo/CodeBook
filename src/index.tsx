import * as esbuild from 'esbuild-wasm';
import  ReactDOM  from "react-dom";
import { useState, useEffect } from "react";

const App = () => {
    const [input, setInput] = useState("");
    const [code, setCode] = useState("");

    // initialize the ESBuild
    const execService =async () => {
        const service = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        })

    }

    useEffect(()=>{
        execService();
    }, []); // execute the service only 1 time

    const onClick = () => {
        console.log(input)
    }

    return <div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
            <pre>{code}</pre>
        </div>
    </div>
}

ReactDOM.render(<App />, document.querySelector('#root'));