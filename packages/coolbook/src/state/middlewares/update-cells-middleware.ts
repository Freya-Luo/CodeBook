import { Dispatch } from 'react';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { updateCellsToFile } from '../action-creators';
import { RootState } from '../reducers';

/**
 * This a middleware that dispatches the update cells actions to the "/cells".
 * 
 * Instead of dispatch this action in the cell-list component (in useEffect()), which
 * triggers useEffect() way too often, this middleware only cares about these
 * four actions that affects the data stored in the file. No change should be made to
 * the file if no "write" happens.
 * 
 * @param param store that refers to the current store
 * @returns the function that interferes the the original action result
 */
export const updateCellsToFileMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  // specify "write" operations type
  const actions: ActionType[] = [
    ActionType.MOVE_CELL,
    ActionType.UPDATE_CELL,
    ActionType.INSERT_CELL_AFTER,
    ActionType.DELETE_CELL,
  ];

  let timer: any;
  return (next: (action: Action) => void) => {  // 2nd function - actually the next middleware in the pipeline
    return (action: Action) => {
      next(action); // call next middleware in the pipeline

      if (actions.includes(action.type)) {
        if (timer) { // debounce
          clearTimeout(timer);
        }
        timer = setTimeout(async () => {
          await updateCellsToFile()(dispatch, getState); // actually dispatch the update cells to file action
        }, 300);
      }
    };
  };
};
