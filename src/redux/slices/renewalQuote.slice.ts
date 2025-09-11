import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RenewalQuote } from '@/libs/types/renewalQuote';

interface IdleWorkerState {
  isExpired: boolean;
  timeoutValue: number;
}

interface RenewalQuoteState {
  renewalQuote: RenewalQuote | null;
  idleWorker: IdleWorkerState;
  renewalKey: string | null;
}

const initialState: RenewalQuoteState = {
  renewalQuote: {} as RenewalQuote,
  idleWorker: {
    isExpired: false,
    timeoutValue: 0,
  },
  // renewalQuote: null,
  renewalKey: null,
};

const renewalQuoteSlice = createSlice({
  name: 'renewalQuote',
  initialState,
  reducers: {
    updateRenewalQuote(state, action: PayloadAction<Partial<RenewalQuote>>) {
      state.renewalQuote = {
        ...(state.renewalQuote ?? {}),
        ...action.payload,
      } as RenewalQuote;
    },
    setRenewalKey(state, action: PayloadAction<string>) {
      state.renewalKey = action.payload;
    },
    resetRenewalQuote: () => initialState,
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
  setRenewalKey,
  resetRenewalQuote,
  setExpired,
  setTimeoutValue,
} = renewalQuoteSlice.actions;

export default renewalQuoteSlice.reducer;
