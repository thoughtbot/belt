import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Typed versions of react-redux's hooks, scoped to this app's store shape
// and dispatch type. Prefer these over importing useDispatch/useSelector
// directly in components — see the Redux Toolkit + TypeScript docs.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
