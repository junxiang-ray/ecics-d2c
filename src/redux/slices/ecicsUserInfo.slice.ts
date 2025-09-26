import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MaidQuote } from '@/libs/types/maidQuote';

interface EcicsUserInfoState {
  userInfo: MaidQuote | null;
}

const initialState: EcicsUserInfoState = {
  userInfo: null,
};

const ecicsUserInfoSlice = createSlice({
  name: 'ecicsUserInfo',
  initialState,
  reducers: {
    updateEcicsUserInfo(state, action: PayloadAction<Partial<MaidQuote>>) {
      state.userInfo = {
        ...(state.userInfo ?? {}),
        ...action.payload,
      } as MaidQuote;
    },
  },
});

export const { updateEcicsUserInfo } = ecicsUserInfoSlice.actions;

export default ecicsUserInfoSlice.reducer;
