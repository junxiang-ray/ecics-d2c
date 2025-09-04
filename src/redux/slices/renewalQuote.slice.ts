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
  },
});

export const { updateRenewalQuote } = appSlice.actions;

export default appSlice.reducer;
