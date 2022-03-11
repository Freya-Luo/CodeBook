import 'bulmaswatch/slate/bulmaswatch.min.css'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './state'
import CodeCell from './components/code-cell'
import TextEditor from './components/md-editor'

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <TextEditor />
      </div>
    </Provider>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
