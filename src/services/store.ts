// src/services/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import ingredientsReducer from './slices/ingredients-slice';
import ordersReducer from './slices/orders-slice';
import userReducer from './slices/user-slice';
import feedReducer from './slices/feed-slice';
import constructorReducer from './slices/constructor-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  order: ordersReducer,
  constructorBurger: constructorReducer,
  feed: feedReducer,
  user: userReducer
});
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
