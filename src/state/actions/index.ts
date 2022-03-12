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

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null; // 'to' cell id
    cellType: CellType; // 'to' cell type
  };
}

export interface BuildStartAction {
  type: ActionType.BUILD_START;
  payload: {
    cellId: string; // cell id
  };
}

export interface BuildDoneAction {
  type: ActionType.BUILD_DONE;
  payload: {
    cellId: string;
    output: {
      code: string;
      err: string;
    };
  };
}

export type Action =
  | UpdateCellAction
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | BuildStartAction
  | BuildDoneAction;
