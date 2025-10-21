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

import appReducer from '@/redux/slices/app.slice';
import ecicsUserInfoReducer from '@/redux/slices/ecicsUserInfo.slice';
import generalReducer from '@/redux/slices/general.slice';
import maidQuoteReducer from '@/redux/slices/maidQuote.slice';
import quoteReducer from '@/redux/slices/quote.slice';
import renewalQuoteReducer from '@/redux/slices/renewalQuote.slice';
import userInfoCarReducer from '@/redux/slices/userInfoCar.slice';
import storage from '@/redux/store/storage';

// Root reducer
const rootReducer = combineReducers({
  app: appReducer,
  general: generalReducer,
  maidQuote: maidQuoteReducer,
  quote: quoteReducer,
  renewalQuote: renewalQuoteReducer,
  userInfoCar: userInfoCarReducer,
  ecicsUserInfo: ecicsUserInfoReducer,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app', 'general', 'renewalQuote', 'ecicsUserInfo', 'userInfoCar'],
};

// Persisted reducer
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

// Custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
