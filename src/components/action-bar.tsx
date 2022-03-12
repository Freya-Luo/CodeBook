import './action-bar.css';
import { useAction } from '../hooks/use-action';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useAction();
  return (
    <div className='action-bar'>
      <button className='button is-success is-small' onClick={() => moveCell(id, 'UP')}>
        <span className='icon'>
          <i className='fas fa-arrow-up'></i>
        </span>
      </button>
      <button className='button is-success is-small' onClick={() => moveCell(id, 'DOWN')}>
        <span className='icon'>
          <i className='fas fa-arrow-down'></i>
        </span>
      </button>
      <button className='button is-success is-small' onClick={() => deleteCell(id)}>
        <span className='icon'>
          <i className='fas fa-times'></i>
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
