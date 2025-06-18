import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import appReducer from './slices/app.slice';
import maidQuoteReducer from './slices/maidQuote.slice';
import quoteReducer from './slices/quote.slice';

const store = configureStore({
  reducer: {
    app: appReducer,
    quote: quoteReducer,
    maidQuote: maidQuoteReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
