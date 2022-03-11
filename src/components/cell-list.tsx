import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cell: { order, orgs } }) => {
    return order.map((cellId) => orgs[cellId]);
  });

  const editorCells = cells.map((cell) => <CellListItem key={cell.id} cell={cell} />);
  return <div>{editorCells}</div>;
};
export default CellList;
