import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { Quote } from '@/libs/types/quote';

interface MatchedMakeModel {
  make: string;
  model: string;
}

interface AppState {
  quote: Quote;
  matchedMakeModel?: MatchedMakeModel;
}

const initialState: AppState = {
  quote: {} as Quote,
  matchedMakeModel: undefined,
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
    saveMatchedMakeModel(state, action: PayloadAction<MatchedMakeModel>) {
      state.matchedMakeModel = action.payload;
    },
    clearMatchedMakeModel(state) {
      state.matchedMakeModel = undefined;
    },
  },
});

export const {
  updateQuote,
  clearQuote,
  saveMatchedMakeModel,
  clearMatchedMakeModel,
} = appSlice.actions;

export const useAddNamedDriverInfo = () => {
  return useSelector(
    (state: { quote: AppState }) =>
      state.quote.quote?.data?.add_named_driver_info,
  );
};

export default appSlice.reducer;
