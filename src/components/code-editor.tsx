import './code-editor.css';
import './syntax.css';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import { useRef } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import JSXHighlighter from 'monaco-jsx-highlighter';
import codeShift from 'jscodeshift';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const myEditorRef = useRef<any>();
  /**
   * This function monitors the user input changes. Whenever user changes the input,
   * the onChange() handler will be fired off.
   * It also does some code highlighting.
   *
   * @param getCurValue callback function to get the current value out of the editor
   * @param editorRef reference to the current editor
   */
  const onEditorDidMount: EditorDidMount = (getCurValue, editorRef) => {
    myEditorRef.current = editorRef;

    editorRef.onDidChangeModelContent(() => {
      onChange(getCurValue());
    });

    editorRef.getModel()?.updateOptions({
      tabSize: 2,
    });

    // highlighting the JSX code
    const highlighter = new JSXHighlighter(
      // @ts-ignore
      window.monaco, // monaco library
      codeShift,
      editorRef
    );
    // setup to avoid constantly throwing error msgs when user is typing
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    // get the current value in the editor
    const curValue = myEditorRef.current.getModel().getValue();
    // format the input code by prettier
    const formatted = prettier
      .format(curValue, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, ''); // remove auto new line indentation
    // set the formatted code back to the editor
    myEditorRef.current.setValue(formatted);
  };

  return (
    <div className='editor-wrapper'>
      <button className='button button-format is-primary is-small' onClick={onFormatClick}>
        Format
      </button>
      <MonacoEditor
        value={initialValue}
        editorDidMount={onEditorDidMount}
        language='javascript'
        theme='dark'
        height='100%'
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 13,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
