import './code-cell.css';
import { useEffect } from 'react';
import CodeEditor from './code-editor/code-editor';
import Preview from './preview/preview';
import { useTypedSelector } from '../../hooks/use-typed-selector';
import ResizableWrapper from '../resizable-wrapper/resizable-wrapper';
import { Cell } from '../../state';
import { useAction } from '../../hooks/use-action';
import { useAggregatedCode } from '../../hooks/use-aggregated-code';

interface CodeCellProps {
  cell: Cell;
}

/**
 * @note "builderState" will be "undefined" at the very first beginning of the rendering process
 * as no BUILD actions are dispatched (no data in the BuilderReducer action).
 * This is because I can only manually dispatch two insertCellAfter actions initially.
 */
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBuilder } = useAction();
  const builderState = useTypedSelector((state) => state.builders[cell.id]);
  const sumCode = useAggregatedCode(cell.id);

  useEffect(() => {
    if (!builderState) {
      // create the builder instantly to render the Preview component
      createBuilder(cell.id, sumCode);
      return;
    }
    // avoid aggressive building process - debounce
    const timer = setTimeout(async () => {
      createBuilder(cell.id, sumCode);
    }, 800);

    // function will be called auto next time useEffect() is called
    // cancel the previous setup timer
    return function cleanup() {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [sumCode, cell.content, createBuilder]);

  return (
    <ResizableWrapper direction='vertical'>
      <div className='code-cell-inner-wrapper'>
        <ResizableWrapper direction='horizontal'>
          <CodeEditor initialValue={cell.content} onChange={(value) => updateCell(cell.id, value)} />
        </ResizableWrapper>
        <div className='preview-wrapper-background'>
          {!builderState || builderState.loading ? (
            <div className='progress-wrapper'>
              <progress className='progress is-small is-info' max='100'>
                Loading ...
              </progress>
            </div>
          ) : (
            <Preview id={cell.id} code={builderState.code} bundleMsg={builderState.err} />
          )}
        </div>
      </div>
    </ResizableWrapper>
  );
};

export default CodeCell;
