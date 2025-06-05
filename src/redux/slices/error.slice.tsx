import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
  message: string;
  status: number;
}

const initialState: ErrorState = {
  message: '',
  status: 0,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setErrorSlice(state, action: PayloadAction<ErrorState>) {
      state.message = action.payload.message;
      state.status = action.payload.status;
    },
    clearError(state) {
      state.message = '';
      state.status = 0;
    },
  },
});
export const { setErrorSlice, clearError } = errorSlice.actions;
export default errorSlice.reducer;
