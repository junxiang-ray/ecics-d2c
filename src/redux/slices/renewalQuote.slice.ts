import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RenewalQuote } from '@/libs/types/renewalQuote';

interface IdleWorkerState {
  isExpired: boolean;
  timeoutValue: number;
}
interface AppState {
  renewalQuote: RenewalQuote;
  idleWorker: IdleWorkerState;
}

const initialState: AppState = {
  renewalQuote: {} as RenewalQuote,
  idleWorker: {
    isExpired: false,
    timeoutValue: 0,
  },
};

const appSlice = createSlice({
  name: 'renewalQuote',
  initialState,
  reducers: {
    updateRenewalQuote(state, action: PayloadAction<Partial<RenewalQuote>>) {
      state.renewalQuote = { ...state.renewalQuote, ...action.payload };
    },
    resetRenewalQuote(state) {
      state.renewalQuote = {} as RenewalQuote;
    },
    setExpired(state, action: PayloadAction<boolean>) {
      state.idleWorker.isExpired = action.payload;
    },
    setTimeoutValue(state, action: PayloadAction<number>) {
      state.idleWorker.timeoutValue = action.payload;
    },
  },
});

export const {
  updateRenewalQuote,
  resetRenewalQuote,
  setExpired,
  setTimeoutValue,
} = appSlice.actions;

export default appSlice.reducer;
