import { Dispatch } from 'react';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { updateCells } from '../action-creators';
import { RootState } from '../reducers';

/**
 *
 * @param param
 * @returns
 */
export const updateCellsMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  const actions: ActionType[] = [
    ActionType.MOVE_CELL,
    ActionType.UPDATE_CELL,
    ActionType.INSERT_CELL_AFTER,
    ActionType.DELETE_CELL,
  ];

  let timer: any;
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action);

      if (actions.includes(action.type)) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(async () => {
          await updateCells()(dispatch, getState);
        }, 300);
      }
    };
  };
};
