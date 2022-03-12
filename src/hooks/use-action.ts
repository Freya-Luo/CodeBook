import { useDispatch } from 'react-redux';
import { actionCreators } from '../state';
import { bindActionCreators } from 'redux';
import { useMemo } from 'react';

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

  // dispatch is safe to use as this reference will be stable as long as the same store instance is
  // being passed to the <Provider />
  // For each code cell, we do not want to have multiple Builders for every re-render process,
  // so using useMemo() to bind the actionCreators only 1 single time and generate only 1 Builder in code-cell.tsx.
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
