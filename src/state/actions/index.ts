import { ActionType } from '../action-types';
import { CellType } from '../cell';

export type Direction = 'UP' | 'DOWN';
export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string; // cell id
}

export interface InsertCellBeforeAction {
  type: ActionType.INSERT_CELL_BEFORE;
  payload: {
    id: string | null; // 'to' cell id
    cellType: CellType; // 'to' cell type
  };
}

export type Action = UpdateCellAction | MoveCellAction | DeleteCellAction | InsertCellBeforeAction;
