import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IdleState {
  isExpired: boolean;
  timeoutValue: number | null;
}

const initialState: IdleState = {
  isExpired: false,
  timeoutValue: null,
};

const appSlice = createSlice({
  name: 'idleWorker',
  initialState,
  reducers: {
    setExpired(state, action: PayloadAction<boolean>) {
      state.isExpired = action.payload;
    },
    setTimeoutValue(state, action: PayloadAction<number>) {
      state.timeoutValue = action.payload;
    },
  },
});

export const { setExpired, setTimeoutValue } = appSlice.actions;
export default appSlice.reducer;
