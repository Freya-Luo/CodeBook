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
  FetchCellsAction,
  FetchCellsSuccessAction,
  FetchCellsFailAction,
  UpdateCellsFailAction,
} from '../actions';
import { Cell, CellType } from '../cell';
import { Dispatch } from 'react';
import Builder from '../../builder';
import axios from 'axios';
import { RootState } from '../reducers';

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

// using Thunk to support action creators return a function instead of just an Action object
export const createBuilder = (cellId: string, inputCode: string) => {
  return async (dispatch: Dispatch<Action>) => {
    const buildStart: BuildStartAction = {
      type: ActionType.BUILD_START,
      payload: {
        cellId,
      },
    };
    dispatch(buildStart); // send syn start building action

    // actually asyn processing transpiling and bundling
    const { code, err } = await Builder(inputCode);

    const buildDone: BuildDoneAction = {
      type: ActionType.BUILD_DONE,
      payload: {
        cellId,
        output: {
          code,
          err,
        },
      },
    };
    dispatch(buildDone); // send syn building done action
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Action>) => {
    const fetchCells: FetchCellsAction = {
      type: ActionType.FETCH_CELLS,
    };
    dispatch(fetchCells);

    try {
      const { data }: { data: Cell[] } = await axios.get('/cells');

      const fetchCellsSuccess: FetchCellsSuccessAction = {
        type: ActionType.FETCH_CELLS_SUCCESS,
        payload: data,
      };
      dispatch(fetchCellsSuccess);
    } catch (err: any) {
      const fetchCellsFail: FetchCellsFailAction = {
        type: ActionType.FETCH_CELLS_FAIL,
        payload: err.message,
      };
      dispatch(fetchCellsFail);
    }
  };
};

export const updateCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      cells: { orgs, order },
    } = getState();

    const updatedCells = order.map((id) => orgs[id]);
    try {
      // follow the same interface defined in  routes/cells.ts
      await axios.post('/cells', { cells: updatedCells });
    } catch (err: any) {
      const updateCellsFail: UpdateCellsFailAction = {
        type: ActionType.UPDATE_CELLS_FAIL,
        payload: err.message,
      };
      dispatch(updateCellsFail);
    }
  };
};
