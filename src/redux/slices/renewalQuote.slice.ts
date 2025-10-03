import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RenewalQuote } from '@/libs/types/renewalQuote';

interface IdleWorkerState {
  isExpired: boolean;
  timeoutValue: number;
}

interface Policy {
  policy_no: string;
  veh_reg_no: string;
  expiry_date: string;
  dob: string;
  product: string;
  plan: string;
  status: string;
}

interface VehData {
  insuredname: string;
  policies: Policy[];
}

interface RenewalQuoteState {
  renewalQuote: RenewalQuote | null;
  idleWorker: IdleWorkerState;
  renewalKey: string | null;
  editRenewal?: boolean;
  productType?: string;
  vehData?: VehData | null;
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
  vehData: null,
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
    updateVehData(state, action: PayloadAction<VehData>) {
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
