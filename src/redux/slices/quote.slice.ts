import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { Quote } from '@/libs/types/quote';

interface AppState {
  quote: Quote;
  promoCodeError: { message: string } | null;
  isLoadingStep?: boolean;
}

const initialState: AppState = {
  quote: {} as Quote,
  promoCodeError: null,
  isLoadingStep: false,
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
    setPromoCodeError(
      state,
      action: PayloadAction<{ message: string } | null>,
    ) {
      state.promoCodeError = action.payload;
    },
    setIsLoadingStep(state, action: PayloadAction<boolean>) {
      state.isLoadingStep = action.payload;
    },
  },
});

export const { updateQuote, clearQuote, setPromoCodeError, setIsLoadingStep } =
  appSlice.actions;

export const useAddNamedDriverInfo = () => {
  return useSelector(
    (state: { quote: AppState }) =>
      state.quote.quote?.data?.add_named_driver_info,
  );
};

export default appSlice.reducer;
