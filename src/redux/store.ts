import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { ReducersMapObject } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

/**
 * createAppStore - creates a Redux store from a reducers map.
 *
 * Use createAppStore to build a typed store for your app by passing an object
 * of slice reducers: createAppStore({ user: userReducer, product: productReducer })
 */
export function createAppStore<S extends ReducersMapObject = ReducersMapObject>(reducers: S = {} as S) {
		const rootReducer = combineReducers(reducers as unknown as ReducersMapObject);

	const store = configureStore({ reducer: rootReducer });

	return store;
}

// Default empty store (use createAppStore in your app entry to provide actual reducers)
export const store = createAppStore({});

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
