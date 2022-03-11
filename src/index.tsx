import 'bulmaswatch/slate/bulmaswatch.min.css'
import ReactDOM from 'react-dom'
import CodeSession from './components/code-session'
import TextEditor from './components/md-editor'

const App = () => {
  return (
    <div>
      {/* <CodeSession /> */}
      <TextEditor />
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
