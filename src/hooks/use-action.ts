import { useDispatch } from 'react-redux';
import { actionCreators } from '../state';
import { bindActionCreators } from 'redux';

/**
 * This is a hook that binds dispatch to the action creators so that
 * directly calling the action creator will fire off the dispatching process.
 *
 * E.g., The old way of calling dispatch: dispatch(actionCreators.updateCell(id, ...));
 * => A new way: updateCell(id, ...);
 *
 * @returns an object with each key as an action creator wrapped by a dispatch()
 * sth like this: { updateCell: dispatch(actionCreators.updateCell) }
 */
export const useAction = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actionCreators, dispatch);
};
