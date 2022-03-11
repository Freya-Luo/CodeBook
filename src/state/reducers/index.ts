import CellReducer from './cell-reducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  cell: CellReducer,
});

export default reducers;

// type that describes the overall structure of the State in the redux store
// Applied e.g., in useSelector() hook.
export type RootState = ReturnType<typeof reducers>;
