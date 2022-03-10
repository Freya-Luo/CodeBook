import 'bulmaswatch/slate/bulmaswatch.min.css'
import ReactDOM from 'react-dom'
import CodeSession from './components/code-session'

const App = () => {
  return (
    <div>
      <CodeSession />
      <CodeSession />
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
