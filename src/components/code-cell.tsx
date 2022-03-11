import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Builder from '../builder';
import ResizableWrapper from './resizable-wrapper';
import { Cell } from '../state';
import { useAction } from '../hooks/use-action';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [bundledCode, setBundledCode] = useState('');
  const [err, setErr] = useState('');
  const { updateCell } = useAction();

  useEffect(() => {
    // avoid aggressive building process - debounce
    const timer = setTimeout(async () => {
      const res = await Builder(cell.content);
      setBundledCode(res.code);
      setErr(res.err);
    }, 1000);

    // function will be called auto next time useEffect() is called
    // cancel the previous setup timer
    return function cleanup() {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <ResizableWrapper direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <ResizableWrapper direction='horizontal'>
          <CodeEditor initialValue={cell.content} onChange={(value) => updateCell(cell.id, value)} />
        </ResizableWrapper>
        <Preview code={bundledCode} bundleMsg={err} />
      </div>
    </ResizableWrapper>
  );
};

export default CodeCell;
