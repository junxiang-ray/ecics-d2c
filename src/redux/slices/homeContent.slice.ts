import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HomeContentQuote } from '@/libs/types/homeContents';

interface AppState {
  homeContentQuote: HomeContentQuote;
}

const initialState: AppState = {
  homeContentQuote: {} as HomeContentQuote,
};

const appSlice = createSlice({
  name: 'maidQuote',
  initialState,
  reducers: {
    updateHomeContentQuote(
      state,
      action: PayloadAction<Partial<HomeContentQuote>>,
    ) {
      state.homeContentQuote = { ...state.homeContentQuote, ...action.payload };
    },
    clearHomeContentQuote(state) {
      state.homeContentQuote = {} as HomeContentQuote;
    },
  },
});

export const { updateHomeContentQuote, clearHomeContentQuote } =
  appSlice.actions;

export default appSlice.reducer;
