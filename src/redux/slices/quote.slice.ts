import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {}

const initialState: AppState = {
  quote: {},
};

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    updateQuote: (state, action: PayloadAction<any>) => {
      const { data } = action.payload;
      state.quote = action.payload;
    },
  },
});

export const {} = quoteSlice.actions;

export default quoteSlice.reducer;
