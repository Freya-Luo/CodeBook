import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Builder } from '../builder';

/**
 * undefined: !! As BuilderState is a derived state of CellState, at the very first
 * beginning of the rendering process of the React App, no cells are rendered, which will
 * make the value of key "id" to be undefined.
 *
 * Explicitly defined this type to enable TS type check to handle the crash cases.
 */
interface BuilderState {
  [id: string]: Builder | undefined;
}

const initialState: BuilderState = {};

const BuilderReducer = produce((state: BuilderState = initialState, action: Action): BuilderState => {
  switch (action.type) {
    case ActionType.BUILD_START:
      state[action.payload.cellId] = {
        loading: true,
        code: '',
        err: '',
      };
      return state;
    case ActionType.BUILD_DONE:
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.output.code,
        err: action.payload.output.err,
      };
      return state;
    default:
      return state;
  }
});

export default BuilderReducer;
