import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import storage from './storage';
import appReducer from '../slices/app.slice';
import generalReducer from '../slices/general.slice';
import maidQuoteReducer from '../slices/maidQuote.slice';
import quoteReducer from '../slices/quote.slice';
import renewalQuoteReducer from '../slices/renewalQuote.slice';
import userInfoCarReducer from '../slices/userInfoCar.slice';

// Root reducer
const rootReducer = combineReducers({
  app: appReducer,
  general: generalReducer,
  maidQuote: maidQuoteReducer,
  quote: quoteReducer,
  renewalQuote: renewalQuoteReducer,
  userInfoCar: userInfoCarReducer,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app', 'general', 'renewalQuote'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Types hook
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
