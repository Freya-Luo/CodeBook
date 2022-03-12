import './add-cell-bar.css';
import { useAction } from '../hooks/use-action';

interface AddCellBarProps {
  id: string | null; // cell id after this add-cell-bar
  setVisibility?: boolean; // optional prop setup
}

const AddCellBar: React.FC<AddCellBarProps> = ({ id, setVisibility }) => {
  const { insertCellBefore } = useAction();
  return (
    <div className={`add-cell-bar-wrapper ${setVisibility && 'set-visible'}`}>
      <div className='buttons'>
        <button className='button is-rounded is-success is-small' onClick={() => insertCellBefore(id, 'CODE')}>
          <span className='icon'>
            <i className='fas fa-plus'></i>
          </span>
          <span>Code Editor</span>
        </button>
        <button className='button is-rounded is-success is-small' onClick={() => insertCellBefore(id, 'MARKDOWN')}>
          <span className='icon'>
            <i className='fas fa-plus'></i>
          </span>
          <span>Markdown Editor</span>
        </button>
      </div>
      <div className='add-cell-divider'></div>
    </div>
  );
};

export default AddCellBar;
