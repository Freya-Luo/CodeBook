import './code-cell.css';
import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Builder from '../builder';
import { useTypedSelector } from '../hooks/use-typed-selector';
import ResizableWrapper from './resizable-wrapper';
import { Cell } from '../state';
import { useAction } from '../hooks/use-action';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBuilder } = useAction();
  const builderState = useTypedSelector((state) => state.builders[cell.id]);

  useEffect(() => {
    // avoid aggressive building process - debounce
    const timer = setTimeout(async () => {
      const res = await Builder(cell.content);
      createBuilder(cell.id, cell.content);
    }, 1000);

    // function will be called auto next time useEffect() is called
    // cancel the previous setup timer
    return function cleanup() {
      clearTimeout(timer);
    };
  }, [cell.id, cell.content]);

  return (
    <ResizableWrapper direction='vertical'>
      <div className='code-cell-inner-wrapper'>
        <ResizableWrapper direction='horizontal'>
          <CodeEditor initialValue={cell.content} onChange={(value) => updateCell(cell.id, value)} />
        </ResizableWrapper>
        {/* <Preview code={bundledCode} bundleMsg={err} /> */}
      </div>
    </ResizableWrapper>
  );
};

export default CodeCell;
