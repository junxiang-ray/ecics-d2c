import { Quote } from '@/libs/types/quote';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  quote: Quote;
}

const initialState: AppState = {
  quote: {} as Quote,
};

const appSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    updateQuote(state, action: PayloadAction<Partial<Quote>>) {
      state.quote = { ...state.quote, ...action.payload };
    },
    clearQuote(state) {
      state.quote = {} as Quote;
    },
  },
});

export const { updateQuote, clearQuote } = appSlice.actions;

export default appSlice.reducer;
