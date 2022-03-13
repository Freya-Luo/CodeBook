import './cell-list.css';
import { Fragment, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/use-typed-selector';
import CellListItem from './cell-list-item/cell-list-item';
import AddCellBar from '../add-cell-bar/add-cell-bar';
import { useAction } from '../../hooks/use-action';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, orgs } }) => {
    return order.map((cellId) => orgs[cellId]);
  });
  const { fetchCells } = useAction();

  useEffect(() => {
    fetchCells(); // initially, store the Cell[] info to the store "cells" state
    // eslint-disable-next-line
  }, []);

  // give a key prop when looping items
  const editorCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCellBar id={cell.id} />
    </Fragment>
  ));

  return (
    <div className='cell-list-wrapper'>
      <AddCellBar id={null} setVisibility={cells.length === 0}></AddCellBar>
      {editorCells}
    </div>
  );
};
export default CellList;
