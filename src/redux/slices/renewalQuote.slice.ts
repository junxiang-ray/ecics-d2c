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
  editRenewal?: boolean;
  productType?: string;
  vehData?: any[];
}

const initialState: RenewalQuoteState = {
  renewalQuote: null,
  idleWorker: {
    isExpired: false,
    timeoutValue: 0,
  },
  renewalKey: null,
  editRenewal: false,
  productType: undefined,
  vehData: [],
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
    resetRenewalQuote: () => ({ ...initialState }),
    setExpired(state, action: PayloadAction<boolean>) {
      state.idleWorker.isExpired = action.payload;
    },
    setTimeoutValue(state, action: PayloadAction<number>) {
      state.idleWorker.timeoutValue = action.payload;
    },
    setEditRenewal(state, action: PayloadAction<boolean>) {
      state.editRenewal = action.payload;
    },
    setProductType(state, action: PayloadAction<string>) {
      state.productType = action.payload;
    },
    updateVehData(state, action: PayloadAction<any[]>) {
      state.vehData = action.payload;
    },
  },
});

export const {
  updateRenewalQuote,
  setRenewalKey,
  resetRenewalQuote,
  setExpired,
  setTimeoutValue,
  setEditRenewal,
  setProductType,
  updateVehData,
} = renewalQuoteSlice.actions;

export default renewalQuoteSlice.reducer;
