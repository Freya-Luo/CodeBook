import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import Builder from '../Builder';

interface BuilderState {
  [id: string]: Builder;
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
