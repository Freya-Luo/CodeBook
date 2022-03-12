import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Builder } from '../builder';

/**
 * undefined: !! As 2 cell creation actions are dispatched initially in store.ts,
 * at the very first beginning of the rendering process, no actions related to building
 * process are dispatched. ("action.type" is unknown as in the parameter => BuilderState undefined)
 *
 * Explicitly defined this type to enable TS type check to handle the crashing cases.
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
