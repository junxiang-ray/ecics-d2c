import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RenewalQuote } from '@/libs/types/renewalQuote';

interface AppState {
  renewalQuote: RenewalQuote;
}

const initialState: AppState = {
  renewalQuote: {} as RenewalQuote,
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
  },
});

export const { updateRenewalQuote, resetRenewalQuote } = appSlice.actions;

export default appSlice.reducer;
