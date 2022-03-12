import { ActionType } from '../action-types';
import {
  Action,
  UpdateCellAction,
  MoveCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  Direction,
  BuildStartAction,
  BuildDoneAction,
} from '../actions';

import { CellType } from '../cell';
import { Dispatch } from 'react';
import Builder from '../../builder';

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const insertCellAfter = (id: string | null, cellType: CellType): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      cellType,
    },
  };
};

export const createBuilder = (cellId: string, inputCode: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUILD_START,
      payload: {
        cellId,
      },
    });

    const { code, err } = await Builder(inputCode);

    dispatch({
      type: ActionType.BUILD_DONE,
      payload: {
        cellId,
        output: {
          code,
          err,
        },
      },
    });
  };
};
