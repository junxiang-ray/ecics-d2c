import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EcicsUserInfoState {
  userInfo: string | null;
}

const initialState: EcicsUserInfoState = {
  userInfo: null,
};

const ecicsUserInfoSlice = createSlice({
  name: 'ecicsUserInfo',
  initialState,
  reducers: {
    updateEcicsUserInfo(state, action: PayloadAction<string>) {
      state.userInfo = action.payload;
    },
  },
});

export const { updateEcicsUserInfo } = ecicsUserInfoSlice.actions;

export default ecicsUserInfoSlice.reducer;
