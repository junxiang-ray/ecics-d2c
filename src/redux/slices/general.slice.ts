import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  promoCodeError: { message: string } | null;
  isLoadingStep?: boolean;
  isSingpassFlow: boolean;
  isSingpassFlowRenewal: boolean;
}

const initialState: AppState = {
  promoCodeError: null,
  isLoadingStep: false,
  isSingpassFlow: false,
  isSingpassFlowRenewal: false,
};

const appSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setPromoCodeError(
      state,
      action: PayloadAction<{ message: string } | null>,
    ) {
      state.promoCodeError = action.payload;
    },
    setIsLoadingStep(state, action: PayloadAction<boolean>) {
      state.isLoadingStep = action.payload;
    },
    setIsSingpassFlow(state, action: PayloadAction<boolean>) {
      state.isSingpassFlow = action.payload;
    },
    setIsSingpassFlowRenewal(state, action: PayloadAction<boolean>) {
      state.isSingpassFlowRenewal = action.payload;
    },
  },
});

export const {
  setPromoCodeError,
  setIsLoadingStep,
  setIsSingpassFlow,
  setIsSingpassFlowRenewal,
} = appSlice.actions;

export default appSlice.reducer;
