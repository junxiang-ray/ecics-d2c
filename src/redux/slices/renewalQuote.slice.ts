import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RenewalQuote } from '@/libs/types/renewalQuote';

interface RenewalQuoteState {
  renewalQuote: RenewalQuote | null;
  renewalKey: string | null;
}

const initialState: RenewalQuoteState = {
  renewalQuote: null,
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
  },
});

export const { updateRenewalQuote, setRenewalKey, resetRenewalQuote } =
  renewalQuoteSlice.actions;

export default renewalQuoteSlice.reducer;
