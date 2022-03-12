import { Fragment } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCellBar from './add-cell-bar';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cell: { order, orgs } }) => {
    return order.map((cellId) => orgs[cellId]);
  });

  // give a key prop when looping items
  const editorCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCellBar id={cell.id} />
    </Fragment>
  ));

  return (
    <div>
      <AddCellBar id={null} setVisibility={cells.length === 0}></AddCellBar>
      {editorCells}
    </div>
  );
};
export default CellList;
