import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state';

/**
 * Explicitly define the type of the statet pram in the useSelector() hook.
 * Ref: https://fernandobelotto.github.io/react-redux/next/using-react-redux/static-typing/
 */
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
