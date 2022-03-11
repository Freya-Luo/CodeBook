import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellState {
  loading: boolean;
  error: string | null;
  order: string[];
  orgs: {
    [id: string]: Cell;
  };
}

const initialState: CellState = {
  loading: false,
  error: null,
  order: [],
  orgs: {},
};

/**
 *
 */
const reducer = produce((state: CellState = initialState, action: Action): CellState => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.orgs[id].content = content;
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const fromIdx = state.order.findIndex((cellId) => cellId === action.payload.id);
      const toIdx = direction === 'UP' ? fromIdx - 1 : fromIdx + 1;
      // check index boundary
      if (toIdx < 0 || toIdx > state.order.length - 1) {
        return state;
      }
      // swap cell ids
      state.order[fromIdx] = state.order[toIdx];
      state.order[toIdx] = action.payload.id;
      return state;
    case ActionType.DELETE_CELL:
      delete state.orgs[action.payload]; // delete specific cell
      state.order = state.order.filter((id) => id !== action.payload); // delete the cell in the order list
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      const newCell: Cell = {
        id: genId(),
        cellType: action.payload.cellType,
        content: '',
      };

      state.orgs[newCell.id] = newCell;
      const index = state.order.findIndex((cellId) => cellId === action.payload.id);
      // if id is 'null', just push the id to the end of the order list
      if (index === -1) {
        state.order.push(newCell.id);
      } else {
        state.order.splice(index, 0, newCell.id);
      }
      return state;
    default:
      return state;
  }
});

const genId = (): string => {
  // 0-9 & a-z, using 36 as base to generate a really large number
  return Math.random().toString(36).substring(2, 5);
};
export default reducer;
